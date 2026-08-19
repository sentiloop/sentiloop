"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  Environment,
  Float,
  MeshTransmissionMaterial,
  PerformanceMonitor,
} from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  MathUtils,
  Vector3,
  type Group,
  type Mesh,
} from "three";

/* ═══════════════════════════════════════════════════════
   GRADIENT MESH BLOB — Spline's signature morphing shape
   Vertex displacement driven by noise approximation
   ═══════════════════════════════════════════════════════ */
function GradientBlob({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<{ color?: Color; emissive?: Color; emissiveIntensity?: number }>(null);

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;

    // Organic rotation
    meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.3;
    meshRef.current.rotation.y = time * 0.15;
    meshRef.current.rotation.z = Math.cos(time * 0.15) * 0.2;

    // Scale breathing
    const scale = 1 + Math.sin(time * 0.5) * 0.05;
    meshRef.current.scale.setScalar(scale);

    // Morph vertices for blob effect
    const geo = meshRef.current.geometry;
    const positions = geo.attributes.position;
    const count = positions.count;

    for (let i = 0; i < count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      // Normalize to get direction
      const len = Math.sqrt(x * x + y * y + z * z) || 1;
      const nx = x / len;
      const ny = y / len;
      const nz = z / len;

      // Noise-like displacement
      const noise =
        Math.sin(nx * 3 + time * 0.8) * 0.08 +
        Math.sin(ny * 4 + time * 0.6) * 0.06 +
        Math.cos(nz * 2.5 + time * 0.7) * 0.07;

      const targetLen = 1.3 + noise;
      positions.setXYZ(i, nx * targetLen, ny * targetLen, nz * targetLen);
    }
    positions.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.3, 48, 48]} />
      <meshStandardMaterial
        ref={materialRef as never}
        color="#6b3fa0"
        emissive="#9f91ff"
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.6}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════
   GLASS TORUS — Frosted glass with refraction (Spline-style)
   ═══════════════════════════════════════════════════════ */
function GlassTorus({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;
    meshRef.current.rotation.x = time * 0.12 + Math.sin(time * 0.3) * 0.1;
    meshRef.current.rotation.y = time * 0.18;
    meshRef.current.position.y = Math.sin(time * 0.4) * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} position={[2.2, 0.5, -0.5]} scale={0.7}>
        <torusGeometry args={[1, 0.4, 32, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          chromaticAberration={0.3}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          ior={1.5}
          color="#9dfcc7"
          roughness={0.1}
          transmission={0.95}
        />
      </mesh>
    </Float>
  );
}

/* ═══════════════════════════════════════════════════════
   GLASS ICOSAHEDRON — Another Spline-style glass shape
   ═══════════════════════════════════════════════════════ */
function GlassIcosahedron({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;
    meshRef.current.rotation.x = time * 0.1;
    meshRef.current.rotation.z = time * 0.14;
    meshRef.current.position.y = Math.cos(time * 0.35) * 0.12;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
      <mesh ref={meshRef} position={[-2.4, -0.3, 0.3]} scale={0.55}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.4}
          chromaticAberration={0.25}
          anisotropy={0.2}
          distortion={0.15}
          distortionScale={0.2}
          temporalDistortion={0.08}
          ior={1.4}
          color="#85e8ff"
          roughness={0.05}
          transmission={0.92}
        />
      </mesh>
    </Float>
  );
}

/* ═══════════════════════════════════════════════════════
   INTERACTIVE DRAGGABLE SHAPES — Mouse-reactive objects
   ═══════════════════════════════════════════════════════ */
function DraggableShape({
  position,
  geometry,
  color,
  scale,
  reducedMotion,
}: {
  position: [number, number, number];
  geometry: "box" | "octahedron" | "cone" | "dodecahedron";
  color: string;
  scale: number;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const targetScale = useRef(scale);

  useFrame((state, delta) => {
    if (!meshRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;

    // Gentle float
    meshRef.current.position.y = position[1] + Math.sin(time * 0.6 + position[0]) * 0.08;
    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.4;

    // Hover scale animation
    targetScale.current = hovered ? scale * 1.3 : scale;
    const currentScale = meshRef.current.scale.x;
    const newScale = MathUtils.lerp(currentScale, targetScale.current, delta * 6);
    meshRef.current.scale.setScalar(newScale);

    // Follow mouse slightly when hovered
    if (hovered) {
      meshRef.current.position.x = MathUtils.lerp(
        meshRef.current.position.x,
        position[0] + state.pointer.x * 0.3,
        delta * 3
      );
    } else {
      meshRef.current.position.x = MathUtils.lerp(meshRef.current.position.x, position[0], delta * 2);
    }
  });

  const Geometry = () => {
    switch (geometry) {
      case "box":
        return <boxGeometry args={[1, 1, 1]} />;
      case "octahedron":
        return <octahedronGeometry args={[1, 0]} />;
      case "cone":
        return <coneGeometry args={[0.7, 1.4, 6]} />;
      case "dodecahedron":
        return <dodecahedronGeometry args={[1, 0]} />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Geometry />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.6 : 0.2}
        roughness={0.3}
        metalness={0.7}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

function FloatingShapes({ reducedMotion }: { reducedMotion: boolean }) {
  const shapes = useMemo(
    () => [
      { position: [-3.2, 1.5, -1.5] as [number, number, number], geometry: "box" as const, color: "#9dfcc7", scale: 0.2 },
      { position: [3.0, -1.2, -1] as [number, number, number], geometry: "octahedron" as const, color: "#85e8ff", scale: 0.18 },
      { position: [-1.8, -1.8, -0.5] as [number, number, number], geometry: "cone" as const, color: "#ff6b9d", scale: 0.22 },
      { position: [2.8, 1.8, -1.2] as [number, number, number], geometry: "dodecahedron" as const, color: "#9f91ff", scale: 0.17 },
      { position: [0.5, 2.2, -2] as [number, number, number], geometry: "box" as const, color: "#85e8ff", scale: 0.15 },
      { position: [-2.8, 0.3, -2] as [number, number, number], geometry: "octahedron" as const, color: "#9dfcc7", scale: 0.14 },
    ],
    []
  );

  return (
    <group>
      {shapes.map((shape, i) => (
        <DraggableShape key={i} {...shape} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   GRADIENT RINGS — Spline-style orbit rings
   ═══════════════════════════════════════════════════════ */
function OrbitRings({ reducedMotion }: { reducedMotion: boolean }) {
  const group1 = useRef<Group>(null);
  const group2 = useRef<Group>(null);
  const group3 = useRef<Group>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const time = state.clock.elapsedTime;
    if (group1.current) {
      group1.current.rotation.x = time * 0.1;
      group1.current.rotation.z = time * 0.05;
    }
    if (group2.current) {
      group2.current.rotation.y = time * 0.08;
      group2.current.rotation.x = Math.PI * 0.3 + time * 0.04;
    }
    if (group3.current) {
      group3.current.rotation.z = time * 0.06;
      group3.current.rotation.y = Math.PI * 0.5 + time * 0.03;
    }
  });

  return (
    <>
      <group ref={group1}>
        <mesh>
          <torusGeometry args={[2.5, 0.008, 8, 100]} />
          <meshBasicMaterial color="#9dfcc7" transparent opacity={0.3} />
        </mesh>
      </group>
      <group ref={group2}>
        <mesh>
          <torusGeometry args={[2.8, 0.006, 8, 100]} />
          <meshBasicMaterial color="#9f91ff" transparent opacity={0.2} />
        </mesh>
      </group>
      <group ref={group3}>
        <mesh>
          <torusGeometry args={[3.1, 0.005, 8, 100]} />
          <meshBasicMaterial color="#85e8ff" transparent opacity={0.15} />
        </mesh>
      </group>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   AMBIENT PARTICLES
   ═══════════════════════════════════════════════════════ */
function AmbientDots({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<Mesh>(null);
  const count = 60;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 2;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current || reducedMotion) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref as never}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#ffffff"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════
   CAMERA RIG — follows mouse with damping
   ═══════════════════════════════════════════════════════ */
function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera } = useThree();
  const target = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    target.set(
      state.pointer.x * 0.5,
      state.pointer.y * 0.3,
      5.5
    );
    camera.position.lerp(target, delta * 1.5);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ═══════════════════════════════════════════════════════
   MAIN SCENE EXPORT
   ═══════════════════════════════════════════════════════ */
export default function SplineScene() {
  const reducedMotion = useReducedMotion() ?? false;
  const [degraded, setDegraded] = useState(false);

  const handleDecline = useCallback(() => setDegraded(true), []);
  const handleIncline = useCallback(() => setDegraded(false), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 50, near: 0.1, far: 30 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      frameloop="demand"
    >
      <PerformanceMonitor onDecline={handleDecline} onIncline={handleIncline} />
      <AdaptiveDpr pixelated />
      <FrameForcer />

      <CameraRig reducedMotion={reducedMotion} />

      {/* Soft environment lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-3, 2, 2]} intensity={2} color="#9f91ff" distance={8} decay={2} />
      <pointLight position={[3, -1, 3]} intensity={1.5} color="#9dfcc7" distance={7} decay={2} />

      {/* Environment map for reflections */}
      <Environment preset="city" environmentIntensity={0.4} />

      {/* Main gradient blob */}
      <GradientBlob reducedMotion={reducedMotion} />

      {/* Glass shapes */}
      {!degraded && (
        <>
          <GlassTorus reducedMotion={reducedMotion} />
          <GlassIcosahedron reducedMotion={reducedMotion} />
        </>
      )}

      {/* Orbit rings */}
      <OrbitRings reducedMotion={reducedMotion} />

      {/* Draggable floating shapes */}
      <FloatingShapes reducedMotion={reducedMotion} />

      {/* Ambient particles */}
      <AmbientDots reducedMotion={reducedMotion} />

      {/* Post-processing */}
      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          intensity={degraded ? 0.4 : 0.7}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}

function FrameForcer() {
  const { invalidate } = useThree();
  useFrame(() => { invalidate(); });
  return null;
}
