"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  MathUtils,
  Vector3,
  type Group,
  type Mesh,
  type PointLight,
} from "three";

const MINT_GLOW = new Color("#9dfcc7").multiplyScalar(2.3);
const VIOLET_GLOW = new Color("#9f91ff").multiplyScalar(1.9);

type NeuralData = {
  nodes: Float32Array;
  edges: Float32Array;
  highlights: [number, number, number][];
};

type GalaxyData = {
  positions: Float32Array;
  colors: Float32Array;
};

function seededRandom(seedValue: number) {
  let seed = seedValue;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function createNeuralData(): NeuralData {
  const random = seededRandom(1847);
  const positions: [number, number, number][] = [];

  for (let index = 0; index < 54; index += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 0.55 + Math.pow(random(), 0.62) * 2.8;
    positions.push([
      Math.cos(angle) * radius * 1.25 + 1.15,
      Math.sin(angle) * radius * 0.72 + (random() - 0.5) * 0.5,
      (random() - 0.5) * 2.3,
    ]);
  }

  const edgeValues: number[] = [];
  for (let first = 0; first < positions.length; first += 1) {
    for (let second = first + 1; second < positions.length; second += 1) {
      const a = positions[first];
      const b = positions[second];
      const distance = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      if (distance < 1.28 && edgeValues.length < 780) edgeValues.push(...a, ...b);
    }
  }

  return {
    nodes: new Float32Array(positions.flat()),
    edges: new Float32Array(edgeValues),
    highlights: positions.filter((_, index) => index % 7 === 0),
  };
}

function createGalaxyData(count: number): GalaxyData {
  const random = seededRandom(7331 + count);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const mint = new Color("#9dfcc7");
  const violet = new Color("#8778ff");
  const cyan = new Color("#8cecff");

  for (let index = 0; index < count; index += 1) {
    const radius = 0.7 + Math.pow(random(), 0.54) * 5.4;
    const branch = (index % 5) / 5 * Math.PI * 2;
    const spin = radius * 0.72;
    const spread = Math.pow(random(), 2.1) * (random() < 0.5 ? -1 : 1);
    const angle = branch + spin;

    positions[index * 3] = Math.cos(angle) * radius + spread * 1.3 + 1.2;
    positions[index * 3 + 1] = spread * 0.65 + (random() - 0.5) * 0.28;
    positions[index * 3 + 2] = Math.sin(angle) * radius * 0.58 - 2.8 + spread * 0.42;

    const color = (index % 3 === 0 ? violet : index % 5 === 0 ? cyan : mint).clone();
    color.lerp(new Color("#ffffff"), random() * 0.22);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  return { positions, colors };
}

function Galaxy({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  const data = useMemo(() => createGalaxyData(620), []);

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y += delta * 0.006;
    group.current.rotation.z = MathUtils.damp(group.current.rotation.z, state.pointer.x * 0.025, 1.4, delta);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.08;
  });

  return (
    <group ref={group} rotation={[0.38, -0.12, -0.08]}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.027}
          sizeAttenuation
          transparent
          opacity={0.72}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

function NeuralField({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  const nodeCloud = useRef<Group>(null);
  const data = useMemo(createNeuralData, []);

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, state.pointer.x * 0.16, 3.2, delta);
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, -state.pointer.y * 0.1, 3.2, delta);
    group.current.rotation.z += delta * 0.018;
    if (nodeCloud.current) nodeCloud.current.rotation.z -= delta * 0.025;
  });

  return (
    <group ref={group} position={[0.45, 0, -0.35]} rotation={[0.04, -0.08, -0.04]}>
      <lineSegments frustumCulled={false}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[data.edges, 3]} /></bufferGeometry>
        <lineBasicMaterial color="#7ecda2" transparent opacity={0.15} blending={AdditiveBlending} depthWrite={false} />
      </lineSegments>

      <points frustumCulled={false}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[data.nodes, 3]} /></bufferGeometry>
        <pointsMaterial color="#b9ffcf" size={0.037} sizeAttenuation transparent opacity={0.78} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </points>

      <group ref={nodeCloud}>
        {data.highlights.map((position, index) => (
          <mesh key={index} position={position} scale={index % 3 === 0 ? 1.25 : 0.8}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color={index % 2 === 0 ? MINT_GLOW : VIOLET_GLOW} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function IntelligenceCore({ reducedMotion }: { reducedMotion: boolean }) {
  const core = useRef<Mesh>(null);
  const outerRing = useRef<Mesh>(null);
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    if (core.current) {
      core.current.rotation.x += delta * 0.06;
      core.current.rotation.y += delta * 0.11;
    }
    if (outerRing.current) outerRing.current.rotation.z -= delta * 0.08;
    if (group.current) group.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.06;
  });

  return (
    <group ref={group} position={[1.55, 0.12, 0.05]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.68, 3]} />
        <meshPhysicalMaterial color="#75dda1" emissive={MINT_GLOW} emissiveIntensity={0.72} roughness={0.16} metalness={0.08} transmission={0.72} thickness={0.85} ior={1.34} transparent opacity={0.92} toneMapped={false} />
      </mesh>
      <mesh scale={1.035}>
        <icosahedronGeometry args={[0.68, 2]} />
        <meshBasicMaterial color="#d6ffe3" wireframe transparent opacity={0.18} toneMapped={false} />
      </mesh>
      <mesh ref={outerRing} rotation={[1.1, 0.15, 0.4]}>
        <torusGeometry args={[1.05, 0.012, 8, 100]} />
        <meshBasicMaterial color={MINT_GLOW} transparent opacity={0.52} blending={AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh rotation={[0.2, 1.15, -0.65]}>
        <torusGeometry args={[1.28, 0.006, 8, 100]} />
        <meshBasicMaterial color={VIOLET_GLOW} transparent opacity={0.32} blending={AdditiveBlending} toneMapped={false} />
      </mesh>
      <pointLight color="#9dfcc7" intensity={18} distance={4.4} decay={2} />
    </group>
  );
}

const floatingObjects = [
  { position: [-2.5, 1.35, -0.4] as const, scale: 0.16, color: MINT_GLOW },
  { position: [3.8, 1.7, -1.3] as const, scale: 0.22, color: VIOLET_GLOW },
  { position: [-3.4, -1.45, -1.8] as const, scale: 0.12, color: VIOLET_GLOW },
  { position: [3.15, -1.55, -0.2] as const, scale: 0.14, color: MINT_GLOW },
  { position: [0.1, 2.05, -2.2] as const, scale: 0.1, color: MINT_GLOW },
];

function FloatingObjects({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y += delta * 0.018;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.22) * 0.025;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.42) * 0.055;
  });

  return (
    <group ref={group}>
      {floatingObjects.map((object, index) => (
        <group key={index} position={object.position} scale={object.scale} rotation={[index * 0.7, index * 0.45, index * 0.25]}>
          <mesh>
            <octahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={object.color} emissive={object.color} emissiveIntensity={1.5} roughness={0.24} metalness={0.15} toneMapped={false} />
          </mesh>
          <mesh scale={1.75}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshBasicMaterial color={object.color} transparent opacity={0.035} blending={AdditiveBlending} depthWrite={false} side={DoubleSide} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function VolumetricBeams({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.19) * 0.045;
    group.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.14) * 0.025;
  });

  return (
    <group ref={group} position={[1.4, 0.4, -1.4]}>
      <mesh position={[1.3, 1.05, -0.2]} rotation={[0.15, 0, 0.62]}>
        <coneGeometry args={[0.62, 5.2, 24, 1, true]} />
        <meshBasicMaterial color="#9dfcc7" transparent opacity={0.028} blending={AdditiveBlending} depthWrite={false} side={DoubleSide} />
      </mesh>
      <mesh position={[-1.4, 0.4, -0.8]} rotation={[-0.1, 0, -0.78]}>
        <coneGeometry args={[0.45, 4.4, 20, 1, true]} />
        <meshBasicMaterial color="#9f91ff" transparent opacity={0.022} blending={AdditiveBlending} depthWrite={false} side={DoubleSide} />
      </mesh>
    </group>
  );
}

function AnimatedLights({ reducedMotion }: { reducedMotion: boolean }) {
  const mintLight = useRef<PointLight>(null);
  const violetLight = useRef<PointLight>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const time = state.clock.elapsedTime;
    if (mintLight.current) {
      mintLight.current.position.x = 2.8 + Math.sin(time * 0.38) * 1.1;
      mintLight.current.position.y = 1.4 + Math.cos(time * 0.46) * 0.8;
      mintLight.current.intensity = 10 + Math.sin(time * 0.7) * 2;
    }
    if (violetLight.current) {
      violetLight.current.position.x = -2.5 + Math.cos(time * 0.31) * 0.8;
      violetLight.current.position.y = -1.2 + Math.sin(time * 0.4) * 0.6;
    }
  });

  return (
    <>
      <ambientLight intensity={0.34} color="#c8ffdc" />
      <pointLight ref={mintLight} position={[3, 2, 2]} intensity={11} color="#8af6b7" distance={8} decay={2} />
      <pointLight ref={violetLight} position={[-3, -1, 1]} intensity={8} color="#8d7cff" distance={7} decay={2} />
      <directionalLight position={[0, 4, 4]} intensity={1.1} color="#e6fff0" />
    </>
  );
}

function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const target = useMemo(() => new Vector3(), []);
  const lookTarget = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const time = state.clock.elapsedTime;
    target.set(
      state.pointer.x * 0.24 + Math.sin(time * 0.13) * 0.08,
      state.pointer.y * 0.16 + Math.cos(time * 0.11) * 0.05,
      6.2 + Math.sin(time * 0.09) * 0.12,
    );
    lookTarget.set(0.35 + state.pointer.x * 0.08, state.pointer.y * 0.045, 0);
    state.camera.position.lerp(target, 1 - Math.exp(-delta * 2.1));
    state.camera.lookAt(lookTarget);
  });

  return null;
}

function PostEffects({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;

  return (
    <EffectComposer multisampling={0} resolutionScale={0.6} enableNormalPass={false} depthBuffer={false}>
      <Bloom mipmapBlur intensity={0.58} luminanceThreshold={0.72} luminanceSmoothing={0.24} levels={4} />
    </EffectComposer>
  );
}

export default function SignalOrb() {
  const reducedMotion = useReducedMotion() ?? false;
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const background = useMemo(() => new Color("#050608"), []);

  return (
    <Canvas
      dpr={[0.85, 1.5]}
      camera={{ position: [0, 0, 6.2], fov: 47 }}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance", stencil: false }}
      performance={{ min: 0.45, max: 1, debounce: 180 }}
      onCreated={({ gl }) => gl.setClearColor(background, 0)}
    >
      <PerformanceMonitor
        flipflops={2}
        onDecline={() => setEffectsEnabled(false)}
        onFallback={() => setEffectsEnabled(false)}
      />
      <fog attach="fog" args={["#050608", 4.8, 11.5]} />
      <CameraRig reducedMotion={reducedMotion} />
      <AnimatedLights reducedMotion={reducedMotion} />
      <Galaxy reducedMotion={reducedMotion} />
      <VolumetricBeams reducedMotion={reducedMotion} />
      <NeuralField reducedMotion={reducedMotion} />
      <IntelligenceCore reducedMotion={reducedMotion} />
      <FloatingObjects reducedMotion={reducedMotion} />
      <Sparkles count={72} scale={[8, 5, 3]} size={1} speed={reducedMotion ? 0 : 0.1} opacity={0.23} color="#c8ffdc" noise={0.55} />
      <Sparkles count={24} scale={[7, 4, 2]} size={0.65} speed={reducedMotion ? 0 : 0.07} opacity={0.18} color="#a99cff" noise={0.4} />
      <PostEffects enabled={effectsEnabled} />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
