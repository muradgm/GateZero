import { Float, Html, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getStageIndex, type ExperienceStageId } from "../engine/stages";
import { energyFragmentShader, energyVertexShader } from "../shaders/energy";

type EvidenceMachineProps = {
  stage: ExperienceStageId;
  reducedMotion: boolean;
};

type ParticleDatum = {
  start: THREE.Vector3;
  framed: THREE.Vector3;
  verified: THREE.Vector3;
  contradictory: boolean;
  stale: boolean;
  phase: number;
};

const particleCount = 72;

function MechanicalRing({ radius, tube, depth = 0, color = "#9da8ae", opacity = 1 }: { radius: number; tube: number; depth?: number; color?: string; opacity?: number }) {
  return (
    <mesh position={[0, 0, depth]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, tube, 18, 128]} />
      <meshPhysicalMaterial color={color} metalness={0.78} roughness={0.2} clearcoat={0.9} clearcoatRoughness={0.14} transparent opacity={opacity} />
    </mesh>
  );
}

function GateHousing() {
  return (
    <group>
      <RoundedBox args={[0.36, 5.55, 0.68]} position={[-2.7, 0, 0]} radius={0.12}>
        <meshPhysicalMaterial color="#9da8ae" metalness={0.8} roughness={0.2} clearcoat={0.8} />
      </RoundedBox>
      <RoundedBox args={[3.35, 0.36, 0.68]} position={[-1.2, 2.7, 0]} radius={0.12}>
        <meshPhysicalMaterial color="#9da8ae" metalness={0.8} roughness={0.2} clearcoat={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.36, 5.55, 0.68]} position={[2.7, 0, -0.28]} radius={0.12}>
        <meshPhysicalMaterial color="#242b2f" metalness={0.74} roughness={0.24} clearcoat={0.7} />
      </RoundedBox>
      <RoundedBox args={[3.35, 0.36, 0.68]} position={[1.2, -2.7, -0.28]} radius={0.12}>
        <meshPhysicalMaterial color="#242b2f" metalness={0.74} roughness={0.24} clearcoat={0.7} />
      </RoundedBox>
      <RoundedBox args={[5.7, 0.22, 1.7]} position={[0, -2.98, -0.4]} radius={0.08}>
        <meshPhysicalMaterial color="#11171b" metalness={0.66} roughness={0.3} />
      </RoundedBox>
    </group>
  );
}

export function EvidenceMachine({ stage, reducedMotion }: EvidenceMachineProps) {
  const group = useRef<THREE.Group>(null);
  const particles = useRef<THREE.InstancedMesh>(null);
  const energyMaterial = useRef<THREE.ShaderMaterial>(null);
  const riskWall = useRef<THREE.Mesh>(null);
  const riskRails = useRef<THREE.Group>(null);
  const operatorCore = useRef<THREE.Group>(null);
  const auditRecord = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);
  const stageIndex = getStageIndex(stage);

  const particleData = useMemo<ParticleDatum[]>(
    () =>
      Array.from({ length: particleCount }, (_, index) => {
        const lane = index % 9;
        const row = Math.floor(index / 9);
        return {
          start: new THREE.Vector3(-7 + (index % 6) * 0.38, -2.45 + lane * 0.58, -1.5 + (index % 7) * 0.42),
          framed: new THREE.Vector3(-2.45 + (index % 11) * 0.44, -1.9 + row * 0.58, -0.35 + (index % 4) * 0.24),
          verified: new THREE.Vector3(-0.9 + (index % 9) * 0.24, -1.65 + row * 0.48, 0.22 + (index % 3) * 0.18),
          contradictory: index % 8 === 0 || index % 13 === 0,
          stale: index % 11 === 0,
          phase: index * 0.37
        };
      }),
    []
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const cyan = useMemo(() => new THREE.Color("#25d4ff"), []);
  const amber = useMemo(() => new THREE.Color("#ff9a2f"), []);
  const muted = useMemo(() => new THREE.Color("#62727c"), []);

  useFrame(({ clock, camera }) => {
    const time = clock.getElapsedTime();
    const ease = reducedMotion ? 1 : 0.055;

    if (group.current) {
      const targetY = reducedMotion ? 0 : Math.sin(time * 0.28) * 0.035;
      group.current.position.y += (targetY - group.current.position.y) * ease;
      group.current.rotation.y += ((stageIndex >= 6 ? 0.02 : 0.2) - group.current.rotation.y) * ease;
    }

    if (energyMaterial.current) {
      energyMaterial.current.uniforms.uTime.value = time;
      energyMaterial.current.uniforms.uIntensity.value += ((stageIndex >= 2 ? 1 : 0.3) - energyMaterial.current.uniforms.uIntensity.value) * ease;
    }

    if (ringA.current && !reducedMotion) ringA.current.rotation.z = time * 0.08;
    if (ringB.current && !reducedMotion) ringB.current.rotation.z = -time * 0.11;
    if (ringC.current && !reducedMotion) ringC.current.rotation.z = time * 0.16;

    if (riskWall.current) {
      const targetScale = stageIndex >= 3 && stageIndex < 5 ? 1 : 0.001;
      riskWall.current.scale.y += (targetScale - riskWall.current.scale.y) * ease;
    }

    if (riskRails.current) {
      const target = stageIndex >= 3 && stageIndex < 5 ? 1 : 0.72;
      riskRails.current.scale.y += (target - riskRails.current.scale.y) * ease;
    }

    if (operatorCore.current) {
      const target = stageIndex >= 4 ? 1 : 0.74;
      operatorCore.current.scale.lerp(new THREE.Vector3(target, target, target), ease);
      if (!reducedMotion) operatorCore.current.rotation.z = Math.sin(time * 0.32) * 0.05;
    }

    if (auditRecord.current) {
      const visible = stageIndex >= 5;
      const target = visible ? 1 : 0.001;
      auditRecord.current.scale.lerp(new THREE.Vector3(target, target, target), ease);
      auditRecord.current.rotation.y = visible && !reducedMotion ? Math.sin(time * 0.26) * 0.07 : 0;
    }

    if (particles.current) {
      particleData.forEach((item, index) => {
        const target = item.start.clone();
        if (stageIndex >= 1) target.copy(item.framed);
        if (stageIndex >= 2) target.copy(item.verified);
        if (stageIndex >= 2 && item.contradictory) target.set(0.15, item.verified.y * 0.72, 1.4 + (index % 3) * 0.18);
        if (stageIndex >= 3 && item.contradictory) target.set(1.1, item.verified.y * 0.72, 1.3);
        if (stageIndex >= 4 && item.contradictory) target.set(3.05, -1.15 + (index % 5) * 0.56, 0.48);
        if (stageIndex >= 5) target.set(4.55, -1.05 + (index % 9) * 0.25, -0.04 + Math.floor(index / 9) * 0.035);
        if (stageIndex >= 6) target.set(2.75 + (index % 6) * 0.48, -1.55 + Math.floor(index / 6) * 0.32, -0.48);

        const progress = reducedMotion ? 1 : Math.min(1, 0.22 + stageIndex * 0.14);
        dummy.position.lerpVectors(item.start, target, progress);
        if (!reducedMotion && stageIndex < 5) {
          dummy.position.y += Math.sin(time * 0.9 + item.phase) * 0.045;
          dummy.position.z += Math.cos(time * 0.55 + item.phase) * 0.025;
        }
        dummy.scale.setScalar(item.stale ? 0.045 : item.contradictory ? 0.078 : 0.062);
        dummy.rotation.set(time * 0.16, time * 0.22 + item.phase, 0);
        dummy.updateMatrix();
        particles.current?.setMatrixAt(index, dummy.matrix);
        particles.current?.setColorAt(index, item.contradictory ? amber : item.stale ? muted : cyan);
      });
      particles.current.instanceMatrix.needsUpdate = true;
      if (particles.current.instanceColor) particles.current.instanceColor.needsUpdate = true;
    }

    const targetCameraX = stageIndex >= 6 ? 2.2 : 0.65;
    const targetCameraY = stageIndex >= 3 && stageIndex < 5 ? 0.12 : 0.28;
    const targetCameraZ = stageIndex >= 6 ? 10.1 : 12.2;
    camera.position.x += (targetCameraX - camera.position.x) * ease * 0.5;
    camera.position.y += (targetCameraY - camera.position.y) * ease * 0.5;
    camera.position.z += (targetCameraZ - camera.position.z) * ease * 0.5;
    camera.lookAt(stageIndex >= 6 ? 1.7 : 0.25, 0, 0);
  });

  return (
    <group ref={group} rotation={[-0.06, 0.2, -0.02]}>
      <Float speed={reducedMotion ? 0 : 0.38} rotationIntensity={0.025} floatIntensity={0.045}>
        <group position={[-1.5, 0, 0]}>
          <GateHousing />
          <mesh ref={ringA} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.28]}>
            <torusGeometry args={[1.82, 0.18, 22, 128]} />
            <meshPhysicalMaterial color="#909ba1" metalness={0.82} roughness={0.17} clearcoat={1} clearcoatRoughness={0.12} />
          </mesh>
          <mesh ref={ringB} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.38]}>
            <torusGeometry args={[1.46, 0.08, 18, 128]} />
            <meshPhysicalMaterial color="#2a3439" metalness={0.76} roughness={0.22} emissive="#25d4ff" emissiveIntensity={stageIndex >= 2 ? 0.24 : 0.05} />
          </mesh>
          <mesh ref={ringC} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.45]}>
            <torusGeometry args={[1.1, 0.045, 16, 128]} />
            <meshBasicMaterial color="#69ecff" transparent opacity={stageIndex >= 2 ? 0.72 : 0.18} />
          </mesh>
          <MechanicalRing radius={2.14} tube={0.035} depth={0.12} color="#25d4ff" opacity={stageIndex >= 1 ? 0.35 : 0.08} />
          <mesh position={[0, 0, 0.5]}>
            <circleGeometry args={[1.18, 128]} />
            <shaderMaterial
              ref={energyMaterial}
              vertexShader={energyVertexShader}
              fragmentShader={energyFragmentShader}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              uniforms={{ uTime: { value: 0 }, uIntensity: { value: 0.3 } }}
            />
          </mesh>
          <mesh position={[0, 0, 0.72]}>
            <icosahedronGeometry args={[0.16, 4]} />
            <meshStandardMaterial color="#d8fbff" emissive="#25d4ff" emissiveIntensity={stageIndex >= 2 ? 7 : 2.4} roughness={0.1} />
          </mesh>
          <pointLight position={[0, 0, 0.8]} color="#25d4ff" intensity={stageIndex >= 2 ? 36 : 12} distance={5.5} />
        </group>

        <group ref={riskRails} position={[0.95, 0, 0.05]} scale={[1, 0.72, 1]}>
          <RoundedBox args={[1.65, 0.24, 1.05]} position={[0, 2.48, 0]} radius={0.08}>
            <meshPhysicalMaterial color="#4b3424" emissive="#ff8f21" emissiveIntensity={0.18} metalness={0.7} roughness={0.24} />
          </RoundedBox>
          <RoundedBox args={[1.65, 0.24, 1.05]} position={[0, -2.48, 0]} radius={0.08}>
            <meshPhysicalMaterial color="#4b3424" emissive="#ff8f21" emissiveIntensity={0.18} metalness={0.7} roughness={0.24} />
          </RoundedBox>
          <RoundedBox args={[0.24, 5.18, 1.05]} position={[0, 0, 0]} radius={0.08}>
            <meshPhysicalMaterial color="#4b3424" emissive="#ff8f21" emissiveIntensity={0.18} metalness={0.7} roughness={0.24} />
          </RoundedBox>
        </group>

        <mesh ref={riskWall} position={[0.95, 0, 0.1]} scale={[1, 0.001, 1]}>
          <boxGeometry args={[0.14, 4.7, 2.95]} />
          <meshPhysicalMaterial color="#7b3100" emissive="#ff8f21" emissiveIntensity={0.75} metalness={0.25} roughness={0.28} transparent opacity={0.74} transmission={0.08} />
        </mesh>

        <group ref={operatorCore} position={[3.0, 0, 0.42]} scale={0.74}>
          <MechanicalRing radius={0.9} tube={0.13} color="#6f7d84" />
          <MechanicalRing radius={0.62} tube={0.055} depth={0.1} color="#25d4ff" opacity={stageIndex >= 4 ? 0.85 : 0.2} />
          <mesh position={[0, 0, 0.18]}>
            <sphereGeometry args={[0.18, 48, 48]} />
            <meshStandardMaterial color="#d4fbff" emissive="#25d4ff" emissiveIntensity={stageIndex >= 4 ? 6 : 1.2} roughness={0.12} />
          </mesh>
          <pointLight position={[0, 0, 0.3]} color="#25d4ff" intensity={stageIndex >= 4 ? 22 : 4} distance={3.5} />
        </group>

        <mesh ref={auditRecord} position={[4.55, 0, -0.08]} scale={0.001}>
          <boxGeometry args={[1.75, 2.35, 0.2]} />
          <meshPhysicalMaterial color="#bdf7ff" emissive="#25d4ff" emissiveIntensity={2.1} metalness={0.3} roughness={0.16} transparent opacity={0.78} transmission={0.2} />
        </mesh>

        <instancedMesh ref={particles} args={[undefined, undefined, particleCount]}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial vertexColors />
        </instancedMesh>

        <Html position={[-5.7, -2.15, 0.6]} transform distanceFactor={8} className="machine-hud machine-hud--inputs">
          <span>Evidence inputs</span>
          <b>{stageIndex >= 2 ? "54 verified" : "72 unresolved"}</b>
          <small>Cyan / verified · Amber / conflict</small>
        </Html>
        <Html position={[1.35, 2.05, 0.7]} transform distanceFactor={8} className="machine-hud machine-hud--risk">
          <span>Risk boundary</span>
          <b>{stageIndex >= 3 && stageIndex < 5 ? "Blocked" : "Standby"}</b>
          <small>No progression without review</small>
        </Html>
        <Html position={[3.45, -1.55, 0.8]} transform distanceFactor={8} className="machine-hud machine-hud--operator">
          <span>Operator control</span>
          <b>{stageIndex >= 4 ? "Review active" : "Awaiting evidence"}</b>
          <small>Human approval remains explicit</small>
        </Html>
        <Html position={[5.15, 1.6, 0.35]} transform distanceFactor={8} className="machine-hud machine-hud--record">
          <span>Audit record</span>
          <b>{stageIndex >= 5 ? "Record locked" : "Not created"}</b>
          <small>Immutable after approval</small>
        </Html>
      </Float>
    </group>
  );
}
