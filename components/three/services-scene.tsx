"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import { memo, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  MathUtils,
  Vector3,
  type Group,
  type LineSegments as LineSegmentsType,
  type Mesh,
  type Points,
} from "three";

/* ─── Constants ─── */
const CYAN = new Color("#63dcff").multiplyScalar(2.4);
const GREEN = new Color("#9dfcc7").multiplyScalar(1.8);

/* ─── Seeded Random ─── */
function seededRandom(seedValue: number) {
  let seed = seedValue;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/* ─── 1. Neural Particle Cloud (Galaxy Spiral) ─── */
function createParticleData(count: number) {
  const rng = seededRandom(92017 + count);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const cyan = new Color("#68dcff");
  const violet = new Color("#9274ff");
  const green = new Color("#9dfcc7");

  for (let i = 0; i < count; i++) {
    const arm = Math.floor(rng() * 3);
    const armAngle = (arm / 3) * Math.PI * 2;
    const dist = 1.2 + Math.pow(rng(), 0.5) * 7;
    const spiral = dist * 0.4;
    const angle = armAngle + spiral + (rng() - 0.5) * 0.8;
    const ySpread = (rng() - 0.5) * (0.6 + dist * 0.15);

    positions[i * 3] = Math.cos(angle) * dist;
    positions[i * 3 + 1] = ySpread;
    positions[i * 3 + 2] = Math.sin(angle) * dist * 0.6 - 2;

    const color = i % 7 === 0 ? violet : i % 5 === 0 ? green : cyan;
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  return { positions, colors };
}

const ParticleField = memo(function ParticleField({
  count,
  reducedMotion,
}: {
  count: number;
  reducedMotion: boolean;
}) {
  const points = useRef<Points>(null);
  const data = useMemo(() => createParticleData(count), [count]);

  useFrame((state, frameDelta) => {
    if (!points.current || reducedMotion) return;
    const delta = Math.min(frameDelta, 0.05);
    points.current.rotation.y += delta * 0.02;
    points.current.rotation.z = MathUtils.damp(
      points.current.rotation.z,
      state.pointer.x * 0.03,
      2.4,
      delta
    );
    points.current.position.y = MathUtils.damp(
      points.current.position.y,
      state.pointer.y * 0.12,
      2,
      delta
    );
  });

  return (
    <points ref={points} frustumCulled={false} rotation={[0.08, 0, -0.04]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.7}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
});

/* ─── 2. Security Grid ─── */
function createGridData() {
  const gridSize = 12;
  const spacing = 1.5;
  const offset = ((gridSize - 1) * spacing) / 2;
  const rng = seededRandom(77777);

  const nodePositions = new Float32Array(gridSize * gridSize * 3);
  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      const idx = (x * gridSize + z) * 3;
      nodePositions[idx] = x * spacing - offset + (rng() - 0.5) * 0.2;
      nodePositions[idx + 1] = -2;
      nodePositions[idx + 2] = z * spacing - offset + (rng() - 0.5) * 0.2;
    }
  }

  // Connect adjacent nodes
  const edges: number[] = [];
  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      const idx = (x * gridSize + z) * 3;
      // Connect to right neighbor
      if (x < gridSize - 1) {
        const nIdx = ((x + 1) * gridSize + z) * 3;
        edges.push(
          nodePositions[idx], nodePositions[idx + 1], nodePositions[idx + 2],
          nodePositions[nIdx], nodePositions[nIdx + 1], nodePositions[nIdx + 2]
        );
      }
      // Connect to bottom neighbor
      if (z < gridSize - 1) {
        const nIdx = (x * gridSize + (z + 1)) * 3;
        edges.push(
          nodePositions[idx], nodePositions[idx + 1], nodePositions[idx + 2],
          nodePositions[nIdx], nodePositions[nIdx + 1], nodePositions[nIdx + 2]
        );
      }
    }
  }

  return { nodePositions, edgePositions: new Float32Array(edges) };
}

function SecurityGrid({ reducedMotion }: { reducedMotion: boolean }) {
  const linesRef = useRef<LineSegmentsType>(null);
  const { nodePositions, edgePositions } = useMemo(() => createGridData(), []);

  const edgeGeom = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(edgePositions, 3));
    return geo;
  }, [edgePositions]);

  const basePositions = useMemo(() => new Float32Array(edgePositions), [edgePositions]);

  useFrame((state) => {
    if (!linesRef.current || reducedMotion) return;
    const elapsed = state.clock.elapsedTime;
    const posAttr = linesRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < arr.length / 3; i++) {
      const x = basePositions[i * 3];
      const z = basePositions[i * 3 + 2];
      arr[i * 3 + 1] = -2 + Math.sin(x * 0.5 + z * 0.5 + elapsed * 0.6) * 0.15;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <group>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          sizeAttenuation
          color={CYAN}
          transparent
          opacity={0.15}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <lineSegments ref={linesRef} geometry={edgeGeom} frustumCulled={false}>
        <lineBasicMaterial
          color={CYAN}
          transparent
          opacity={0.08}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>
    </group>
  );
}

/* ─── 3. Floating Geometric Objects ─── */
interface GeoConfig {
  type: "icosahedron" | "octahedron" | "box";
  position: [number, number, number];
  scale: number;
  rotSpeed: [number, number, number];
  color: string;
}

const GEO_CONFIGS: GeoConfig[] = [
  { type: "icosahedron", position: [-4, 1.5, -3], scale: 0.35, rotSpeed: [0.1, 0.15, 0.05], color: "#63dcff" },
  { type: "octahedron", position: [4.5, 0.8, -4], scale: 0.3, rotSpeed: [0.08, 0.12, 0.06], color: "#8b6dff" },
  { type: "box", position: [-3, -0.5, -2], scale: 0.25, rotSpeed: [0.06, 0.09, 0.12], color: "#9dfcc7" },
  { type: "icosahedron", position: [3, 2.2, -5], scale: 0.4, rotSpeed: [0.12, 0.07, 0.09], color: "#8b6dff" },
  { type: "octahedron", position: [-5, -1, -4], scale: 0.28, rotSpeed: [0.09, 0.14, 0.07], color: "#63dcff" },
  { type: "box", position: [5, -1.5, -3], scale: 0.22, rotSpeed: [0.11, 0.06, 0.13], color: "#9dfcc7" },
];

function FloatingGeometrics({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);
  const meshRefs = useRef<(Mesh | null)[]>([]);

  useFrame((state, frameDelta) => {
    if (reducedMotion) return;
    const delta = Math.min(frameDelta, 0.05);
    const elapsed = state.clock.elapsedTime;

    // Subtle pointer parallax on group
    if (groupRef.current) {
      groupRef.current.position.x = MathUtils.damp(
        groupRef.current.position.x,
        state.pointer.x * 0.3,
        2,
        delta
      );
      groupRef.current.position.y = MathUtils.damp(
        groupRef.current.position.y,
        state.pointer.y * 0.2,
        2,
        delta
      );
    }

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const cfg = GEO_CONFIGS[i];
      mesh.rotation.x += delta * cfg.rotSpeed[0];
      mesh.rotation.y += delta * cfg.rotSpeed[1];
      mesh.rotation.z += delta * cfg.rotSpeed[2];
      // Gentle float
      mesh.position.y = cfg.position[1] + Math.sin(elapsed * 0.5 + i * 1.3) * 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {GEO_CONFIGS.map((cfg, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          position={cfg.position}
          scale={cfg.scale}
        >
          {cfg.type === "icosahedron" && <icosahedronGeometry args={[1, 1]} />}
          {cfg.type === "octahedron" && <octahedronGeometry args={[1, 0]} />}
          {cfg.type === "box" && <boxGeometry args={[1, 1, 1]} />}
          <meshStandardMaterial
            color={cfg.color}
            emissive={cfg.color}
            emissiveIntensity={0.6}
            transparent
            opacity={0.6}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── 4. Security Nodes Network ─── */
function createSecurityNodesData() {
  const nodeCount = 8;
  const radius = 4;
  const positions = new Float32Array(nodeCount * 3);

  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle * 2) * 0.8;
    positions[i * 3 + 2] = Math.sin(angle) * radius * 0.6 - 1;
  }

  // Connect all nodes in a ring + cross connections
  const edges: number[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const next = (i + 1) % nodeCount;
    edges.push(
      positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
      positions[next * 3], positions[next * 3 + 1], positions[next * 3 + 2]
    );
    // Cross connection to opposite node
    if (i < nodeCount / 2) {
      const opp = (i + nodeCount / 2) % nodeCount;
      edges.push(
        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
        positions[opp * 3], positions[opp * 3 + 1], positions[opp * 3 + 2]
      );
    }
  }

  return { positions, edgePositions: new Float32Array(edges) };
}

function SecurityNodes({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);
  const nodesRef = useRef<Points>(null);
  const { positions, edgePositions } = useMemo(() => createSecurityNodesData(), []);

  const edgeGeom = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(edgePositions, 3));
    return geo;
  }, [edgePositions]);

  useFrame((state, frameDelta) => {
    if (!groupRef.current || reducedMotion) return;
    const delta = Math.min(frameDelta, 0.05);
    groupRef.current.rotation.y += delta * 0.03;

    // Pulse node opacity
    if (nodesRef.current?.material && "opacity" in nodesRef.current.material) {
      const elapsed = state.clock.elapsedTime;
      (nodesRef.current.material as { opacity: number }).opacity =
        0.5 + Math.sin(elapsed * 2) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={nodesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          sizeAttenuation
          color={GREEN}
          transparent
          opacity={0.7}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <lineSegments geometry={edgeGeom} frustumCulled={false}>
        <lineBasicMaterial
          color={GREEN}
          transparent
          opacity={0.1}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>
    </group>
  );
}

/* ─── 5. Energy Ring ─── */
function EnergyRing({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, frameDelta) => {
    if (!meshRef.current || reducedMotion) return;
    const delta = Math.min(frameDelta, 0.05);
    meshRef.current.rotation.y += delta * 0.08;
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI * 0.5, 0, 0]}>
      <torusGeometry args={[3, 0.01, 8, 128]} />
      <meshBasicMaterial
        color={CYAN}
        transparent
        opacity={0.15}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ─── 6. Volumetric Light Beams ─── */
function VolumetricBeams({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);

  useFrame((state, frameDelta) => {
    if (!groupRef.current || reducedMotion) return;
    const delta = Math.min(frameDelta, 0.05);
    groupRef.current.rotation.y += delta * 0.015;
  });

  return (
    <group ref={groupRef} position={[0, 3, -4]}>
      <mesh position={[-2, 1, 0]} rotation={[0.3, 0, -0.4]}>
        <coneGeometry args={[1.5, 10, 32, 1, true]} />
        <meshBasicMaterial
          color="#46c8ff"
          transparent
          opacity={0.02}
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>
      <mesh position={[2.5, 0.5, -1]} rotation={[-0.2, 0, 0.5]}>
        <coneGeometry args={[1.2, 8, 32, 1, true]} />
        <meshBasicMaterial
          color="#826cff"
          transparent
          opacity={0.02}
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ─── 7. Camera Rig ─── */
function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const posTarget = useMemo(() => new Vector3(), []);
  const lookTarget = useMemo(() => new Vector3(0, 0, 0), []);

  useFrame((state, frameDelta) => {
    if (reducedMotion) return;
    const delta = Math.min(frameDelta, 0.05);
    const elapsed = state.clock.elapsedTime;

    const breathe = Math.sin(elapsed * 0.3) * 0.04;

    posTarget.set(
      state.pointer.x * 0.2,
      state.pointer.y * 0.15 + breathe,
      8
    );

    state.camera.position.x = MathUtils.damp(state.camera.position.x, posTarget.x, 1.5, delta);
    state.camera.position.y = MathUtils.damp(state.camera.position.y, posTarget.y, 1.5, delta);
    state.camera.position.z = MathUtils.damp(state.camera.position.z, posTarget.z, 1.5, delta);
    state.camera.lookAt(lookTarget);
  });

  return null;
}

/* ─── 8. Post Processing ─── */
function PostEffects({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        mipmapBlur
        intensity={0.5}
        luminanceThreshold={0.75}
        luminanceSmoothing={0.3}
        levels={5}
      />
    </EffectComposer>
  );
}

/* ─── Main Scene Export ─── */
export default function ServicesScene() {
  const reducedMotion = useReducedMotion() ?? false;
  const [quality, setQuality] = useState<"high" | "low">("high");
  const particleCount = reducedMotion ? 1000 : quality === "high" ? 2000 : 1000;

  return (
    <Canvas
      dpr={[0.7, 1.4]}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
      performance={{ min: 0.4, max: 1, debounce: 200 }}
    >
      <PerformanceMonitor
        flipflops={2}
        onDecline={() => setQuality("low")}
        onFallback={() => setQuality("low")}
      />
      <fog attach="fog" args={["#050608", 6, 16]} />

      {/* 9. Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[-3, 4, 2]} color="#63dcff" intensity={8} distance={12} decay={2} />
      <pointLight position={[3, 3, -1]} color="#8b6dff" intensity={6} distance={10} decay={2} />

      {/* Camera */}
      <CameraRig reducedMotion={reducedMotion} />

      {/* Background layers */}
      <VolumetricBeams reducedMotion={reducedMotion} />
      <SecurityGrid reducedMotion={reducedMotion} />

      {/* Mid layers */}
      <ParticleField count={particleCount} reducedMotion={reducedMotion} />
      <SecurityNodes reducedMotion={reducedMotion} />
      <EnergyRing reducedMotion={reducedMotion} />

      {/* Foreground */}
      <FloatingGeometrics reducedMotion={reducedMotion} />

      {/* Post processing */}
      <PostEffects enabled={!reducedMotion && quality === "high"} />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
