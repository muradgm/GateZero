import { Canvas } from "@react-three/fiber";
import { Environment, Float, RoundedBox } from "@react-three/drei";
import { productState } from "@gatezero/product-state";

function EvidenceGate() {
  return (
    <group rotation={[-0.08, 0.32, -0.02]}>
      <Float speed={0.65} rotationIntensity={0.08} floatIntensity={0.12}>
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
        <mesh position={[0, 0, 0.18]}>
          <circleGeometry args={[1.65, 96]} />
          <meshStandardMaterial color="#25d4ff" emissive="#25d4ff" emissiveIntensity={1.8} transparent opacity={0.12} />
        </mesh>
        <mesh position={[0, 0, 0.48]}>
          <icosahedronGeometry args={[0.15, 3]} />
          <meshStandardMaterial color="#c7f8ff" emissive="#25d4ff" emissiveIntensity={4} />
        </mesh>
        <pointLight color="#25d4ff" intensity={24} distance={5} />
      </Float>
    </group>
  );
}

export default function App() {
  return (
    <main>
      <section className="hero">
        <div className="copy">
          <p className="eyebrow">TraderFrame / Evidence Gate</p>
          <h1>Frame the evidence. <span>Control the decision.</span></h1>
          <p className="lede">A real-time decision-governance experience for making evidence, uncertainty, and operator responsibility visible before action.</p>
          <div className="boundary">{productState.wedge}</div>
          <dl>
            <div><dt>Current gate</dt><dd>{productState.id}</dd></div>
            <div><dt>Mode</dt><dd>{productState.publicLabel}</dd></div>
            <div><dt>Execution</dt><dd>Locked</dd></div>
          </dl>
        </div>
        <div className="scene" aria-label="Interactive three-dimensional Evidence Gate prototype">
          <Canvas camera={{ position: [0.5, 0.25, 11.8], fov: 31 }} dpr={[1, 1.6]}>
            <color attach="background" args={["#07090b"]} />
            <fog attach="fog" args={["#07090b", 8, 20]} />
            <ambientLight intensity={0.6} />
            <spotLight position={[-5, 7, 6]} intensity={60} angle={0.36} penumbra={0.7} />
            <pointLight position={[3, -1, 2]} color="#25d4ff" intensity={22} />
            <pointLight position={[-3, -2, 2]} color="#ffb84d" intensity={6} />
            <EvidenceGate />
            <Environment preset="warehouse" />
          </Canvas>
        </div>
      </section>
    </main>
  );
}
