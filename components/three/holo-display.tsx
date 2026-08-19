"use client";

import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  DoubleSide,
  FrontSide,
  type Group,
  type Mesh,
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
   HOLOGRAPHIC BILLBOARD
   ═══════════════════════════════════════════════════════ */
export function HoloBillboard({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);
  const scanRef = useRef<Mesh>(null);
  const glitchRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;

    // Subtle billboard sway
    groupRef.current.rotation.y = Math.sin(time * 0.15) * 0.02;

    // Scan line moving down
    if (scanRef.current) {
      const y = ((time * 0.4) % 1) * 3.2 - 1.6;
      scanRef.current.position.y = y;
    }

    // Glitch offset (occasional)
    if (glitchRef.current) {
      const glitchActive = Math.sin(time * 7) > 0.96;
      if (glitchActive) {
        glitchRef.current.position.x = (Math.random() - 0.5) * 0.05;
        glitchRef.current.position.y = (Math.random() - 0.5) * 0.03;
      } else {
        glitchRef.current.position.x *= 0.9;
        glitchRef.current.position.y *= 0.9;
      }
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.02} floatIntensity={0.1}>
      <group ref={groupRef} position={[0, 1.2, -3.5]} scale={1.3}>
        {/* Billboard frame */}
        <mesh>
          <boxGeometry args={[3.6, 2.2, 0.05]} />
          <meshStandardMaterial
            color="#080a0c"
            roughness={0.2}
            metalness={0.9}
            emissive="#9dfcc7"
            emissiveIntensity={0.05}
          />
        </mesh>

        {/* Frame edge neon border */}
        {/* Top */}
        <mesh position={[0, 1.1, 0.03]}>
          <planeGeometry args={[3.6, 0.02]} />
          <meshBasicMaterial color="#9dfcc7" transparent opacity={0.8} blending={AdditiveBlending} />
        </mesh>
        {/* Bottom */}
        <mesh position={[0, -1.1, 0.03]}>
          <planeGeometry args={[3.6, 0.02]} />
          <meshBasicMaterial color="#9dfcc7" transparent opacity={0.8} blending={AdditiveBlending} />
        </mesh>
        {/* Left */}
        <mesh position={[-1.8, 0, 0.03]}>
          <planeGeometry args={[0.02, 2.2]} />
          <meshBasicMaterial color="#85e8ff" transparent opacity={0.8} blending={AdditiveBlending} />
        </mesh>
        {/* Right */}
        <mesh position={[1.8, 0, 0.03]}>
          <planeGeometry args={[0.02, 2.2]} />
          <meshBasicMaterial color="#85e8ff" transparent opacity={0.8} blending={AdditiveBlending} />
        </mesh>

        {/* Screen content layer with glitch */}
        <group ref={glitchRef} position={[0, 0, 0.04]}>
          {/* Background glow */}
          <mesh>
            <planeGeometry args={[3.4, 2.0]} />
            <meshBasicMaterial
              color="#0a1a15"
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Animated data rows */}
          <BillboardContent reducedMotion={reducedMotion} />

          {/* Scan line */}
          <mesh ref={scanRef} position={[0, 0, 0.01]}>
            <planeGeometry args={[3.4, 0.015]} />
            <meshBasicMaterial
              color="#9dfcc7"
              transparent
              opacity={0.6}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* CRT scanlines overlay */}
          {Array.from({ length: 40 }).map((_, i) => (
            <mesh key={i} position={[0, -1.0 + i * 0.05, 0.005]}>
              <planeGeometry args={[3.4, 0.003]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.02}
                blending={AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>

        {/* Holographic projection aura */}
        <mesh position={[0, 0, -0.1]} scale={[1.15, 1.15, 1]}>
          <planeGeometry args={[3.6, 2.2]} />
          <meshBasicMaterial
            color="#9dfcc7"
            transparent
            opacity={0.02}
            blending={AdditiveBlending}
            depthWrite={false}
            side={DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* ═══════════════════════════════════════════════════════
   BILLBOARD CONTENT (animated text/data lines)
   ═══════════════════════════════════════════════════════ */
function BillboardContent({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);

  const rows = useMemo(() => {
    const random = seededRandom(1234);
    return Array.from({ length: 8 }).map((_, i) => ({
      y: 0.75 - i * 0.22,
      segments: Array.from({ length: 3 + Math.floor(random() * 4) }).map(() => ({
        width: 0.2 + random() * 0.6,
        offset: random() * 0.3,
        color: ["#9dfcc7", "#85e8ff", "#9f91ff"][Math.floor(random() * 3)],
        opacity: 0.3 + random() * 0.4,
      })),
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;

    groupRef.current.children.forEach((rowGroup, i) => {
      const group = rowGroup as Group;
      group.children.forEach((child, j) => {
        const mesh = child as Mesh;
        const mat = mesh.material as { opacity?: number };
        if (mat.opacity !== undefined) {
          const pulse = Math.sin(time * 1.5 + i * 0.5 + j * 0.3);
          mat.opacity = 0.35 + pulse * 0.15;
        }
        // Subtle width animation (data streaming feel)
        const scale = 1 + Math.sin(time * 2 + i + j * 0.7) * 0.05;
        mesh.scale.x = scale;
      });
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0.01]}>
      {rows.map((row, i) => (
        <group key={i} position={[-1.5, row.y, 0]}>
          {row.segments.map((seg, j) => {
            const xPos = row.segments.slice(0, j).reduce((acc, s) => acc + s.width + 0.05, 0) + seg.offset;
            return (
              <mesh key={j} position={[xPos, 0, 0]}>
                <planeGeometry args={[seg.width, 0.06]} />
                <meshBasicMaterial
                  color={seg.color}
                  transparent
                  opacity={seg.opacity}
                  blending={AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   FLOATING HOLOGRAPHIC UI PANELS
   ═══════════════════════════════════════════════════════ */
export function FloatingHoloUI({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);

  const panels = useMemo(
    () => [
      { pos: [-3.2, 2.5, -2] as [number, number, number], rot: [0, 0.3, 0.05] as [number, number, number], size: [0.8, 1.0] as [number, number], color: "#9f91ff" },
      { pos: [3.5, 1.8, -2.5] as [number, number, number], rot: [0, -0.25, -0.03] as [number, number, number], size: [0.9, 0.7] as [number, number], color: "#85e8ff" },
      { pos: [-2.8, -0.3, -1.5] as [number, number, number], rot: [0.05, 0.15, 0.08] as [number, number, number], size: [0.7, 0.9] as [number, number], color: "#9dfcc7" },
      { pos: [3.0, -0.8, -1.8] as [number, number, number], rot: [-0.03, -0.2, -0.05] as [number, number, number], size: [0.85, 0.6] as [number, number], color: "#ff6b9d" },
      { pos: [0.5, 3.2, -3] as [number, number, number], rot: [-0.08, 0.05, 0] as [number, number, number], size: [1.1, 0.5] as [number, number], color: "#85e8ff" },
    ],
    []
  );

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const time = state.clock.elapsedTime;

    groupRef.current.children.forEach((child, i) => {
      const group = child as Group;
      group.position.y = panels[i].pos[1] + Math.sin(time * 0.4 + i * 1.3) * 0.08;
      group.rotation.y = panels[i].rot[1] + Math.sin(time * 0.2 + i * 0.9) * 0.02;
    });
  });

  return (
    <group ref={groupRef}>
      {panels.map((panel, i) => (
        <group key={i} position={panel.pos} rotation={panel.rot}>
          {/* Panel background */}
          <mesh>
            <planeGeometry args={panel.size} />
            <meshBasicMaterial
              color={panel.color}
              transparent
              opacity={0.04}
              blending={AdditiveBlending}
              side={DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* Panel border */}
          {/* Top border */}
          <mesh position={[0, panel.size[1] / 2, 0.001]}>
            <planeGeometry args={[panel.size[0], 0.008]} />
            <meshBasicMaterial color={panel.color} transparent opacity={0.6} blending={AdditiveBlending} />
          </mesh>
          {/* Bottom border */}
          <mesh position={[0, -panel.size[1] / 2, 0.001]}>
            <planeGeometry args={[panel.size[0], 0.008]} />
            <meshBasicMaterial color={panel.color} transparent opacity={0.6} blending={AdditiveBlending} />
          </mesh>
          {/* Left border */}
          <mesh position={[-panel.size[0] / 2, 0, 0.001]}>
            <planeGeometry args={[0.008, panel.size[1]]} />
            <meshBasicMaterial color={panel.color} transparent opacity={0.6} blending={AdditiveBlending} />
          </mesh>
          {/* Right border */}
          <mesh position={[panel.size[0] / 2, 0, 0.001]}>
            <planeGeometry args={[0.008, panel.size[1]]} />
            <meshBasicMaterial color={panel.color} transparent opacity={0.6} blending={AdditiveBlending} />
          </mesh>

          {/* Content: data bars */}
          {Array.from({ length: 4 }).map((_, j) => (
            <mesh key={j} position={[-panel.size[0] * 0.3 + j * panel.size[0] * 0.2, -panel.size[1] * 0.2, 0.002]}>
              <planeGeometry args={[panel.size[0] * 0.12, panel.size[1] * (0.2 + (j % 3) * 0.1)]} />
              <meshBasicMaterial
                color={panel.color}
                transparent
                opacity={0.25}
                blending={AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ))}

          {/* Corner decorations */}
          <mesh position={[-panel.size[0] / 2 + 0.04, panel.size[1] / 2 - 0.04, 0.002]}>
            <planeGeometry args={[0.06, 0.06]} />
            <meshBasicMaterial color={panel.color} transparent opacity={0.5} blending={AdditiveBlending} />
          </mesh>
          <mesh position={[panel.size[0] / 2 - 0.04, panel.size[1] / 2 - 0.04, 0.002]}>
            <planeGeometry args={[0.06, 0.06]} />
            <meshBasicMaterial color={panel.color} transparent opacity={0.5} blending={AdditiveBlending} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   HOLOGRAPHIC DISPLAY WRAPPER (used inside CyberAtmosphere canvas)
   ═══════════════════════════════════════════════════════ */
export default function HoloDisplay({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <group>
      <HoloBillboard reducedMotion={reducedMotion} />
      <FloatingHoloUI reducedMotion={reducedMotion} />
    </group>
  );
}
