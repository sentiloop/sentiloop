"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
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
  type Points,
  type PointLight,
} from "three";
import HoloDisplay from "@/components/three/holo-display";

/* ─── Seeded Random ─── */
function seededRandom(seedValue: number) {
  let seed = seedValue;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/* ═══════════════════════════════════════════════════════
   NEON RAIN PARTICLES
   ═══════════════════════════════════════════════════════ */
function NeonRain({ reducedMotion }: { reducedMotion: boolean }) {
  const rainRef = useRef<Points>(null);
  const count = 600;

  const { positions, velocities } = useMemo(() => {
    const random = seededRandom(2077);
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (random() - 0.5) * 12;
      pos[i * 3 + 1] = random() * 10 - 2;
      pos[i * 3 + 2] = (random() - 0.5) * 8 - 2;
      vel[i] = 2 + random() * 4;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame((_, delta) => {
    if (!rainRef.current || reducedMotion) return;
    const posAttr = rainRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let y = posAttr.getY(i);
      y -= velocities[i] * delta;
      if (y < -3) y = 8 + Math.random() * 2;
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
        size={0.015}
        color="#85e8ff"
        transparent
        opacity={0.5}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════
   VOLUMETRIC FOG PLANES
   ═══════════════════════════════════════════════════════ */
function VolumetricFog({ reducedMotion }: { reducedMotion: boolean }) {
  const fogRef = useRef<Group>(null);

  useFrame((state) => {
    if (!fogRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;
    fogRef.current.children.forEach((child, i) => {
      const mesh = child as Mesh;
      mesh.position.x = Math.sin(time * 0.1 + i * 1.5) * 0.3;
      const mat = mesh.material as { opacity?: number };
      if (mat.opacity !== undefined) {
        mat.opacity = 0.025 + Math.sin(time * 0.3 + i * 0.8) * 0.01;
      }
    });
  });

  return (
    <group ref={fogRef}>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0, -1 + i * 0.8, -3 - i * 0.5]} rotation={[-0.1, 0, 0]}>
          <planeGeometry args={[14, 3]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#9dfcc7" : "#9f91ff"}
            transparent
            opacity={0.025}
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
   NEON BUILDING SILHOUETTES
   ═══════════════════════════════════════════════════════ */
function CyberpunkBuildings({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);

  const buildings = useMemo(() => {
    const random = seededRandom(8080);
    return Array.from({ length: 20 }).map((_, i) => {
      const width = 0.3 + random() * 0.7;
      const height = 1.5 + random() * 4;
      const depth = 0.3 + random() * 0.5;
      const x = (i - 10) * 1.1 + (random() - 0.5) * 0.4;
      const z = -4 - random() * 4;
      const color = ["#9dfcc7", "#9f91ff", "#85e8ff", "#ff6b9d"][Math.floor(random() * 4)];
      return { width, height, depth, x, z, color };
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as Mesh;
      const mat = mesh.material as { emissiveIntensity?: number };
      if (mat.emissiveIntensity !== undefined) {
        mat.emissiveIntensity = 0.3 + Math.sin(time * 0.5 + i * 0.7) * 0.15;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.height / 2, b.z]}>
          <boxGeometry args={[b.width, b.height, b.depth]} />
          <meshStandardMaterial
            color="#050608"
            emissive={b.color}
            emissiveIntensity={0.3}
            roughness={0.8}
            metalness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   NEON LIGHT STRIPS (building edge lights)
   ═══════════════════════════════════════════════════════ */
function NeonStrips({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);

  const strips = useMemo(() => {
    const random = seededRandom(4040);
    return Array.from({ length: 30 }).map(() => {
      const x = (random() - 0.5) * 12;
      const y = random() * 5 - 1;
      const z = -3 - random() * 5;
      const length = 0.5 + random() * 2;
      const vertical = random() > 0.5;
      const color = ["#9dfcc7", "#9f91ff", "#85e8ff", "#ff6b9d"][Math.floor(random() * 4)];
      return { x, y, z, length, vertical, color };
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as Mesh;
      const mat = mesh.material as { opacity?: number };
      if (mat.opacity !== undefined) {
        mat.opacity = 0.5 + Math.sin(time * (1 + i * 0.1) + i) * 0.3;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {strips.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, s.y, s.z]}
          rotation={s.vertical ? [0, 0, Math.PI / 2] : [0, 0, 0]}
        >
          <planeGeometry args={[s.length, 0.02]} />
          <meshBasicMaterial
            color={s.color}
            transparent
            opacity={0.6}
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
   WET GROUND REFLECTIONS
   ═══════════════════════════════════════════════════════ */
function WetGround({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return;
    const mat = meshRef.current.material as { opacity?: number };
    if (mat.opacity !== undefined) {
      mat.opacity = 0.12 + Math.sin(state.clock.elapsedTime * 0.4) * 0.03;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, -2]}>
      <planeGeometry args={[16, 10]} />
      <meshStandardMaterial
        color="#0a0f0d"
        roughness={0.05}
        metalness={0.95}
        emissive="#9dfcc7"
        emissiveIntensity={0.05}
        transparent
        opacity={0.14}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════
   FLOATING NEON SIGNS
   ═══════════════════════════════════════════════════════ */
function NeonSigns({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);

  const signs = useMemo(
    () => [
      { pos: [-3.5, 2.2, -4] as [number, number, number], color: "#ff6b9d", w: 1.2, h: 0.4 },
      { pos: [4.2, 3.1, -5] as [number, number, number], color: "#9dfcc7", w: 1.5, h: 0.35 },
      { pos: [-1.8, 3.8, -6] as [number, number, number], color: "#85e8ff", w: 0.9, h: 0.5 },
      { pos: [2.5, 1.8, -3.5] as [number, number, number], color: "#9f91ff", w: 1.1, h: 0.3 },
    ],
    []
  );

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const group = child as Group;
      group.position.y = signs[i].pos[1] + Math.sin(time * 0.3 + i * 1.2) * 0.05;
      // Flicker effect
      const innerMesh = group.children[0] as Mesh;
      if (innerMesh) {
        const mat = innerMesh.material as { opacity?: number };
        if (mat.opacity !== undefined) {
          const flicker = Math.sin(time * 8 + i * 3) > 0.92 ? 0.3 : 1;
          mat.opacity = 0.7 * flicker;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {signs.map((sign, i) => (
        <group key={i} position={sign.pos}>
          {/* Sign face */}
          <mesh>
            <planeGeometry args={[sign.w, sign.h]} />
            <meshBasicMaterial
              color={sign.color}
              transparent
              opacity={0.7}
              blending={AdditiveBlending}
              depthWrite={false}
              side={FrontSide}
            />
          </mesh>
          {/* Sign glow halo */}
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[sign.w + 0.4, sign.h + 0.3]} />
            <meshBasicMaterial
              color={sign.color}
              transparent
              opacity={0.08}
              blending={AdditiveBlending}
              depthWrite={false}
              side={FrontSide}
            />
          </mesh>
          {/* Horizontal scan line effect */}
          {Array.from({ length: 3 }).map((_, j) => (
            <mesh key={j} position={[0, -sign.h / 2 + (j + 1) * (sign.h / 4), 0.001]}>
              <planeGeometry args={[sign.w * 0.9, 0.005]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.15}
                blending={AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   GLOWING ORB STREET LIGHTS
   ═══════════════════════════════════════════════════════ */
function StreetLights({ reducedMotion }: { reducedMotion: boolean }) {
  const lightsRef = useRef<Group>(null);

  const lights = useMemo(() => {
    const random = seededRandom(6060);
    return Array.from({ length: 8 }).map((_, i) => ({
      pos: [(i - 4) * 2.2 + (random() - 0.5), -0.5, -2 - random() * 3] as [number, number, number],
      color: i % 2 === 0 ? "#9dfcc7" : "#9f91ff",
      intensity: 0.4 + random() * 0.3,
    }));
  }, []);

  useFrame((state) => {
    if (!lightsRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;
    lightsRef.current.children.forEach((child, i) => {
      const mesh = child.children[0] as Mesh;
      if (mesh) {
        const scale = 1 + Math.sin(time * 1.5 + i * 0.9) * 0.15;
        mesh.scale.setScalar(scale);
      }
    });
  });

  return (
    <group ref={lightsRef}>
      {lights.map((light, i) => (
        <group key={i} position={light.pos}>
          <mesh>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial
              color={light.color}
              transparent
              opacity={0.9}
              blending={AdditiveBlending}
            />
          </mesh>
          {/* Point light for bloom pickup */}
          <pointLight
            color={light.color}
            intensity={light.intensity}
            distance={3}
            decay={2}
          />
          {/* Light cone below */}
          <mesh position={[0, -0.4, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.3, 0.8, 12, 1, true]} />
            <meshBasicMaterial
              color={light.color}
              transparent
              opacity={0.04}
              blending={AdditiveBlending}
              depthWrite={false}
              side={DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   INTERACTIVE CURSOR GLOW
   ═══════════════════════════════════════════════════════ */
function CursorGlow({ reducedMotion }: { reducedMotion: boolean }) {
  const lightRef = useRef<PointLight>(null);
  const meshRef = useRef<Mesh>(null);
  const target = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    target.set(state.pointer.x * 4, state.pointer.y * 2.5, 1);
    if (lightRef.current) {
      lightRef.current.position.lerp(target, delta * 4);
    }
    if (meshRef.current) {
      meshRef.current.position.lerp(target, delta * 4);
      meshRef.current.scale.setScalar(0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    }
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        position={[0, 0, 1]}
        color="#9dfcc7"
        intensity={2}
        distance={5}
        decay={2}
      />
      <mesh ref={meshRef} position={[0, 0, 1]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial
          color="#9dfcc7"
          transparent
          opacity={0.3}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   SCENE CAMERA RIG
   ═══════════════════════════════════════════════════════ */
function CyberCameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera } = useThree();
  const target = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const time = state.clock.elapsedTime;
    target.set(
      state.pointer.x * 0.4 + Math.sin(time * 0.08) * 0.15,
      state.pointer.y * 0.25 + 0.3 + Math.cos(time * 0.06) * 0.08,
      6 + Math.sin(time * 0.05) * 0.2
    );
    camera.position.lerp(target, delta * 1.5);
    camera.lookAt(0, 0.5, -3);
  });

  return null;
}

/* ═══════════════════════════════════════════════════════
   SCENE LIGHTING
   ═══════════════════════════════════════════════════════ */
function CyberLighting({ reducedMotion }: { reducedMotion: boolean }) {
  const keyRef = useRef<PointLight>(null);
  const fillRef = useRef<PointLight>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const time = state.clock.elapsedTime;
    if (keyRef.current) {
      keyRef.current.intensity = 4 + Math.sin(time * 0.6) * 1;
    }
    if (fillRef.current) {
      fillRef.current.intensity = 2.5 + Math.cos(time * 0.4) * 0.8;
    }
  });

  return (
    <>
      <ambientLight intensity={0.08} color="#1a1a2e" />
      <pointLight ref={keyRef} position={[3, 4, 2]} intensity={4} color="#9dfcc7" distance={15} decay={2} />
      <pointLight ref={fillRef} position={[-3, 2, 3]} intensity={2.5} color="#9f91ff" distance={12} decay={2} />
      <pointLight position={[0, -1, 5]} intensity={1.5} color="#85e8ff" distance={8} decay={2} />
      <directionalLight position={[0, 5, 3]} intensity={0.3} color="#ffffff" />
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN SCENE EXPORT
   ═══════════════════════════════════════════════════════ */
export default function CyberAtmosphere() {
  const reducedMotion = useReducedMotion() ?? false;
  const [degraded, setDegraded] = useState(false);

  const handleDecline = useCallback(() => setDegraded(true), []);
  const handleIncline = useCallback(() => setDegraded(false), []);

  return (
    <Canvas
      camera={{ position: [0, 0.3, 6], fov: 55, near: 0.1, far: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <PerformanceMonitor onDecline={handleDecline} onIncline={handleIncline} />
      <AdaptiveDpr pixelated />

      <CyberCameraRig reducedMotion={reducedMotion} />
      <CyberLighting reducedMotion={reducedMotion} />

      {/* City silhouette */}
      <CyberpunkBuildings reducedMotion={reducedMotion} />

      {/* Neon edge lights on buildings */}
      <NeonStrips reducedMotion={reducedMotion} />

      {/* Floating neon signs */}
      <NeonSigns reducedMotion={reducedMotion} />

      {/* Street lights with bloom */}
      <StreetLights reducedMotion={reducedMotion} />

      {/* Wet ground reflections */}
      <WetGround reducedMotion={reducedMotion} />

      {/* Volumetric fog layers */}
      <VolumetricFog reducedMotion={reducedMotion} />

      {/* Particle rain */}
      {!degraded && <NeonRain reducedMotion={reducedMotion} />}

      {/* Holographic displays */}
      <HoloDisplay reducedMotion={reducedMotion} />

      {/* Cursor reactive glow */}
      <CursorGlow reducedMotion={reducedMotion} />

      {/* Ambient sparkles */}
      <Sparkles
        count={degraded ? 30 : 80}
        scale={10}
        size={1.2}
        speed={0.3}
        opacity={0.35}
        color="#85e8ff"
      />

      {/* Post-processing: heavy bloom for that neon glow */}
      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.15}
          luminanceSmoothing={0.85}
          intensity={degraded ? 0.8 : 1.8}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
