import { Component, Suspense, type ReactNode, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Color, Group, Quaternion, Vector3 } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function hasGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const GOLD = new Color("#e8b15a");
const TEAL = new Color("#3ee0c8");

function ThinkingBlob({ reduced }: { reduced: boolean }) {
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    if (reduced) {
      group.current.rotation.set(0.15, 0.4, 0.05);
      return;
    }
    group.current.rotation.y = t * 0.22;
    group.current.rotation.z = Math.sin(t * 0.31) * 0.18;
    group.current.rotation.x = Math.sin(t * 0.17) * 0.12;
    const s = 1 + Math.sin(t * 1.35) * 0.035;
    group.current.scale.setScalar(s);
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1, 5]} />
        <MeshDistortMaterial
          color={GOLD}
          emissive={new Color("#6a2a08")}
          emissiveIntensity={0.55}
          roughness={0.18}
          metalness={0.72}
          distort={reduced ? 0.28 : 0.52}
          speed={reduced ? 0 : 1.7}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh scale={0.62}>
        <icosahedronGeometry args={[1, 4]} />
        <meshStandardMaterial
          color={TEAL}
          emissive={TEAL}
          emissiveIntensity={0.5}
          roughness={0.4}
          metalness={0.2}
          transparent
          opacity={0.22}
        />
      </mesh>
      <Prominences reduced={reduced} />
      {!reduced && <Sparkles count={28} scale={3.2} size={2.4} speed={0.35} color="#fff3c4" opacity={0.7} />}
    </group>
  );
}

function Prominences({ reduced }: { reduced: boolean }) {
  const group = useRef<Group>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => {
        const phi = Math.acos(1 - (2 * (i + 0.35)) / 11);
        const theta = Math.PI * (1 + 5 ** 0.5) * i;
        const dir = new Vector3(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)).normalize();
        return {
          dir,
          quat: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir),
          pos: dir.clone().multiplyScalar(0.92),
          tip: dir.clone().multiplyScalar(1.28),
          len: 0.32 + (i % 4) * 0.09,
          thick: 0.05 + (i % 3) * 0.012,
          phase: i * 0.63,
        };
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (reduced || !group.current) return;
    const t = clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const s = seeds[i];
      if (!s) return;
      const grow = 0.72 + Math.sin(t * 1.45 + s.phase) * 0.28 + Math.sin(t * 2.1 + s.phase * 0.5) * 0.08;
      child.scale.set(1, grow, 1);
    });
  });

  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <group key={i} position={s.pos} quaternion={s.quat}>
          <mesh position={[0, s.len * 0.42, 0]}>
            <coneGeometry args={[s.thick, s.len, 8]} />
            <meshStandardMaterial
              color="#f6d9a0"
              emissive="#ff8a2a"
              emissiveIntensity={0.85}
              roughness={0.28}
              metalness={0.55}
            />
          </mesh>
          <mesh position={[0, s.len * 0.92, 0]}>
            <sphereGeometry args={[s.thick * 0.85, 12, 12]} />
            <meshStandardMaterial
              color="#fff6d8"
              emissive="#ffe08a"
              emissiveIntensity={1.1}
              roughness={0.2}
              metalness={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[3.2, 2.4, 4]} intensity={28} color="#ffe7b0" distance={12} />
      <pointLight position={[-3.4, -1.2, 2.2]} intensity={18} color="#66fff1" distance={10} />
      <pointLight position={[0, 3, -2]} intensity={10} color="#c8f04d" distance={10} />
    </>
  );
}

class WebGLGuard extends Component<{ children: ReactNode; fallback: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() {
    return { err: true };
  }
  render() {
    return this.state.err ? this.props.fallback : this.props.children;
  }
}

function CssOrb({ size }: { size: number }) {
  return (
    <span
      className="block rounded-[42%] opacity-90"
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 32% 28%, #fff6d0, #e8a44a 42%, #9a3a12 70%, #1a0c08 100%)",
        filter: "blur(0.2px)",
        boxShadow: "0 0 40px rgba(232, 160, 96, 0.35)",
      }}
    />
  );
}

export function AuraOrb({
  size = 240,
  onClick,
}: {
  size?: number;
  onClick?: () => void;
}) {
  const reduced = useReducedMotion();
  const gl = typeof window === "undefined" ? true : hasGL();

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
      aria-label="Добавить Aura на экран"
    >
      <span className="pointer-events-none absolute inset-[-18%] rounded-full bg-[radial-gradient(circle,rgba(200,240,77,0.16),transparent_62%)]" />
      {!gl ? (
        <CssOrb size={size * 0.72} />
      ) : (
        <WebGLGuard fallback={<CssOrb size={size * 0.72} />}>
          <Canvas
            className="pointer-events-none"
            dpr={[1, 1.7]}
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            camera={{ position: [0, 0.12, 3.35], fov: 32 }}
            style={{ width: size, height: size }}
          >
            <Suspense fallback={null}>
              <Lights />
              <ThinkingBlob reduced={reduced} />
            </Suspense>
          </Canvas>
        </WebGLGuard>
      )}
    </button>
  );
}
