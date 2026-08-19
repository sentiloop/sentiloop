"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  Float,
  PerformanceMonitor,
  Sparkles,
} from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  DoubleSide,
  FrontSide,
  Vector3,
  type Group,
  type Mesh,
  type PointLight,
  type Points,
} from "three";

/* ─── Seeded Random ─── */
function seededRandom(seedValue: number) {
  let seed = seedValue;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/* ─── VR Headset ─── */
function VRHeadset({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    const time = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(time * 0.3) * 0.12 + state.pointer.x * 0.08;
    group.current.rotation.x = Math.cos(time * 0.25) * 0.04 + state.pointer.y * 0.04;
    group.current.position.y = Math.sin(time * 0.5) * 0.06;
  });

  return (
    <Float speed={1} rotationIntensity={0.08} floatIntensity={0.2} floatingRange={[-0.04, 0.04]}>
      <group ref={group} position={[0, 0.2, 0]} scale={1.05}>
        {/* Headset body */}
        <mesh>
          <boxGeometry args={[1.5, 0.8, 0.85, 2, 2, 2]} />
          <meshStandardMaterial color="#0a0f0d" roughness={0.15} metalness={0.9} />
        </mesh>
        {/* Visor */}
        <mesh position={[0, 0, 0.44]}>
          <boxGeometry args={[1.3, 0.6, 0.04]} />
          <meshStandardMaterial
            color="#1a2f28"
            emissive="#9dfcc7"
            emissiveIntensity={0.7}
            roughness={0.05}
            metalness={0.95}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Lens glows */}
        <mesh position={[-0.3, 0, 0.47]}>
          <circleGeometry args={[0.18, 16]} />
          <meshBasicMaterial color="#9dfcc7" transparent opacity={0.5} blending={AdditiveBlending} side={FrontSide} />
        </mesh>
        <mesh position={[0.3, 0, 0.47]}>
          <circleGeometry args={[0.18, 16]} />
          <meshBasicMaterial color="#85e8ff" transparent opacity={0.5} blending={AdditiveBlending} side={FrontSide} />
        </mesh>
        {/* Side accents */}
        <mesh position={[0.77, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.6, 6]} />
          <meshBasicMaterial color="#9dfcc7" transparent opacity={0.6} />
        </mesh>
        <mesh position={[-0.77, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.6, 6]} />
          <meshBasicMaterial color="#9f91ff" transparent opacity={0.6} />
        </mesh>
        {/* Aura */}
        <mesh scale={2}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#9dfcc7" transparent opacity={0.015} blending={AdditiveBlending} depthWrite={false} side={DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
}

/* ─── AR Panels (reduced to 3) ─── */
function FloatingARPanels({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);

  const panels = useMemo(
    () => [
      { position: [-2.0, 0.7, -0.5] as [number, number, number], rotation: [0, 0.3, 0] as [number, number, number], scale: 0.85, color: "#9dfcc7" },
      { position: [2.2, 0.4, -0.7] as [number, number, number], rotation: [0, -0.25, 0] as [number, number, number], scale: 0.7, color: "#85e8ff" },
      { position: [-1.6, -0.6, 0.2] as [number, number, number], rotation: [0, 0.15, 0.05] as [number, number, number], scale: 0.6, color: "#9f91ff" },
    ],
    []
  );

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as Group;
      mesh.position.y = panels[i].position[1] + Math.sin(time * 0.5 + i * 1.5) * 0.05;
    });
  });

  return (
    <group ref={groupRef}>
      {panels.map((panel, i) => (
        <group key={i} position={panel.position} rotation={panel.rotation} scale={panel.scale}>
          <mesh>
            <planeGeometry args={[1.1, 0.75]} />
            <meshBasicMaterial
              color={panel.color}
              transparent
              opacity={0.05}
              blending={AdditiveBlending}
              side={DoubleSide}
              depthWrite={false}
            />
          </mesh>
          {/* Border */}
          <mesh position={[0, 0.375, 0.001]}>
            <planeGeometry args={[1.1, 0.008]} />
            <meshBasicMaterial color={panel.color} transparent opacity={0.5} blending={AdditiveBlending} />
          </mesh>
          <mesh position={[0, -0.375, 0.001]}>
            <planeGeometry args={[1.1, 0.008]} />
            <meshBasicMaterial color={panel.color} transparent opacity={0.5} blending={AdditiveBlending} />
          </mesh>
          {/* Simple data bars */}
          {Array.from({ length: 3 }).map((_, j) => (
            <mesh key={j} position={[-0.3 + j * 0.3, -0.05, 0.002]}>
              <planeGeometry args={[0.15, 0.06 + (j % 2) * 0.04]} />
              <meshBasicMaterial color={panel.color} transparent opacity={0.3} blending={AdditiveBlending} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* ─── Portal (simplified - fewer meshes) ─── */
function DimensionalPortal({ reducedMotion }: { reducedMotion: boolean }) {
  const innerRef = useRef<Mesh>(null);
  const outerRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const time = state.clock.elapsedTime;
    if (innerRef.current) innerRef.current.rotation.z = time * 0.4;
    if (outerRef.current) outerRef.current.rotation.z = -time * 0.25;
  });

  return (
    <group position={[0, 0, -2.8]} scale={1.2}>
      <mesh ref={outerRef}>
        <torusGeometry args={[1.4, 0.025, 12, 48]} />
        <meshBasicMaterial color="#9f91ff" transparent opacity={0.5} blending={AdditiveBlending} />
      </mesh>
      <mesh ref={innerRef}>
        <torusGeometry args={[1.0, 0.018, 12, 36]} />
        <meshBasicMaterial color="#9dfcc7" transparent opacity={0.6} blending={AdditiveBlending} />
      </mesh>
      {/* Center */}
      <mesh>
        <circleGeometry args={[0.9, 32]} />
        <meshBasicMaterial color="#0a0f0d" transparent opacity={0.8} />
      </mesh>
      {/* 6 radial lines instead of 12 */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0]} rotation={[0, 0, angle + Math.PI / 2]}>
            <planeGeometry args={[0.004, 0.25]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#9dfcc7" : "#9f91ff"} transparent opacity={0.25} blending={AdditiveBlending} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ─── Holographic Grid (simplified) ─── */
function HolographicGrid() {
  return (
    <group position={[0, -1.8, -2]}>
      {/* Just a few grid lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`v${i}`} position={[(i - 4) * 1, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.003, 5]} />
          <meshBasicMaterial color="#9dfcc7" transparent opacity={0.06} blending={AdditiveBlending} depthWrite={false} side={DoubleSide} />
        </mesh>
      ))}
      {Array.from({ length: 5 }).map((_, j) => (
        <mesh key={`h${j}`} position={[0, 0, -j * 1]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[0.003, 8]} />
          <meshBasicMaterial color="#9dfcc7" transparent opacity={0.05} blending={AdditiveBlending} depthWrite={false} side={DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Motion Tracking Points (reduced to 10) ─── */
function MotionTrackingPoints({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);
  const random = useMemo(() => seededRandom(9999), []);

  const points = useMemo(() => {
    return Array.from({ length: 10 }).map(() => ({
      position: [(random() - 0.5) * 4.5, (random() - 0.5) * 2.5, (random() - 0.5) * 2.5 - 1] as [number, number, number],
      speed: 0.5 + random() * 1.2,
      offset: random() * Math.PI * 2,
    }));
  }, [random]);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const data = points[i];
      if (!data) return;
      const mesh = child as Mesh;
      mesh.position.x = data.position[0] + Math.sin(time * data.speed + data.offset) * 0.25;
      mesh.position.y = data.position[1] + Math.cos(time * data.speed * 0.7 + data.offset) * 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {points.map((point, i) => (
        <mesh key={i} position={point.position}>
          <octahedronGeometry args={[0.03, 0]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#9dfcc7" : i % 3 === 1 ? "#9f91ff" : "#85e8ff"}
            transparent
            opacity={0.6}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Camera Rig ─── */
function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera } = useThree();
  const target = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const time = state.clock.elapsedTime;
    target.set(
      state.pointer.x * 0.25 + Math.sin(time * 0.1) * 0.08,
      state.pointer.y * 0.15 + Math.cos(time * 0.08) * 0.04,
      5.5
    );
    camera.position.lerp(target, delta * 1.5);
    camera.lookAt(0, 0, -1);
  });

  return null;
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════ */
export default function ARVRScene() {
  const reducedMotion = useReducedMotion() ?? false;
  const [degraded, setDegraded] = useState(false);

  const handleDecline = useCallback(() => setDegraded(true), []);
  const handleIncline = useCallback(() => setDegraded(false), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 52, near: 0.1, far: 30 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      frameloop="demand"
    >
      <PerformanceMonitor onDecline={handleDecline} onIncline={handleIncline} />
      <AdaptiveDpr pixelated />
      <FrameLoopForcer />

      <CameraRig reducedMotion={reducedMotion} />

      {/* Minimal lighting */}
      <ambientLight intensity={0.25} color="#c8ffdc" />
      <pointLight position={[2, 2, 3]} intensity={6} color="#9dfcc7" distance={8} decay={2} />
      <pointLight position={[-2, -1, 2]} intensity={4} color="#9f91ff" distance={7} decay={2} />

      <VRHeadset reducedMotion={reducedMotion} />
      <FloatingARPanels reducedMotion={reducedMotion} />
      <DimensionalPortal reducedMotion={reducedMotion} />
      <HolographicGrid />

      {!degraded && <MotionTrackingPoints reducedMotion={reducedMotion} />}

      <Sparkles count={degraded ? 20 : 50} scale={6} size={1.2} speed={0.3} opacity={0.35} color="#9dfcc7" />

      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.25}
          luminanceSmoothing={0.9}
          intensity={degraded ? 0.5 : 0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}

/** Forces the canvas to keep rendering */
function FrameLoopForcer() {
  const { invalidate } = useThree();
  useFrame(() => { invalidate(); });
  return null;
}
