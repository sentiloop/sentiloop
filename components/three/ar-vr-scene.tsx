"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  Float,
  PerformanceMonitor,
  Sparkles,
  Trail,
} from "@react-three/drei";
import { Bloom, EffectComposer, ChromaticAberration } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  DoubleSide,
  FrontSide,
  Vector2,
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

/* ─── VR Headset Hologram ─── */
function VRHeadset({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  const visorRef = useRef<Mesh>(null);
  const frameRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    const time = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(time * 0.3) * 0.15 + state.pointer.x * 0.1;
    group.current.rotation.x = Math.cos(time * 0.25) * 0.05 + state.pointer.y * 0.05;
    group.current.position.y = Math.sin(time * 0.5) * 0.08;

    if (visorRef.current) {
      const mat = visorRef.current.material as { emissiveIntensity?: number };
      if (mat.emissiveIntensity !== undefined) {
        mat.emissiveIntensity = 0.8 + Math.sin(time * 2) * 0.3;
      }
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3} floatingRange={[-0.05, 0.05]}>
      <group ref={group} position={[0, 0.2, 0]} scale={1.1}>
        {/* Main headset body */}
        <mesh ref={frameRef} castShadow>
          <boxGeometry args={[1.6, 0.85, 0.9, 4, 4, 4]} />
          <meshStandardMaterial
            color="#0a0f0d"
            roughness={0.15}
            metalness={0.92}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Visor / lens area */}
        <mesh ref={visorRef} position={[0, 0, 0.46]}>
          <boxGeometry args={[1.4, 0.65, 0.05, 2, 2, 1]} />
          <meshStandardMaterial
            color="#1a2f28"
            emissive="#9dfcc7"
            emissiveIntensity={0.8}
            roughness={0.05}
            metalness={0.98}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Lens glow left */}
        <mesh position={[-0.32, 0, 0.5]}>
          <circleGeometry args={[0.22, 32]} />
          <meshBasicMaterial
            color="#9dfcc7"
            transparent
            opacity={0.6}
            blending={AdditiveBlending}
            side={FrontSide}
          />
        </mesh>

        {/* Lens glow right */}
        <mesh position={[0.32, 0, 0.5]}>
          <circleGeometry args={[0.22, 32]} />
          <meshBasicMaterial
            color="#85e8ff"
            transparent
            opacity={0.6}
            blending={AdditiveBlending}
            side={FrontSide}
          />
        </mesh>

        {/* Side accent lines */}
        <mesh position={[0.82, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          <meshBasicMaterial color="#9dfcc7" transparent opacity={0.7} />
        </mesh>
        <mesh position={[-0.82, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          <meshBasicMaterial color="#9f91ff" transparent opacity={0.7} />
        </mesh>

        {/* Strap hints */}
        <mesh position={[0.85, 0, -0.2]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[0.08, 0.35, 0.5]} />
          <meshStandardMaterial color="#0d1210" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[-0.85, 0, -0.2]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.08, 0.35, 0.5]} />
          <meshStandardMaterial color="#0d1210" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Holographic aura */}
        <mesh scale={2.2}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial
            color="#9dfcc7"
            transparent
            opacity={0.018}
            blending={AdditiveBlending}
            depthWrite={false}
            side={DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* ─── Floating AR Panels ─── */
function ARPanel({
  position,
  rotation,
  scale,
  color,
  delay,
  reducedMotion,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  delay: number;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<Mesh>(null);
  const borderRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime + delay;
    meshRef.current.position.y = position[1] + Math.sin(time * 0.6) * 0.06;
    meshRef.current.rotation.y = rotation[1] + Math.sin(time * 0.4) * 0.03;

    if (borderRef.current) {
      const mat = borderRef.current.material as { opacity?: number };
      if (mat.opacity !== undefined) {
        mat.opacity = 0.4 + Math.sin(time * 1.2) * 0.15;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {/* Panel glass */}
      <planeGeometry args={[1.2, 0.8, 1, 1]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.06}
        blending={AdditiveBlending}
        side={DoubleSide}
        depthWrite={false}
      />
      {/* Panel border */}
      <mesh ref={borderRef} position={[0, 0, 0.001]}>
        <ringGeometry args={[0.58, 0.6, 4]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.45}
          blending={AdditiveBlending}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Inner content lines (simulated data) */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i} position={[-0.35 + i * 0.24, 0.15, 0.002]}>
          <planeGeometry args={[0.18, 0.02]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.35}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
      {/* Simulated graph bar */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`bar-${i}`} position={[-0.3 + i * 0.15, -0.12 + (i % 3) * 0.04, 0.002]}>
          <planeGeometry args={[0.06, 0.08 + (i % 3) * 0.06]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </mesh>
  );
}

function FloatingARPanels({ reducedMotion }: { reducedMotion: boolean }) {
  const panels = useMemo(
    () => [
      { position: [-2.2, 0.8, -0.5] as [number, number, number], rotation: [0, 0.35, 0.05] as [number, number, number], scale: 0.9, color: "#9dfcc7", delay: 0 },
      { position: [2.4, 0.5, -0.8] as [number, number, number], rotation: [0, -0.3, -0.03] as [number, number, number], scale: 0.75, color: "#85e8ff", delay: 1.2 },
      { position: [-1.8, -0.7, 0.3] as [number, number, number], rotation: [0.05, 0.2, 0.08] as [number, number, number], scale: 0.65, color: "#9f91ff", delay: 2.4 },
      { position: [1.9, -0.9, 0.2] as [number, number, number], rotation: [-0.03, -0.25, -0.05] as [number, number, number], scale: 0.7, color: "#9dfcc7", delay: 3.1 },
      { position: [0.3, 1.3, -1.2] as [number, number, number], rotation: [-0.1, 0.05, 0] as [number, number, number], scale: 0.55, color: "#85e8ff", delay: 1.8 },
    ],
    []
  );

  return (
    <group>
      {panels.map((panel, index) => (
        <ARPanel key={index} {...panel} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
}

/* ─── Dimensional Portal ─── */
function DimensionalPortal({ reducedMotion }: { reducedMotion: boolean }) {
  const portalRef = useRef<Group>(null);
  const innerRingRef = useRef<Mesh>(null);
  const outerRingRef = useRef<Mesh>(null);
  const particlesRef = useRef<Points>(null);

  const portalParticles = useMemo(() => {
    const random = seededRandom(4242);
    const count = 200;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = random() * Math.PI * 2;
      const radius = 1.0 + random() * 0.5;
      const depth = (random() - 0.5) * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = depth;
      sizes[i] = 0.02 + random() * 0.04;
    }

    return { positions, sizes };
  }, []);

  useFrame((state) => {
    if (!portalRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = time * 0.5;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -time * 0.3;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.z = time * 0.15;
      const positions = particlesRef.current.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const z = positions.getZ(i);
        positions.setZ(i, z + 0.008);
        if (z > 1) positions.setZ(i, -1);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <group ref={portalRef} position={[0, 0, -2.5]} scale={1.3}>
      {/* Outer ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[1.5, 0.03, 16, 64]} />
        <meshBasicMaterial
          color="#9f91ff"
          transparent
          opacity={0.6}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Inner ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.1, 0.02, 16, 48]} />
        <meshBasicMaterial
          color="#9dfcc7"
          transparent
          opacity={0.7}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Portal center glow */}
      <mesh>
        <circleGeometry args={[1.0, 48]} />
        <meshBasicMaterial
          color="#0d1a15"
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.9, 48]} />
        <meshBasicMaterial
          color="#9dfcc7"
          transparent
          opacity={0.04}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Radial lines */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 1.3, Math.sin(angle) * 1.3, 0]}
            rotation={[0, 0, angle + Math.PI / 2]}
          >
            <planeGeometry args={[0.005, 0.3]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#9dfcc7" : "#9f91ff"}
              transparent
              opacity={0.3}
              blending={AdditiveBlending}
            />
          </mesh>
        );
      })}

      {/* Portal particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[portalParticles.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#85e8ff"
          transparent
          opacity={0.6}
          blending={AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

/* ─── Orbital Data Streams ─── */
function DataStream({
  radius,
  speed,
  color,
  offset,
  tilt,
  reducedMotion,
}: {
  radius: number;
  speed: number;
  color: string;
  offset: number;
  tilt: [number, number, number];
  reducedMotion: boolean;
}) {
  const meshRef = useRef<Mesh>(null);
  const trailTarget = useRef<Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime * speed + offset;
    meshRef.current.position.x = Math.cos(time) * radius;
    meshRef.current.position.y = Math.sin(time) * radius * 0.4;
    meshRef.current.position.z = Math.sin(time * 0.7) * 0.8;
  });

  return (
    <group rotation={tilt}>
      <Trail
        width={0.08}
        length={8}
        color={color}
        attenuation={(t) => t * t}
        target={trailTarget}
      >
        <mesh ref={(el) => { meshRef.current = el; trailTarget.current = el!; }}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </Trail>
    </group>
  );
}

function OrbitalStreams({ reducedMotion }: { reducedMotion: boolean }) {
  const streams = useMemo(
    () => [
      { radius: 2.2, speed: 0.8, color: "#9dfcc7", offset: 0, tilt: [0.2, 0, 0.1] as [number, number, number] },
      { radius: 2.6, speed: 0.6, color: "#9f91ff", offset: 2, tilt: [-0.3, 0.4, 0] as [number, number, number] },
      { radius: 1.8, speed: 1.0, color: "#85e8ff", offset: 4, tilt: [0.1, -0.2, 0.3] as [number, number, number] },
      { radius: 2.9, speed: 0.45, color: "#9dfcc7", offset: 1.5, tilt: [-0.1, 0.6, -0.2] as [number, number, number] },
    ],
    []
  );

  return (
    <group>
      {streams.map((stream, index) => (
        <DataStream key={index} {...stream} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
}

/* ─── Holographic Grid Floor ─── */
function HolographicGrid({ reducedMotion }: { reducedMotion: boolean }) {
  const gridRef = useRef<Group>(null);

  useFrame((state) => {
    if (!gridRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;
    gridRef.current.position.z = (time * 0.3) % 1;
  });

  const lines = useMemo(() => {
    const items: { pos: [number, number, number]; rot: [number, number, number]; size: [number, number] }[] = [];
    for (let i = -8; i <= 8; i++) {
      items.push({
        pos: [i * 0.5, -1.8, -3],
        rot: [Math.PI / 2, 0, 0],
        size: [0.003, 6],
      });
    }
    for (let j = 0; j < 12; j++) {
      items.push({
        pos: [0, -1.8, -j * 0.5],
        rot: [Math.PI / 2, 0, Math.PI / 2],
        size: [0.003, 8],
      });
    }
    return items;
  }, []);

  return (
    <group ref={gridRef} position={[0, 0, 0]}>
      {lines.map((line, index) => (
        <mesh key={index} position={line.pos} rotation={line.rot}>
          <planeGeometry args={line.size} />
          <meshBasicMaterial
            color="#9dfcc7"
            transparent
            opacity={0.08 - index * 0.001}
            blending={AdditiveBlending}
            depthWrite={false}
            side={DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Motion Tracking Points ─── */
function MotionTrackingPoints({ reducedMotion }: { reducedMotion: boolean }) {
  const pointsRef = useRef<Group>(null);
  const random = useMemo(() => seededRandom(9999), []);

  const trackingPoints = useMemo(() => {
    return Array.from({ length: 18 }).map(() => ({
      position: [
        (random() - 0.5) * 5,
        (random() - 0.5) * 3,
        (random() - 0.5) * 3 - 1,
      ] as [number, number, number],
      speed: 0.5 + random() * 1.5,
      offset: random() * Math.PI * 2,
    }));
  }, [random]);

  useFrame((state) => {
    if (!pointsRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;

    pointsRef.current.children.forEach((child, i) => {
      const data = trackingPoints[i];
      if (!data) return;
      const mesh = child as Mesh;
      mesh.position.x = data.position[0] + Math.sin(time * data.speed + data.offset) * 0.3;
      mesh.position.y = data.position[1] + Math.cos(time * data.speed * 0.7 + data.offset) * 0.2;
      const scale = 0.8 + Math.sin(time * 2 + data.offset) * 0.3;
      mesh.scale.setScalar(scale);
    });
  });

  return (
    <group ref={pointsRef}>
      {trackingPoints.map((point, i) => (
        <mesh key={i} position={point.position}>
          <octahedronGeometry args={[0.035, 0]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#9dfcc7" : i % 3 === 1 ? "#9f91ff" : "#85e8ff"}
            transparent
            opacity={0.7}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
      {/* Connection lines between nearby points */}
      {trackingPoints.slice(0, 10).map((point, i) => {
        const next = trackingPoints[(i + 3) % trackingPoints.length];
        return (
          <mesh
            key={`line-${i}`}
            position={[
              (point.position[0] + next.position[0]) / 2,
              (point.position[1] + next.position[1]) / 2,
              (point.position[2] + next.position[2]) / 2,
            ]}
          >
            <planeGeometry args={[0.003, 0.5]} />
            <meshBasicMaterial
              color="#9dfcc7"
              transparent
              opacity={0.12}
              blending={AdditiveBlending}
              depthWrite={false}
              side={DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* ─── Scene Lighting ─── */
function SceneLighting({ reducedMotion }: { reducedMotion: boolean }) {
  const mintLight = useRef<PointLight>(null);
  const violetLight = useRef<PointLight>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const time = state.clock.elapsedTime;
    if (mintLight.current) {
      mintLight.current.intensity = 8 + Math.sin(time * 0.8) * 2;
      mintLight.current.position.x = Math.sin(time * 0.3) * 2;
    }
    if (violetLight.current) {
      violetLight.current.intensity = 6 + Math.cos(time * 0.6) * 1.5;
      violetLight.current.position.x = Math.cos(time * 0.25) * 2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.25} color="#c8ffdc" />
      <pointLight ref={mintLight} position={[2, 2, 3]} intensity={8} color="#9dfcc7" distance={10} decay={2} />
      <pointLight ref={violetLight} position={[-2, -1, 2]} intensity={6} color="#9f91ff" distance={8} decay={2} />
      <directionalLight position={[0, 3, 5]} intensity={0.8} color="#e6fff0" />
      <spotLight position={[0, 4, 0]} angle={0.4} penumbra={0.8} intensity={3} color="#85e8ff" distance={12} decay={2} />
    </>
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
      state.pointer.x * 0.3 + Math.sin(time * 0.12) * 0.1,
      state.pointer.y * 0.2 + Math.cos(time * 0.1) * 0.06,
      5.5 + Math.sin(time * 0.08) * 0.15
    );
    camera.position.lerp(target, delta * 1.8);
    camera.lookAt(0, 0, -1);
  });

  return null;
}

/* ─── Main AR/VR Scene Export ─── */
export default function ARVRScene() {
  const reducedMotion = useReducedMotion() ?? false;
  const [degraded, setDegraded] = useState(false);

  const handleDecline = useCallback(() => setDegraded(true), []);
  const handleIncline = useCallback(() => setDegraded(false), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 52, near: 0.1, far: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <PerformanceMonitor onDecline={handleDecline} onIncline={handleIncline} />
      <AdaptiveDpr pixelated />

      <CameraRig reducedMotion={reducedMotion} />
      <SceneLighting reducedMotion={reducedMotion} />

      {/* Central VR Headset */}
      <VRHeadset reducedMotion={reducedMotion} />

      {/* Floating AR Interface Panels */}
      <FloatingARPanels reducedMotion={reducedMotion} />

      {/* Dimensional Portal Behind */}
      <DimensionalPortal reducedMotion={reducedMotion} />

      {/* Orbital Data Streams */}
      {!degraded && <OrbitalStreams reducedMotion={reducedMotion} />}

      {/* Holographic Grid Floor */}
      <HolographicGrid reducedMotion={reducedMotion} />

      {/* Motion Tracking Points */}
      <MotionTrackingPoints reducedMotion={reducedMotion} />

      {/* Sparkle field */}
      <Sparkles
        count={degraded ? 40 : 100}
        scale={7}
        size={1.5}
        speed={0.4}
        opacity={0.4}
        color="#9dfcc7"
      />

      {/* Post-processing */}
      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={degraded ? 0.5 : 1.2}
          mipmapBlur
        />
        <ChromaticAberration
          offset={degraded ? new Vector2(0, 0) : new Vector2(0.0008, 0.0008)}
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </Canvas>
  );
}
