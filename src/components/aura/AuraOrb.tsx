import { useEffect, useRef } from "react";

export function AuraOrb({
  size = 128,
  onClick,
}: {
  size?: number;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const start = performance.now();

    const speckles = Array.from({ length: 48 }, (_, i) => ({
      a: (i * 137.5) % 360,
      r: 0.18 + ((i * 17) % 70) / 140,
      s: 0.8 + (i % 5) * 0.25,
    }));

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      const w = size;
      const cx = w / 2;
      const cy = w / 2;
      const breath = prefersReduce ? 1 : 0.97 + Math.sin(t * 1.15) * 0.03;
      const R = (w * 0.34) * breath;

      ctx.clearRect(0, 0, w, w);

      const glow = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, w * 0.5);
      glow.addColorStop(0, "rgba(232, 160, 96, 0.35)");
      glow.addColorStop(0.55, "rgba(31, 111, 106, 0.12)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, w);

      const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      body.addColorStop(0, "#fff6d6");
      body.addColorStop(0.22, "#f5c56b");
      body.addColorStop(0.55, "#e0893a");
      body.addColorStop(0.82, "#b45309");
      body.addColorStop(1, "#7c2d12");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();
      for (const s of speckles) {
        const ang = ((s.a + t * 18) * Math.PI) / 180;
        const rr = s.r * R;
        const x = cx + Math.cos(ang) * rr * 0.85;
        const y = cy + Math.sin(ang) * rr * 0.7;
        ctx.fillStyle = `rgba(255, 248, 220, ${0.12 + (s.s % 1) * 0.2})`;
        ctx.beginPath();
        ctx.ellipse(x, y, 2.2 * s.s, 1.1 * s.s, ang, 0, Math.PI * 2);
        ctx.fill();
      }

      const spin = t * 0.7;
      const hx = cx + Math.cos(spin) * R * 0.25;
      const hy = cy - R * 0.38 + Math.sin(spin) * R * 0.08;
      const hi = ctx.createRadialGradient(hx, hy, 0, hx, hy, R * 0.55);
      hi.addColorStop(0, "rgba(255,255,255,0.85)");
      hi.addColorStop(0.35, "rgba(255,255,255,0.18)");
      hi.addColorStop(1, "transparent");
      ctx.fillStyle = hi;
      ctx.fillRect(0, 0, w, w);

      const band = ctx.createLinearGradient(0, cy - R, 0, cy + R);
      band.addColorStop(0, "rgba(94, 234, 212, 0.0)");
      band.addColorStop(0.45, "rgba(94, 234, 212, 0.16)");
      band.addColorStop(1, "rgba(124, 45, 18, 0.2)");
      ctx.globalCompositeOperation = "soft-light";
      ctx.fillStyle = band;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 250, 230, 0.28)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      if (!prefersReduce) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative grid place-items-center"
      aria-label="Добавить Aura на экран"
    >
      <canvas ref={ref} className="pointer-events-none" />
      <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition group-hover:opacity-100" />
    </button>
  );
}
