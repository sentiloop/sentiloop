"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
  LineSegments,
  MathUtils,
  PointLight,
  ShaderMaterial,
  Vector3,
  type Group,
  type Mesh,
  type Points,
} from "three";

/* ─── Types ─── */
export type LoginPhase = "intro" | "ready" | "authenticating" | "success";
export type LoginSceneProps = { phase: LoginPhase };

/* ─── Constants ─── */
const CYAN = new Color("#63dcff").multiplyScalar(2.4);
const VIOLET = new Color("#8b6dff").multiplyScalar(1.9);
const BG_COLOR = new Color("#020510");

/* ─── Seeded Random ─── */
function seededRandom(seedValue: number) {
  let seed = seedValue;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/* ─── GLSL Noise Shader for Central Orb ─── */
const SIMPLEX_NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const ORB_VERTEX = /* glsl */ `
${SIMPLEX_NOISE_GLSL}
uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
void main(){
  float noise = snoise(position * uFrequency + uTime * 0.4);
  vec3 displaced = position + normal * noise * uAmplitude;
  vNormal = normalize(normalMatrix * normal);
  vPosition = displaced;
  vWorldPosition = (modelMatrix * vec4(displaced, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;

const ORB_FRAGMENT = /* glsl */ `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;
void main(){
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.5);
  float shimmer = sin(dot(vNormal, vec3(1.0, 0.5, 0.3)) * 6.0 + uTime * 1.5) * 0.5 + 0.5;
  vec3 cyan = vec3(0.39, 0.86, 1.0);
  vec3 violet = vec3(0.55, 0.43, 1.0);
  vec3 white = vec3(1.0, 0.97, 1.0);
  vec3 baseColor = mix(cyan, violet, shimmer);
  baseColor = mix(baseColor, white, fresnel * 0.6);
  float alpha = 0.35 + fresnel * 0.65;
  gl_FragColor = vec4(baseColor * (1.2 + fresnel * 1.8), alpha);
}
`;

/* ─── Central Noise Orb ─── */
function NoiseOrb({ phase, reducedMotion }: { phase: LoginPhase; reducedMotion: boolean }) {
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 0.08 },
      uFrequency: { value: 1.8 },
    }),
    []
  );

  useFrame((state, frameDelta) => {
    if (!matRef.current || !meshRef.current) return;
    const delta = Math.min(frameDelta, 0.05);
    const elapsed = state.clock.elapsedTime;

    matRef.current.uniforms.uTime.value = elapsed;

    let targetAmp = 0.15;
    if (phase === "intro") targetAmp = 0.08;
    else if (phase === "authenticating") targetAmp = 0.25 + Math.sin(elapsed * 4) * 0.08;
    else if (phase === "success") targetAmp = 0.6;

    matRef.current.uniforms.uAmplitude.value = MathUtils.damp(
      matRef.current.uniforms.uAmplitude.value,
      targetAmp,
      3,
      delta
    );

    if (!reducedMotion) {
      meshRef.current.position.y = Math.sin(elapsed * 0.7) * 0.12;
      meshRef.current.rotation.y = MathUtils.damp(
        meshRef.current.rotation.y,
        state.pointer.x * 0.4,
        2,
        delta
      );
      meshRef.current.rotation.x = MathUtils.damp(
        meshRef.current.rotation.x,
        -state.pointer.y * 0.2,
        2,
        delta
      );
      const targetScale = phase === "success" ? 1.8 : 1;
      const s = MathUtils.damp(meshRef.current.scale.x, targetScale, 2.5, delta);
      meshRef.current.scale.setScalar(s);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.1, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={ORB_VERTEX}
        fragmentShader={ORB_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ─── Neural Network Constellation ─── */
function createNeuralData(nodeCount: number) {
  const rng = seededRandom(31415);
  const positions = new Float32Array(nodeCount * 3);
  for (let i = 0; i < nodeCount; i++) {
    const r = 2.5 + rng() * 5;
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi) - 1;
  }
  // Build edges between nearby nodes
  const edges: number[] = [];
  const threshold = 2.8;
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < threshold * threshold) {
        edges.push(
          positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
          positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
        );
      }
    }
  }
  return { nodePositions: positions, edgePositions: new Float32Array(edges) };
}

function NeuralNetwork({ phase, reducedMotion }: { phase: LoginPhase; reducedMotion: boolean }) {
  const nodesRef = useRef<Points>(null);
  const edgesRef = useRef<LineSegments>(null);
  const groupRef = useRef<Group>(null);

  const { nodePositions, edgePositions } = useMemo(() => createNeuralData(85), []);

  const edgeGeom = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(edgePositions, 3));
    return geo;
  }, [edgePositions]);

  useFrame((state, frameDelta) => {
    if (!groupRef.current || reducedMotion) return;
    const delta = Math.min(frameDelta, 0.05);
    const speed = phase === "authenticating" ? 0.15 : phase === "success" ? 0.4 : 0.03;
    groupRef.current.rotation.y += delta * speed;
    groupRef.current.rotation.x = MathUtils.damp(
      groupRef.current.rotation.x, state.pointer.y * 0.05, 2, delta
    );
    const targetScale = phase === "success" ? 2.2 : 1;
    const s = MathUtils.damp(groupRef.current.scale.x, targetScale, 2, delta);
    groupRef.current.scale.setScalar(s);
  });

  return (
    <group ref={groupRef}>
      <points ref={nodesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          sizeAttenuation
          color={CYAN}
          transparent
          opacity={0.85}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <lineSegments ref={edgesRef} geometry={edgeGeom} frustumCulled={false}>
        <lineBasicMaterial
          color={CYAN}
          transparent
          opacity={0.12}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>
    </group>
  );
}

/* ─── Particle Universe (Galaxy Spiral) ─── */
function createParticleData(count: number) {
  const rng = seededRandom(92017 + count);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const cyan = new Color("#68dcff");
  const blue = new Color("#397cff");
  const violet = new Color("#9274ff");

  for (let i = 0; i < count; i++) {
    // Galaxy spiral pattern
    const arm = Math.floor(rng() * 3);
    const armAngle = (arm / 3) * Math.PI * 2;
    const dist = 1.2 + Math.pow(rng(), 0.5) * 7;
    const spiral = dist * 0.4;
    const angle = armAngle + spiral + (rng() - 0.5) * 0.8;
    const ySpread = (rng() - 0.5) * (0.6 + dist * 0.15);

    positions[i * 3] = Math.cos(angle) * dist;
    positions[i * 3 + 1] = ySpread;
    positions[i * 3 + 2] = Math.sin(angle) * dist * 0.6 - 2;

    const color = i % 7 === 0 ? violet : i % 3 === 0 ? blue : cyan;
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  return { positions, colors };
}

const ParticleField = memo(function ParticleField({
  count,
  phase,
  reducedMotion,
}: {
  count: number;
  phase: LoginPhase;
  reducedMotion: boolean;
}) {
  const points = useRef<Points>(null);
  const data = useMemo(() => createParticleData(count), [count]);

  useFrame((state, frameDelta) => {
    if (!points.current || reducedMotion) return;
    const delta = Math.min(frameDelta, 0.05);
    const speed = phase === "success" ? 0.4 : phase === "authenticating" ? 0.1 : 0.02;
    points.current.rotation.y += delta * speed;
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
    const targetScale = phase === "success" ? 2.5 : 1;
    const s = MathUtils.damp(points.current.scale.x, targetScale, 2.2, delta);
    points.current.scale.setScalar(s);
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

/* ─── Energy Rings (3 concentric) ─── */
function EnergyRings({ phase, reducedMotion }: { phase: LoginPhase; reducedMotion: boolean }) {
  const ring1 = useRef<Mesh>(null);
  const ring2 = useRef<Mesh>(null);
  const ring3 = useRef<Mesh>(null);

  useFrame((state, frameDelta) => {
    if (reducedMotion) return;
    const delta = Math.min(frameDelta, 0.05);
    const elapsed = state.clock.elapsedTime;
    const speedMul = phase === "authenticating" ? 3.5 : 1;
    const expandScale = phase === "success" ? 3.0 : 1;

    if (ring1.current) {
      ring1.current.rotation.x += delta * 0.12 * speedMul;
      ring1.current.rotation.z += delta * 0.08 * speedMul;
      const s = MathUtils.damp(ring1.current.scale.x, expandScale, 2, delta);
      ring1.current.scale.setScalar(s);
    }
    if (ring2.current) {
      ring2.current.rotation.y += delta * 0.15 * speedMul;
      ring2.current.rotation.x -= delta * 0.05 * speedMul;
      const s = MathUtils.damp(ring2.current.scale.x, expandScale, 2, delta);
      ring2.current.scale.setScalar(s);
    }
    if (ring3.current) {
      ring3.current.rotation.z -= delta * 0.1 * speedMul;
      ring3.current.rotation.y += delta * 0.06 * speedMul;
      const s = MathUtils.damp(ring3.current.scale.x, expandScale, 2, delta);
      ring3.current.scale.setScalar(s);
    }

    // Pulsing opacity
    if (ring1.current?.material && "opacity" in ring1.current.material) {
      (ring1.current.material as { opacity: number }).opacity = 0.2 + Math.sin(elapsed * 1.5) * 0.08;
    }
    if (ring2.current?.material && "opacity" in ring2.current.material) {
      (ring2.current.material as { opacity: number }).opacity = 0.15 + Math.sin(elapsed * 1.8 + 1) * 0.06;
    }
    if (ring3.current?.material && "opacity" in ring3.current.material) {
      (ring3.current.material as { opacity: number }).opacity = 0.12 + Math.sin(elapsed * 2.1 + 2) * 0.05;
    }
  });

  return (
    <group position={[0, 0, -0.5]}>
      <mesh ref={ring1} rotation={[0.3, 0.1, 0]}>
        <torusGeometry args={[2.5, 0.015, 8, 128]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.2} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={ring2} rotation={[1.2, 0.5, 0.3]}>
        <torusGeometry args={[3.0, 0.012, 8, 128]} />
        <meshBasicMaterial color={VIOLET} transparent opacity={0.15} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={ring3} rotation={[0.8, -0.4, 1.1]}>
        <torusGeometry args={[3.6, 0.01, 8, 128]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.12} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ─── Glass Spheres (5 floating) ─── */
const GLASS_POSITIONS: [number, number, number][] = [
  [-3.2, 1.8, -1.5],
  [3.5, 1.2, -2.0],
  [-2.5, -1.6, -0.8],
  [2.8, -1.9, -1.2],
  [0.3, 2.8, -2.5],
];

function GlassSpheres({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);

  useFrame((state, frameDelta) => {
    if (!groupRef.current || reducedMotion) return;
    const delta = Math.min(frameDelta, 0.05);
    const elapsed = state.clock.elapsedTime;
    groupRef.current.rotation.y = MathUtils.damp(
      groupRef.current.rotation.y,
      state.pointer.x * 0.06,
      2,
      delta
    );
    groupRef.current.children.forEach((child, i) => {
      child.position.y =
        GLASS_POSITIONS[i][1] + Math.sin(elapsed * 0.5 + i * 1.2) * 0.2;
    });
  });

  return (
    <group ref={groupRef}>
      {GLASS_POSITIONS.map((pos, i) => (
        <mesh key={i} position={pos} scale={0.3 + i * 0.08}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial
            color="#88ccff"
            transmission={0.92}
            thickness={1.5}
            roughness={0.05}
            metalness={0.0}
            transparent
            opacity={0.4}
            envMapIntensity={1}
            ior={1.5}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Volumetric Light Beams ─── */
function VolumetricBeams({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.15;
    groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.09) * 0.06;
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      <mesh position={[-2.5, 2, 0]} rotation={[0.1, 0, -0.6]}>
        <coneGeometry args={[1.2, 8, 32, 1, true]} />
        <meshBasicMaterial
          color="#46c8ff"
          transparent
          opacity={0.03}
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>
      <mesh position={[2.8, 1.5, -0.5]} rotation={[-0.05, 0, 0.7]}>
        <coneGeometry args={[1.0, 7, 32, 1, true]} />
        <meshBasicMaterial
          color="#826cff"
          transparent
          opacity={0.025}
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>
      <mesh position={[0, -2.5, -1]} rotation={[0.9, 0.2, 0]}>
        <coneGeometry args={[0.8, 6, 32, 1, true]} />
        <meshBasicMaterial
          color="#55aaff"
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

/* ─── Aurora Backdrop ─── */
function AuroraBackdrop({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);
  const mesh1 = useRef<Mesh>(null);
  const mesh2 = useRef<Mesh>(null);
  const mesh3 = useRef<Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const elapsed = state.clock.elapsedTime;
    groupRef.current.rotation.z = Math.sin(elapsed * 0.08) * 0.04;
    groupRef.current.position.x = Math.cos(elapsed * 0.06) * 0.15;

    // Hue shifting via color changes
    if (mesh1.current?.material && "color" in mesh1.current.material) {
      const hue = (elapsed * 0.02) % 1;
      (mesh1.current.material as { color: Color }).color.setHSL(0.55 + hue * 0.1, 0.8, 0.4);
    }
    if (mesh2.current?.material && "color" in mesh2.current.material) {
      const hue = (elapsed * 0.015 + 0.3) % 1;
      (mesh2.current.material as { color: Color }).color.setHSL(0.7 + hue * 0.1, 0.7, 0.35);
    }
    if (mesh3.current?.material && "color" in mesh3.current.material) {
      const hue = (elapsed * 0.025 + 0.6) % 1;
      (mesh3.current.material as { color: Color }).color.setHSL(0.6 + hue * 0.08, 0.75, 0.38);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -8]}>
      <mesh ref={mesh1} position={[-3, 1.5, 0]} scale={[4.5, 2.5, 1]}>
        <circleGeometry args={[1, 64]} />
        <meshBasicMaterial
          color="#1f7cff"
          transparent
          opacity={0.045}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={mesh2} position={[3, -1, -1]} scale={[5, 3, 1]}>
        <circleGeometry args={[1, 64]} />
        <meshBasicMaterial
          color="#6e45ff"
          transparent
          opacity={0.04}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={mesh3} position={[0, 2.5, -0.5]} scale={[3.5, 2, 1]}>
        <circleGeometry args={[1, 64]} />
        <meshBasicMaterial
          color="#3388dd"
          transparent
          opacity={0.035}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ─── Interactive Camera Rig ─── */
function CameraRig({ phase, reducedMotion }: { phase: LoginPhase; reducedMotion: boolean }) {
  const posTarget = useMemo(() => new Vector3(), []);
  const lookTarget = useMemo(() => new Vector3(), []);
  const startTime = useRef(0);
  const { clock } = useThree();

  // Track phase transitions for intro animation
  const prevPhase = useRef<LoginPhase>(phase);
  if (phase !== prevPhase.current) {
    if (prevPhase.current === "intro" && phase === "ready") {
      startTime.current = clock.elapsedTime;
    }
    prevPhase.current = phase;
  }

  useFrame((state, frameDelta) => {
    if (reducedMotion) return;
    const delta = Math.min(frameDelta, 0.05);
    const elapsed = state.clock.elapsedTime;

    let targetZ = 6.8;
    if (phase === "intro") {
      // Cubic ease from 14 to 6.8 over 2 seconds
      const t = Math.min((elapsed) / 2, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      targetZ = 14 - eased * 7.2;
    } else if (phase === "authenticating") {
      targetZ = 5.8;
    } else if (phase === "success") {
      targetZ = -2;
    }

    const breathe = phase === "ready" ? Math.sin(elapsed * 0.3) * 0.05 : 0;
    const parallaxStrength = phase === "success" ? 0.1 : 0.3;

    posTarget.set(
      state.pointer.x * parallaxStrength,
      state.pointer.y * parallaxStrength * 0.7 + breathe,
      targetZ
    );

    lookTarget.set(
      state.pointer.x * 0.08,
      state.pointer.y * 0.06,
      phase === "success" ? -4 : 0
    );

    const dampSpeed = phase === "intro" ? 1.2 : phase === "success" ? 1.8 : 1.5;
    state.camera.position.x = MathUtils.damp(state.camera.position.x, posTarget.x, dampSpeed, delta);
    state.camera.position.y = MathUtils.damp(state.camera.position.y, posTarget.y, dampSpeed, delta);
    state.camera.position.z = MathUtils.damp(state.camera.position.z, posTarget.z, dampSpeed, delta);
    state.camera.lookAt(lookTarget);
  });

  return null;
}

/* ─── Procedural Lighting (orbiting point lights) ─── */
function OrbitingLights({ reducedMotion }: { reducedMotion: boolean }) {
  const light1 = useRef<PointLight>(null);
  const light2 = useRef<PointLight>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const elapsed = state.clock.elapsedTime;
    if (light1.current) {
      light1.current.position.x = Math.cos(elapsed * 0.3) * 4;
      light1.current.position.y = Math.sin(elapsed * 0.25) * 2.5;
      light1.current.position.z = Math.sin(elapsed * 0.3) * 3;
    }
    if (light2.current) {
      light2.current.position.x = Math.cos(elapsed * 0.2 + Math.PI) * 4.5;
      light2.current.position.y = Math.sin(elapsed * 0.35 + 1) * 2;
      light2.current.position.z = Math.sin(elapsed * 0.2 + Math.PI) * 3.5;
    }
  });

  return (
    <>
      <pointLight ref={light1} color="#55caff" intensity={12} distance={10} decay={2} />
      <pointLight ref={light2} color="#8866ff" intensity={10} distance={9} decay={2} />
    </>
  );
}

/* ─── Post Processing ─── */
function PostEffects({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        mipmapBlur
        intensity={0.65}
        luminanceThreshold={0.68}
        luminanceSmoothing={0.3}
        levels={5}
      />
    </EffectComposer>
  );
}

/* ─── Main Scene Export ─── */
export default function LoginScene({ phase }: LoginSceneProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const [quality, setQuality] = useState<"high" | "low">("high");
  const particleCount = reducedMotion ? 900 : quality === "high" ? 3000 : 1500;

  return (
    <Canvas
      dpr={[0.75, 1.5]}
      camera={{ position: [0, 0, reducedMotion ? 6.8 : 14], fov: 50 }}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
      performance={{ min: 0.4, max: 1, debounce: 200 }}
      onCreated={({ gl }) => gl.setClearColor(BG_COLOR, 0)}
    >
      <PerformanceMonitor
        flipflops={2}
        onDecline={() => setQuality("low")}
        onFallback={() => setQuality("low")}
      />
      <fog attach="fog" args={["#020510", 5, 15]} />

      {/* Procedural Lighting */}
      <ambientLight intensity={0.25} color="#b8eaff" />
      <directionalLight position={[2, 5, 5]} intensity={0.8} color="#d8f6ff" />
      <OrbitingLights reducedMotion={reducedMotion} />

      {/* Camera */}
      <CameraRig phase={phase} reducedMotion={reducedMotion} />

      {/* Background layers */}
      <AuroraBackdrop reducedMotion={reducedMotion} />
      <VolumetricBeams reducedMotion={reducedMotion} />

      {/* Mid layers */}
      <ParticleField count={particleCount} phase={phase} reducedMotion={reducedMotion} />
      <NeuralNetwork phase={phase} reducedMotion={reducedMotion} />
      <EnergyRings phase={phase} reducedMotion={reducedMotion} />

      {/* Foreground */}
      <GlassSpheres reducedMotion={reducedMotion} />
      <NoiseOrb phase={phase} reducedMotion={reducedMotion} />

      {/* Post processing */}
      <PostEffects enabled={!reducedMotion && quality === "high"} />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
