"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor, Sparkles } from "@react-three/drei";
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
  type Points,
  type PointLight,
} from "three";

/* ─── Seeded Random ─── */
function seededRandom(seedValue: number) {
  let seed = seedValue;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/* ═══════════════════════════════════════════════════════
   NEON RAIN — reduced from 600 to 200 particles
   ═══════════════════════════════════════════════════════ */
function NeonRain({ reducedMotion }: { reducedMotion: boolean }) {
  const rainRef = useRef<Points>(null);
  const count = 200;

  const { positions, velocities } = useMemo(() => {
    const random = seededRandom(2077);
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (random() - 0.5) * 10;
      pos[i * 3 + 1] = random() * 8 - 2;
      pos[i * 3 + 2] = (random() - 0.5) * 6 - 2;
      vel[i] = 2.5 + random() * 3;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame((_, delta) => {
    if (!rainRef.current || reducedMotion) return;
    const posAttr = rainRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let y = posAttr.getY(i);
      y -= velocities[i] * delta;
      if (y < -3) y = 7;
      posAttr.setY(i, y);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#85e8ff"
        transparent
        opacity={0.45}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════
   NEON BUILDINGS — reduced from 20 to 10 buildings
   ═══════════════════════════════════════════════════════ */
function CyberpunkBuildings() {
  const buildings = useMemo(() => {
    const random = seededRandom(8080);
    return Array.from({ length: 10 }).map((_, i) => {
      const width = 0.4 + random() * 0.8;
      const height = 2 + random() * 4;
      const depth = 0.3 + random() * 0.4;
      const x = (i - 5) * 1.8 + (random() - 0.5) * 0.5;
      const z = -5 - random() * 3;
      const color = ["#9dfcc7", "#9f91ff", "#85e8ff", "#ff6b9d"][Math.floor(random() * 4)];
      return { width, height, depth, x, z, color };
    });
  }, []);

  return (
    <group position={[0, -1.5, 0]}>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.height / 2, b.z]}>
          <boxGeometry args={[b.width, b.height, b.depth]} />
          <meshStandardMaterial
            color="#050608"
            emissive={b.color}
            emissiveIntensity={0.25}
            roughness={0.85}
            metalness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   NEON STRIPS — reduced from 30 to 14
   ═══════════════════════════════════════════════════════ */
function NeonStrips({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);

  const strips = useMemo(() => {
    const random = seededRandom(4040);
    return Array.from({ length: 14 }).map(() => {
      const x = (random() - 0.5) * 10;
      const y = random() * 4 - 0.5;
      const z = -3 - random() * 4;
      const length = 0.8 + random() * 1.5;
      const vertical = random() > 0.5;
      const color = ["#9dfcc7", "#9f91ff", "#85e8ff", "#ff6b9d"][Math.floor(random() * 4)];
      return { x, y, z, length, vertical, color };
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;
    // Only update every other child to halve the per-frame work
    const startIdx = Math.floor(time * 2) % 2;
    for (let i = startIdx; i < groupRef.current.children.length; i += 2) {
      const mesh = groupRef.current.children[i] as Mesh;
      const mat = mesh.material as { opacity?: number };
      if (mat.opacity !== undefined) {
        mat.opacity = 0.5 + Math.sin(time * 1.2 + i) * 0.25;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {strips.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, s.y, s.z]}
          rotation={s.vertical ? [0, 0, Math.PI / 2] : [0, 0, 0]}
        >
          <planeGeometry args={[s.length, 0.025]} />
          <meshBasicMaterial
            color={s.color}
            transparent
            opacity={0.55}
            blending={AdditiveBlending}
            depthWrite={false}
            side={DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   NEON SIGNS — reduced to 3 signs, no per-scanline mesh
   ═══════════════════════════════════════════════════════ */
function NeonSigns({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);

  const signs = useMemo(
    () => [
      { pos: [-3.5, 2.2, -4.5] as [number, number, number], color: "#ff6b9d", w: 1.2, h: 0.4 },
      { pos: [4.2, 3.1, -5.5] as [number, number, number], color: "#9dfcc7", w: 1.4, h: 0.35 },
      { pos: [2.5, 1.8, -3.8] as [number, number, number], color: "#9f91ff", w: 1.0, h: 0.3 },
    ],
    []
  );

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const group = child as Group;
      group.position.y = signs[i].pos[1] + Math.sin(time * 0.3 + i) * 0.04;
      const mesh = group.children[0] as Mesh;
      if (mesh) {
        const mat = mesh.material as { opacity?: number };
        if (mat.opacity !== undefined) {
          const flicker = Math.sin(time * 6 + i * 3) > 0.94 ? 0.35 : 1;
          mat.opacity = 0.65 * flicker;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {signs.map((sign, i) => (
        <group key={i} position={sign.pos}>
          <mesh>
            <planeGeometry args={[sign.w, sign.h]} />
            <meshBasicMaterial
              color={sign.color}
              transparent
              opacity={0.65}
              blending={AdditiveBlending}
              depthWrite={false}
              side={FrontSide}
            />
          </mesh>
          {/* Single glow halo instead of multiple scanlines */}
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[sign.w + 0.3, sign.h + 0.2]} />
            <meshBasicMaterial
              color={sign.color}
              transparent
              opacity={0.06}
              blending={AdditiveBlending}
              depthWrite={false}
              side={FrontSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   WET GROUND — single plane
   ═══════════════════════════════════════════════════════ */
function WetGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, -3]}>
      <planeGeometry args={[14, 8]} />
      <meshStandardMaterial
        color="#080a0c"
        roughness={0.08}
        metalness={0.92}
        emissive="#9dfcc7"
        emissiveIntensity={0.03}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════
   STREET LIGHTS — reduced from 8 to 4
   ═══════════════════════════════════════════════════════ */
function StreetLights() {
  const lights = useMemo(() => {
    const random = seededRandom(6060);
    return Array.from({ length: 4 }).map((_, i) => ({
      pos: [(i - 2) * 3.5 + (random() - 0.5), -0.6, -2.5 - random() * 2] as [number, number, number],
      color: i % 2 === 0 ? "#9dfcc7" : "#9f91ff",
    }));
  }, []);

  return (
    <group>
      {lights.map((light, i) => (
        <group key={i} position={light.pos}>
          <mesh>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={light.color} />
          </mesh>
          <pointLight color={light.color} intensity={0.4} distance={3} decay={2} />
        </group>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   HOLOGRAPHIC BILLBOARD — simplified inline
   ═══════════════════════════════════════════════════════ */
function HoloBillboard({ reducedMotion }: { reducedMotion: boolean }) {
  const scanRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!scanRef.current || reducedMotion) return;
    const y = ((state.clock.elapsedTime * 0.35) % 1) * 2.0 - 1.0;
    scanRef.current.position.y = y;
  });

  return (
    <group position={[0, 1.2, -4]} scale={1.2}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[3.2, 1.9, 0.04]} />
        <meshStandardMaterial
          color="#080a0c"
          roughness={0.2}
          metalness={0.9}
          emissive="#9dfcc7"
          emissiveIntensity={0.04}
        />
      </mesh>
      {/* Border glow */}
      <mesh position={[0, 0.95, 0.03]}>
        <planeGeometry args={[3.2, 0.015]} />
        <meshBasicMaterial color="#9dfcc7" transparent opacity={0.7} blending={AdditiveBlending} />
      </mesh>
      <mesh position={[0, -0.95, 0.03]}>
        <planeGeometry args={[3.2, 0.015]} />
        <meshBasicMaterial color="#9dfcc7" transparent opacity={0.7} blending={AdditiveBlending} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[3.0, 1.7]} />
        <meshBasicMaterial color="#0a1a15" transparent opacity={0.9} />
      </mesh>
      {/* Data rows (5 instead of 8) */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[-0.8 + i * 0.4, 0.3, 0.04]}>
          <planeGeometry args={[0.25 + (i % 3) * 0.1, 0.04]} />
          <meshBasicMaterial
            color={["#9dfcc7", "#85e8ff", "#9f91ff"][i % 3]}
            transparent
            opacity={0.4}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
      {/* Scan line */}
      <mesh ref={scanRef} position={[0, 0, 0.05]}>
        <planeGeometry args={[3.0, 0.012]} />
        <meshBasicMaterial color="#9dfcc7" transparent opacity={0.5} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   CURSOR GLOW — lightweight
   ═══════════════════════════════════════════════════════ */
function CursorGlow({ reducedMotion }: { reducedMotion: boolean }) {
  const lightRef = useRef<PointLight>(null);
  const target = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    if (reducedMotion || !lightRef.current) return;
    target.set(state.pointer.x * 3.5, state.pointer.y * 2, 2);
    lightRef.current.position.lerp(target, delta * 3);
  });

  return (
    <pointLight ref={lightRef} position={[0, 0, 2]} color="#9dfcc7" intensity={1.5} distance={4} decay={2} />
  );
}

/* ═══════════════════════════════════════════════════════
   CAMERA RIG
   ═══════════════════════════════════════════════════════ */
function CyberCameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera } = useThree();
  const target = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const time = state.clock.elapsedTime;
    target.set(
      state.pointer.x * 0.35 + Math.sin(time * 0.08) * 0.1,
      state.pointer.y * 0.2 + 0.3,
      6
    );
    camera.position.lerp(target, delta * 1.2);
    camera.lookAt(0, 0.4, -3);
  });

  return null;
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════ */
export default function CyberAtmosphere() {
  const reducedMotion = useReducedMotion() ?? false;
  const [degraded, setDegraded] = useState(false);

  const handleDecline = useCallback(() => setDegraded(true), []);
  const handleIncline = useCallback(() => setDegraded(false), []);

  return (
    <Canvas
      camera={{ position: [0, 0.3, 6], fov: 55, near: 0.1, far: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      frameloop="demand"
    >
      <PerformanceMonitor onDecline={handleDecline} onIncline={handleIncline} />
      <AdaptiveDpr pixelated />
      {/* Force continuous rendering */}
      <FrameLoopForcer />

      <CyberCameraRig reducedMotion={reducedMotion} />

      {/* Minimal lighting */}
      <ambientLight intensity={0.1} color="#1a1a2e" />
      <pointLight position={[3, 3, 2]} intensity={3} color="#9dfcc7" distance={12} decay={2} />
      <pointLight position={[-3, 2, 2]} intensity={2} color="#9f91ff" distance={10} decay={2} />

      <CyberpunkBuildings />
      <NeonStrips reducedMotion={reducedMotion} />
      <NeonSigns reducedMotion={reducedMotion} />
      <StreetLights />
      <WetGround />
      <HoloBillboard reducedMotion={reducedMotion} />

      {!degraded && <NeonRain reducedMotion={reducedMotion} />}

      <CursorGlow reducedMotion={reducedMotion} />

      <Sparkles count={degraded ? 15 : 40} scale={8} size={1} speed={0.2} opacity={0.3} color="#85e8ff" />

      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          intensity={degraded ? 0.6 : 1.2}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}

/** Forces the canvas to keep rendering despite frameloop="demand" */
function FrameLoopForcer() {
  const { invalidate } = useThree();
  useFrame(() => { invalidate(); });
  return null;
}
