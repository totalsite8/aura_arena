import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

export function AuraBeing({
  size = 220,
  listening = false,
  thinking = false,
  onClick,
}: {
  size?: number;
  listening?: boolean;
  thinking?: boolean;
  onClick?: () => void;
}) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLButtonElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      const el = root.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      setLook({ x: clamp(dx, -1, 1) * 8, y: clamp(dy, -1, 1) * 7 });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    let t = 0;
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 140);
        loop();
      }, 2800 + Math.random() * 4200);
    };
    loop();
    return () => window.clearTimeout(t);
  }, [reduced]);

  const eyeY = listening ? 9 : thinking ? 2 : look.y;
  const eyeX = listening ? 0 : look.x;
  const lid = blink ? 0.08 : 1;

  return (
    <motion.button
      ref={root}
      type="button"
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      aria-label="Aura — добавить на экран"
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
      animate={reduced ? undefined : { y: [0, -10, 0] }}
      transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.span
        className="absolute inset-[-22%] rounded-full"
        style={{
          background: "radial-gradient(circle, color-mix(in srgb, var(--gold) 34%, transparent), transparent 68%)",
        }}
        animate={reduced ? undefined : { opacity: [0.45, 0.8, 0.45], scale: [0.92, 1.06, 0.92] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{
            width: size * (0.72 - i * 0.08),
            height: size * (0.72 - i * 0.08),
            background:
              i === 0
                ? "radial-gradient(circle at 32% 28%, #fff7e6 0%, #f0c27a 36%, #c9843c 58%, #7a3e16 100%)"
                : i === 1
                  ? "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.45), rgba(212,165,116,0.0) 55%)"
                  : "radial-gradient(circle at 40% 70%, rgba(255,255,255,0.2), transparent 50%)",
            filter: i === 0 ? "saturate(1.05)" : undefined,
            mixBlendMode: i === 0 ? "normal" : "soft-light",
          }}
          animate={
            reduced
              ? { borderRadius: "58% 42% 48% 52% / 52% 46% 54% 48%" }
              : {
                  borderRadius: [
                    "58% 42% 38% 62% / 52% 38% 62% 48%",
                    "42% 58% 64% 36% / 46% 62% 38% 54%",
                    "50% 50% 42% 58% / 60% 40% 55% 45%",
                    "58% 42% 38% 62% / 52% 38% 62% 48%",
                  ],
                  rotate: listening ? 6 : hovered ? 2 : 0,
                  scale: listening ? 1.04 : thinking ? 1.02 : 1,
                  y: listening ? size * 0.04 : 0,
                }
          }
          transition={{
            borderRadius: { duration: 9 + i * 1.6, repeat: Infinity, ease: "easeInOut" },
            rotate: { type: "spring", stiffness: 80, damping: 16 },
            scale: { type: "spring", stiffness: 90, damping: 14 },
            y: { type: "spring", stiffness: 90, damping: 14 },
          }}
        />
      ))}

      <motion.span
        className="absolute rounded-full"
        style={{
          width: size * 0.22,
          height: size * 0.14,
          top: "22%",
          left: "28%",
          background: "radial-gradient(circle, rgba(255,255,255,0.7), transparent 70%)",
          filter: "blur(1px)",
        }}
        animate={reduced ? undefined : { opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {!reduced &&
        [0, 1, 2, 3].map((i) => (
          <motion.span
            key={`p${i}`}
            className="pointer-events-none absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 14 + i * 3, repeat: Infinity, ease: "linear" }}
          >
            <span
              className="absolute left-1/2 h-1 w-1 rounded-full bg-[color-mix(in_srgb,var(--gold)_85%,white)]"
              style={{ top: `${12 + i * 8}%`, opacity: 0.55 } satisfies CSSProperties}
            />
          </motion.span>
        ))}

      <div
        className="absolute flex"
        style={{
          top: "40%",
          gap: size * 0.14,
          transform: `translateX(-50%)`,
          left: "50%",
        }}
      >
        <Eye x={eyeX} y={eyeY} lid={lid} size={size} />
        <Eye x={eyeX} y={eyeY} lid={lid} size={size} />
      </div>
    </motion.button>
  );
}

function Eye({ x, y, lid, size }: { x: number; y: number; lid: number; size: number }) {
  const s = Math.max(10, size * 0.055);
  return (
    <span
      className="relative block overflow-hidden rounded-full bg-[#1a120c]"
      style={{ width: s, height: s * lid, transition: "height 80ms linear" }}
    >
      <motion.span
        className="absolute left-1/2 top-1/2 h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        animate={{ x, y }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      />
    </span>
  );
}
