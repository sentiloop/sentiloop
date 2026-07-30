"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import { memo, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  MathUtils,
  Vector3,
  type Group,
  type Mesh,
  type Points,
} from "three";

export type LoginPhase = "intro" | "ready" | "authenticating" | "success";
export type LoginSceneProps = { phase: LoginPhase };

const CYAN = new Color("#63dcff").multiplyScalar(2.4);
const BLUE = new Color("#3188ff").multiplyScalar(2.2);
const VIOLET = new Color("#8b6dff").multiplyScalar(1.9);

function seededRandom(seedValue: number) {
  let seed = seedValue;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function createParticleData(count: number) {
  const random = seededRandom(92017 + count);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const cyan = new Color("#68dcff");
  const blue = new Color("#397cff");
  const violet = new Color("#9274ff");

  for (let index = 0; index < count; index += 1) {
    const radius = 1.8 + Math.pow(random(), 0.58) * 7.2;
    const angle = random() * Math.PI * 2;
    const depth = (random() - 0.5) * 8;
    const verticalSpread = (random() - 0.5) * (2.2 + radius * 0.52);
    positions[index * 3] = Math.cos(angle) * radius * 1.05 + (random() - 0.5) * 0.8;
    positions[index * 3 + 1] = verticalSpread;
    positions[index * 3 + 2] = Math.sin(angle) * radius * 0.48 + depth * 0.28 - 1.8;
    const color = index % 7 === 0 ? violet : index % 3 === 0 ? blue : cyan;
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }
  return { positions, colors };
}

const ParticleField = memo(function ParticleField({ count, phase, reducedMotion }: { count: number; phase: LoginPhase; reducedMotion: boolean }) {
  const points = useRef<Points>(null);
  const data = useMemo(() => createParticleData(count), [count]);

  useFrame((state, frameDelta) => {
    if (!points.current || reducedMotion) return;
    const delta = Math.min(frameDelta, 0.05);
    const speed = phase === "success" ? 0.42 : phase === "authenticating" ? 0.12 : 0.025;
    points.current.rotation.y += delta * speed;
    points.current.rotation.z = MathUtils.damp(points.current.rotation.z, state.pointer.x * 0.035, 2.4, delta);
    points.current.position.y = MathUtils.damp(points.current.position.y, state.pointer.y * 0.15, 2, delta);
    points.current.scale.setScalar(MathUtils.damp(points.current.scale.x, phase === "success" ? 2.2 : 1, 2.6, delta));
  });

  return (
    <points ref={points} frustumCulled={false} rotation={[0.08, 0, -0.04]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.026} sizeAttenuation vertexColors transparent opacity={0.7} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
    </points>
  );
});

function Portal({ phase, reducedMotion }: LoginSceneProps & { reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  const leftPanel = useRef<Mesh>(null);
  const rightPanel = useRef<Mesh>(null);
  const pulse = useRef<Mesh>(null);
  const opening = phase !== "intro";

  useFrame((state, frameDelta) => {
    if (reducedMotion) return;
    const delta = Math.min(frameDelta, 0.05);
    if (group.current) {
      group.current.rotation.y = MathUtils.damp(group.current.rotation.y, state.pointer.x * 0.06, 2.2, delta);
      group.current.rotation.x = MathUtils.damp(group.current.rotation.x, -state.pointer.y * 0.035, 2.2, delta);
    }
    const panelTarget = opening ? 0.98 : 0.08;
    if (leftPanel.current) leftPanel.current.rotation.y = MathUtils.damp(leftPanel.current.rotation.y, -panelTarget, 2.5, delta);
    if (rightPanel.current) rightPanel.current.rotation.y = MathUtils.damp(rightPanel.current.rotation.y, panelTarget, 2.5, delta);
    if (pulse.current) {
      const target = phase === "authenticating" ? 1.45 + Math.sin(state.clock.elapsedTime * 5) * 0.15 : phase === "success" ? 3.8 : 1;
      pulse.current.scale.setScalar(MathUtils.damp(pulse.current.scale.x, target, 3.4, delta));
    }
  });

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.28, 0.055, 12, 160]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.74} blending={AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.07}>
        <torusGeometry args={[2.28, 0.012, 8, 160]} />
        <meshBasicMaterial color={VIOLET} transparent opacity={0.52} blending={AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh ref={pulse} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.78, 0.018, 8, 140]} />
        <meshBasicMaterial color={BLUE} transparent opacity={phase === "success" ? 0.9 : 0.28} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <group position={[-0.04, 0, 0.03]}>
        <mesh ref={leftPanel} position={[-1.02, 0, 0]}>
          <boxGeometry args={[2.02, 4.05, 0.045]} />
          <meshPhysicalMaterial color="#163a66" emissive="#1768bd" emissiveIntensity={0.15} transmission={0.76} thickness={0.5} roughness={0.08} metalness={0.12} transparent opacity={0.28} side={DoubleSide} />
        </mesh>
        <mesh ref={rightPanel} position={[1.02, 0, 0]}>
          <boxGeometry args={[2.02, 4.05, 0.045]} />
          <meshPhysicalMaterial color="#222f69" emissive="#4d37bd" emissiveIntensity={0.13} transmission={0.78} thickness={0.5} roughness={0.08} metalness={0.12} transparent opacity={0.26} side={DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

function HolographicCore({ phase, reducedMotion }: LoginSceneProps & { reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  const shell = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);

  useFrame((state, frameDelta) => {
    if (reducedMotion) return;
    const delta = Math.min(frameDelta, 0.05);
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.07;
      group.current.scale.setScalar(MathUtils.damp(group.current.scale.x, phase === "success" ? 1.6 : phase === "intro" ? 0.55 : 1, 2.8, delta));
    }
    if (shell.current) {
      shell.current.rotation.x += delta * 0.18;
      shell.current.rotation.y -= delta * 0.24;
    }
    if (ring.current) ring.current.rotation.z += delta * (phase === "authenticating" ? 1.1 : 0.22);
  });

  return (
    <group ref={group} position={[0, 0.05, 0.35]} scale={reducedMotion ? 1 : 0.55}>
      <mesh ref={shell}>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshPhysicalMaterial color="#5fc9ff" emissive={BLUE} emissiveIntensity={0.55} roughness={0.12} metalness={0.05} transmission={0.72} thickness={0.8} transparent opacity={0.88} toneMapped={false} />
      </mesh>
      <mesh scale={1.04}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.32} blending={AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh ref={ring} rotation={[1.15, 0.2, 0.2]}>
        <torusGeometry args={[0.86, 0.018, 8, 90]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.7} blending={AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh rotation={[0.1, 1.2, -0.55]}>
        <torusGeometry args={[1.02, 0.009, 8, 100]} />
        <meshBasicMaterial color={VIOLET} transparent opacity={0.42} blending={AdditiveBlending} toneMapped={false} />
      </mesh>
      <pointLight color="#55caff" intensity={24} distance={5} decay={2} />
    </group>
  );
}

const cubeData = [
  [-3.25, 1.6, -0.8, 0.22], [3.05, 1.35, -1.4, 0.17], [-2.8, -1.65, -1.2, 0.15],
  [3.5, -1.5, -0.5, 0.24], [-1.8, 2.55, -2.1, 0.12], [1.9, -2.45, -1.8, 0.13],
] as const;

function FloatingCubes({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  useFrame((state, frameDelta) => {
    if (!group.current || reducedMotion) return;
    const delta = Math.min(frameDelta, 0.05);
    group.current.rotation.y += delta * 0.018;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.025;
  });
  return (
    <group ref={group}>
      {cubeData.map(([x, y, z, scale], index) => (
        <mesh key={index} position={[x, y, z]} scale={scale} rotation={[index * 0.7, index * 0.4, index * 0.25]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={index % 2 ? "#6652ce" : "#319bd0"} emissive={index % 2 ? VIOLET : BLUE} emissiveIntensity={0.6} roughness={0.22} metalness={0.38} transparent opacity={0.72} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function EnergyRings({ phase, reducedMotion }: LoginSceneProps & { reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  useFrame((state, frameDelta) => {
    if (!group.current || reducedMotion) return;
    const delta = Math.min(frameDelta, 0.05);
    group.current.rotation.z += delta * (phase === "authenticating" ? 0.55 : 0.08);
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.08;
  });
  return (
    <group ref={group} position={[0, 0, -0.8]}>
      {[3.15, 3.7, 4.35].map((radius, index) => (
        <mesh key={radius} rotation={[Math.PI / 2 + index * 0.16, index * 0.12, 0]}>
          <torusGeometry args={[radius, index === 0 ? 0.018 : 0.009, 8, 160]} />
          <meshBasicMaterial color={index === 1 ? VIOLET : CYAN} transparent opacity={0.13 - index * 0.025} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function VolumetricBeams({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.18) * 0.08;
  });
  return (
    <group ref={group} position={[0, 0, -2.2]}>
      <mesh position={[-2.4, 1.2, 0]} rotation={[0.05, 0, -0.8]}>
        <coneGeometry args={[0.85, 7, 28, 1, true]} />
        <meshBasicMaterial color="#46c8ff" transparent opacity={0.034} blending={AdditiveBlending} depthWrite={false} side={DoubleSide} />
      </mesh>
      <mesh position={[2.6, 1.4, -0.3]} rotation={[-0.04, 0, 0.78]}>
        <coneGeometry args={[0.78, 6.5, 28, 1, true]} />
        <meshBasicMaterial color="#826cff" transparent opacity={0.03} blending={AdditiveBlending} depthWrite={false} side={DoubleSide} />
      </mesh>
    </group>
  );
}

function AuroraBackdrop({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.11) * 0.035;
    group.current.position.x = Math.cos(state.clock.elapsedTime * 0.09) * 0.12;
  });
  return (
    <group ref={group} position={[0, 0, -5]}>
      <mesh position={[-2.4, 1.1, 0]} scale={[3.8, 2.2, 1]}>
        <circleGeometry args={[1, 64]} />
        <meshBasicMaterial color="#1f7cff" transparent opacity={0.055} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[2.6, -0.6, -0.5]} scale={[4.2, 2.5, 1]}>
        <circleGeometry args={[1, 64]} />
        <meshBasicMaterial color="#6e45ff" transparent opacity={0.05} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function CameraRig({ phase, reducedMotion }: LoginSceneProps & { reducedMotion: boolean }) {
  const positionTarget = useMemo(() => new Vector3(), []);
  const lookTarget = useMemo(() => new Vector3(), []);

  useFrame((state, frameDelta) => {
    if (reducedMotion) return;
    const delta = Math.min(frameDelta, 0.05);
    const elapsed = state.clock.elapsedTime;
    const z = phase === "intro" ? 9.4 : phase === "success" ? -1.25 : phase === "authenticating" ? 5.65 : 6.25;
    positionTarget.set(state.pointer.x * 0.3, state.pointer.y * 0.2, z);
    lookTarget.set(state.pointer.x * 0.08, state.pointer.y * 0.06, phase === "success" ? -3 : 0);
    state.camera.position.x = MathUtils.damp(state.camera.position.x, positionTarget.x, 2.2, delta);
    state.camera.position.y = MathUtils.damp(state.camera.position.y, positionTarget.y + Math.sin(elapsed * 0.16) * 0.04, 2.2, delta);
    state.camera.position.z = MathUtils.damp(state.camera.position.z, positionTarget.z, phase === "success" ? 1.75 : 1.45, delta);
    state.camera.lookAt(lookTarget);
  });
  return null;
}

function PostEffects({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return <EffectComposer multisampling={0} resolutionScale={0.55} enableNormalPass={false} depthBuffer={false}><Bloom mipmapBlur intensity={0.72} luminanceThreshold={0.7} luminanceSmoothing={0.25} levels={4} /></EffectComposer>;
}

export default function LoginScene({ phase }: LoginSceneProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const [quality, setQuality] = useState<"high" | "low">("high");
  const background = useMemo(() => new Color("#02050b"), []);
  const particleCount = reducedMotion ? 900 : quality === "high" ? 2200 : 1100;

  return (
    <Canvas
      dpr={[0.8, 1.5]}
      camera={{ position: [0, 0, reducedMotion ? 6.25 : 9.4], fov: 48 }}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance", stencil: false }}
      performance={{ min: 0.45, max: 1, debounce: 180 }}
      onCreated={({ gl }) => gl.setClearColor(background, 0)}
    >
      <PerformanceMonitor flipflops={2} onDecline={() => setQuality("low")} onFallback={() => setQuality("low")} />
      <fog attach="fog" args={["#02050b", 5, 14]} />
      <ambientLight intensity={0.28} color="#b8eaff" />
      <directionalLight position={[0, 4, 5]} intensity={1.1} color="#d8f6ff" />
      <pointLight position={[-4, 2, 2]} intensity={10} color="#3188ff" distance={9} decay={2} />
      <pointLight position={[4, -1, 1]} intensity={8} color="#8067ff" distance={8} decay={2} />
      <CameraRig phase={phase} reducedMotion={reducedMotion} />
      <AuroraBackdrop reducedMotion={reducedMotion} />
      <VolumetricBeams reducedMotion={reducedMotion} />
      <EnergyRings phase={phase} reducedMotion={reducedMotion} />
      <ParticleField count={particleCount} phase={phase} reducedMotion={reducedMotion} />
      <FloatingCubes reducedMotion={reducedMotion} />
      <Portal phase={phase} reducedMotion={reducedMotion} />
      <HolographicCore phase={phase} reducedMotion={reducedMotion} />
      <PostEffects enabled={!reducedMotion && quality === "high"} />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
