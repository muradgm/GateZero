import { Line } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import type { LandscapeState } from "../engine/landscape";

function TerrainSurface({ landscape }: { landscape: LandscapeState }) {
  const geometry = useMemo(() => {
    const { resolution, points } = landscape;
    const positions = new Float32Array(points.length * 3);
    const colors = new Float32Array(points.length * 3);
    const cyan = new THREE.Color("#33d7ff");
    const graphite = new THREE.Color("#10171c");
    const amber = new THREE.Color("#ff9f43");

    points.forEach((point, index) => {
      positions[index * 3] = point.x;
      positions[index * 3 + 1] = point.elevation;
      positions[index * 3 + 2] = point.z;
      const tone = graphite.clone().lerp(cyan, Math.min(0.82, Math.max(0.06, point.confidence * 0.72)));
      tone.lerp(amber, Math.min(0.52, point.risk * 0.44 + point.contradiction * 0.22));
      colors[index * 3] = tone.r;
      colors[index * 3 + 1] = tone.g;
      colors[index * 3 + 2] = tone.b;
    });

    const indices: number[] = [];
    for (let row = 0; row < resolution - 1; row += 1) {
      for (let column = 0; column < resolution - 1; column += 1) {
        const a = row * resolution + column;
        const b = a + 1;
        const c = a + resolution;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const next = new THREE.BufferGeometry();
    next.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    next.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    next.setIndex(indices);
    next.computeVertexNormals();
    return next;
  }, [landscape]);

  return (
    <mesh
      // The workspace currently resolves structurally identical BufferGeometry
      // types through different Three.js type identities. Keep the geometry
      // construction typed and bridge only the R3F prop boundary.
      geometry={geometry as any}
      rotation={[0, 0, 0]}
    >
      <meshPhysicalMaterial
        vertexColors
        roughness={0.54}
        metalness={0.18}
        clearcoat={0.46}
        clearcoatRoughness={0.36}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Contours({ landscape }: { landscape: LandscapeState }) {
  const rows = useMemo(() => {
    const lines: [number, number, number][][] = [];
    const stride = Math.max(2, Math.round(5 - landscape.contourDensity * 3));
    for (let row = 0; row < landscape.resolution; row += stride) {
      const points: [number, number, number][] = [];
      for (let column = 0; column < landscape.resolution; column += 1) {
        const point = landscape.points[row * landscape.resolution + column];
        points.push([point.x, point.elevation + 0.025, point.z]);
      }
      lines.push(points);
    }
    return lines;
  }, [landscape]);

  return (
    <group>
      {rows.map((points, index) => (
        <Line
          key={`contour:${index}`}
          points={points}
          color="#7f919b"
          lineWidth={0.45}
          transparent
          opacity={0.2 + landscape.source.freshness * 0.24}
        />
      ))}
    </group>
  );
}

function Routes({ landscape }: { landscape: LandscapeState }) {
  return (
    <group>
      {landscape.routes.filter((route) => route.visible).map((route) => (
        <Line
          key={route.id}
          points={route.points}
          color={route.dominant ? "#a77cff" : route.bias === "bearish" ? "#ff9f43" : "#33d7ff"}
          lineWidth={route.dominant ? 3.2 : 0.45 + route.weight * 1.2}
          transparent
          opacity={route.dominant ? 0.96 : 0.08 + route.weight * 0.34}
        />
      ))}
    </group>
  );
}

export function ConvictionAtlasScene({ landscape }: { landscape: LandscapeState }) {
  return (
    <group rotation={[-0.12, -0.12, 0]} position={[0, -0.8, 0]}>
      <TerrainSurface landscape={landscape} />
      <Contours landscape={landscape} />
      <Routes landscape={landscape} />
    </group>
  );
}
