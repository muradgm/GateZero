import { Float, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getStageIndex, type ExperienceStageId } from "../engine/stages";

type EvidenceMachineProps = {
  stage: ExperienceStageId;
  reducedMotion: boolean;
};

const particleCount = 28;

export function EvidenceMachine({ stage, reducedMotion }: EvidenceMachineProps) {
  const group = useRef<THREE.Group>(null);
  const particles = useRef<THREE.InstancedMesh>(null);
  const riskWall = useRef<THREE.Mesh>(null);
  const auditRecord = useRef<THREE.Mesh>(null);
  const stageIndex = getStageIndex(stage);

  const particleData = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, index) => ({
        start: new THREE.Vector3(-5.2 + (index % 4) * 0.28, -2.3 + (index % 10) * 0.5, -1.1 + (index % 5) * 0.42),
        framed: new THREE.Vector3(-1.6 + (index % 7) * 0.52, -1.5 + Math.floor(index / 7) * 0.9, 0.1 + (index % 3) * 0.2),
        contradictory: index % 6 === 0,
        stale: index % 7 === 0,
        phase: index * 0.47
      })),
    []
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const cyan = useMemo(() => new THREE.Color("#25d4ff"), []);
  const amber = useMemo(() => new THREE.Color("#ffb84d"), []);
  const muted = useMemo(() => new THREE.Color("#70808a"), []);

  useFrame(({ clock, camera }) => {
    const time = clock.getElapsedTime();
    const ease = reducedMotion ? 1 : 0.055;

    if (group.current) {
      const targetY = reducedMotion ? 0 : Math.sin(time * 0.35) * 0.04;
      group.current.position.y += (targetY - group.current.position.y) * ease;
      group.current.rotation.y += ((stageIndex >= 6 ? 0.02 : 0.27) - group.current.rotation.y) * ease;
    }

    if (riskWall.current) {
      const targetScale = stageIndex >= 3 && stageIndex < 5 ? 1 : 0.001;
      riskWall.current.scale.y += (targetScale - riskWall.current.scale.y) * ease;
    }

    if (auditRecord.current) {
      const visible = stageIndex >= 5;
      const target = visible ? 1 : 0.001;
      auditRecord.current.scale.lerp(new THREE.Vector3(target, target, target), ease);
      auditRecord.current.rotation.y = visible && !reducedMotion ? Math.sin(time * 0.3) * 0.08 : 0;
    }

    if (particles.current) {
      particleData.forEach((item, index) => {
        const target = item.start.clone();
        if (stageIndex >= 1) target.copy(item.framed);
        if (stageIndex >= 2 && item.contradictory) target.z = 1.45;
        if (stageIndex >= 3 && item.contradictory) target.x = 0.75;
        if (stageIndex >= 4 && item.contradictory) target.set(2.2, -0.9 + (index % 4) * 0.6, 0.5);
        if (stageIndex >= 5) target.set(3.65, -0.85 + (index % 7) * 0.27, 0.06);
        if (stageIndex >= 6) target.set(2.5 + (index % 4) * 0.65, -1.35 + Math.floor(index / 4) * 0.42, -0.4);

        dummy.position.lerpVectors(item.start, target, reducedMotion ? 1 : Math.min(1, 0.25 + stageIndex * 0.15));
        if (!reducedMotion && stageIndex < 5) dummy.position.y += Math.sin(time * 0.7 + item.phase) * 0.05;
        dummy.scale.setScalar(item.stale ? 0.055 : 0.075);
        dummy.rotation.set(time * 0.12, time * 0.17 + item.phase, 0);
        dummy.updateMatrix();
        particles.current?.setMatrixAt(index, dummy.matrix);
        particles.current?.setColorAt(index, item.contradictory ? amber : item.stale ? muted : cyan);
      });
      particles.current.instanceMatrix.needsUpdate = true;
      if (particles.current.instanceColor) particles.current.instanceColor.needsUpdate = true;
    }

    const targetCameraX = stageIndex >= 6 ? 1.8 : 0.55;
    const targetCameraZ = stageIndex >= 6 ? 10.3 : 11.8;
    camera.position.x += (targetCameraX - camera.position.x) * ease * 0.55;
    camera.position.z += (targetCameraZ - camera.position.z) * ease * 0.55;
    camera.lookAt(stageIndex >= 6 ? 1.1 : 0, 0, 0);
  });

  return (
    <group ref={group} rotation={[-0.08, 0.27, -0.02]}>
      <Float speed={reducedMotion ? 0 : 0.5} rotationIntensity={0.04} floatIntensity={0.06}>
        <group position={[-1.25, 0, 0]}>
          <RoundedBox args={[0.32, 5.2, 0.48]} position={[-2.3, 0, 0]} radius={0.12}>
            <meshStandardMaterial color="#a6b0b5" metalness={0.72} roughness={0.22} />
          </RoundedBox>
          <RoundedBox args={[3.05, 0.32, 0.48]} position={[-0.82, 2.55, 0]} radius={0.12}>
            <meshStandardMaterial color="#a6b0b5" metalness={0.72} roughness={0.22} />
          </RoundedBox>
          <RoundedBox args={[0.32, 5.2, 0.48]} position={[2.3, 0, -0.3]} radius={0.12}>
            <meshStandardMaterial color="#242b2f" metalness={0.68} roughness={0.24} />
          </RoundedBox>
          <RoundedBox args={[3.05, 0.32, 0.48]} position={[0.82, -2.55, -0.3]} radius={0.12}>
            <meshStandardMaterial color="#242b2f" metalness={0.68} roughness={0.24} />
          </RoundedBox>
          <mesh position={[0, 0, 0.18]} scale={stageIndex >= 2 ? 1 : 0.72}>
            <circleGeometry args={[1.65, 96]} />
            <meshStandardMaterial color="#25d4ff" emissive="#25d4ff" emissiveIntensity={stageIndex >= 2 ? 2.4 : 0.6} transparent opacity={stageIndex >= 2 ? 0.16 : 0.05} />
          </mesh>
        </group>

        <mesh ref={riskWall} position={[0.8, 0, 0.05]} scale={[1, 0.001, 1]}>
          <boxGeometry args={[0.18, 4.8, 3.1]} />
          <meshPhysicalMaterial color="#6e2c00" emissive="#ff8f21" emissiveIntensity={0.55} metalness={0.35} roughness={0.3} transparent opacity={0.82} />
        </mesh>

        <mesh position={[2.2, 0, 0.56]}>
          <torusGeometry args={[0.72, 0.055, 12, 96]} />
          <meshBasicMaterial color="#25d4ff" transparent opacity={stageIndex >= 4 ? 0.72 : 0.12} />
        </mesh>

        <mesh ref={auditRecord} position={[3.65, 0, -0.08]} scale={0.001}>
          <boxGeometry args={[1.55, 2.15, 0.18]} />
          <meshPhysicalMaterial color="#bdf7ff" emissive="#25d4ff" emissiveIntensity={1.8} metalness={0.28} roughness={0.18} transparent opacity={0.78} />
        </mesh>

        <instancedMesh ref={particles} args={[undefined, undefined, particleCount]}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial vertexColors />
        </instancedMesh>
      </Float>
    </group>
  );
}
