import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const PHRASES = [
  "где найти?",
  "почему так дорого?",
  "а если не оригинал?",
  "сейчас разведут на деньги",
  "как найти лучшее?",
];

const PHI = Math.PI * (3 - Math.sqrt(5));

type P = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  hx: number;
  hy: number;
  hz: number;
  wx: number;
  wy: number;
  wz: number;
  sx: number;
  sy: number;
  sz: number;
  r: number;
  role: "face" | "halo";
};

function fibonacciSphere(n: number, radius: number): { x: number; y: number; z: number }[] {
  const out = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y)) * radius;
    const theta = PHI * i;
    out.push({ x: Math.cos(theta) * rad, y: y * radius, z: Math.sin(theta) * rad });
  }
  return out;
}

function disk(n: number, cx: number, cy: number, cz: number, r: number): { x: number; y: number; z: number }[] {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = Math.sqrt(Math.random()) * r;
    out.push({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d * 0.92, z: cz + (Math.random() - 0.5) * 0.04 });
  }
  return out;
}

function smile(n: number): { x: number; y: number; z: number }[] {
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1);
    const a = Math.PI * 0.18 + t * Math.PI * 0.64;
    out.push({
      x: Math.cos(a) * 0.34,
      y: Math.sin(a) * 0.22 + 0.18,
      z: 0.12 + Math.sin(t * Math.PI) * 0.04,
    });
  }
  return out;
}

function sampleText(text: string, w: number, h: number, step: number): { x: number; y: number }[] {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const size = text.length > 22 ? 28 : text.length > 16 ? 34 : 42;
  ctx.font = `600 ${size}px "Manrope", system-ui, sans-serif`;
  ctx.fillText(text, w / 2, h / 2);
  const data = ctx.getImageData(0, 0, w, h).data;
  const pts: { x: number; y: number }[] = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if ((data[(y * w + x) * 4 + 3] ?? 0) > 90) {
        pts.push({ x: x / w - 0.5, y: y / h - 0.5 });
      }
    }
  }
  return pts;
}

function makeParticles(): P[] {
  const face = [
    ...disk(90, -0.2, -0.12, 0.16, 0.075),
    ...disk(90, 0.2, -0.12, 0.16, 0.075),
    ...smile(140),
    ...disk(40, 0, 0.02, 0.1, 0.06),
  ];
  const halo = fibonacciSphere(520, 0.62);
  const scatter = fibonacciSphere(face.length + halo.length, 1.85);
  const list: P[] = [];
  face.forEach((p, i) => {
    const s = scatter[i] ?? { x: 0, y: 0, z: 0 };
    list.push({
      x: p.x,
      y: p.y,
      z: p.z,
      vx: 0,
      vy: 0,
      vz: 0,
      hx: p.x,
      hy: p.y,
      hz: p.z,
      wx: p.x,
      wy: p.y,
      wz: p.z,
      sx: s.x,
      sy: s.y,
      sz: s.z,
      r: 1.6 + Math.random() * 0.8,
      role: "face",
    });
  });
  halo.forEach((p, i) => {
    const s = scatter[face.length + i] ?? { x: 0, y: 0, z: 0 };
    list.push({
      x: p.x,
      y: p.y,
      z: p.z,
      vx: 0,
      vy: 0,
      vz: 0,
      hx: p.x,
      hy: p.y,
      hz: p.z,
      wx: p.x,
      wy: p.y,
      wz: p.z,
      sx: s.x * (0.9 + Math.random() * 0.5),
      sy: s.y * (0.9 + Math.random() * 0.5),
      sz: s.z * (0.9 + Math.random() * 0.5),
      r: 1.1 + Math.random() * 0.7,
      role: "halo",
    });
  });
  return list;
}

const WORD_ANCHORS = [
  { x: 0, y: 0.78, s: 1.35 },
  { x: 0, y: -0.82, s: 1.2 },
  { x: -0.92, y: 0.08, s: 1.05 },
  { x: 0.92, y: 0.08, s: 1.05 },
  { x: 0, y: 0.86, s: 1.4 },
];

export function AuraParticles({
  onClick,
  className = "",
}: {
  onClick?: () => void;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const host = wrap.current;
    if (!el || !host) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    const particles = makeParticles();
    const halo = particles.filter((p) => p.role === "halo");
    const words = PHRASES.map((t) => sampleText(t, 720, 140, 2));
    let hover = false;
    let wordOn = false;
    let wordIndex = 0;
    let rot = 0;
    let raf = 0;
    let last = performance.now();

    const applyWord = (index: number) => {
      const pts = words[index] ?? [];
      const anchor = WORD_ANCHORS[index % WORD_ANCHORS.length]!;
      halo.forEach((p, i) => {
        if (!pts.length) {
          p.wx = p.hx;
          p.wy = p.hy;
          p.wz = p.hz;
          return;
        }
        const t = pts[i % pts.length]!;
        p.wx = t.x * 1.7 * anchor.s + anchor.x;
        p.wy = t.y * 0.42 * anchor.s + anchor.y;
        p.wz = 0.02;
      });
    };

    applyWord(0);

    const timers: number[] = [];
    const cycle = () => {
      if (reduced) return;
      timers.push(
        window.setTimeout(() => {
          wordOn = true;
          wordIndex = (wordIndex + 1) % PHRASES.length;
          applyWord(wordIndex);
          timers.push(
            window.setTimeout(() => {
              wordOn = false;
              cycle();
            }, 2800),
          );
        }, 2400),
      );
    };
    cycle();

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = host.clientWidth;
      const h = host.clientHeight;
      el.width = Math.max(1, Math.floor(w * dpr));
      el.height = Math.max(1, Math.floor(h * dpr));
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const gold = getComputedStyle(document.documentElement).getPropertyValue("--gold").trim() || "#e8c9a0";

    const onEnter = () => {
      hover = true;
    };
    const onLeave = () => {
      hover = false;
    };
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);

    const tick = (now: number) => {
      const dt = Math.min(32, now - last) / 16.6;
      last = now;
      const w = host.clientWidth;
      const h = host.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const scale = Math.min(w, h) * 0.42;
      const cx = w / 2;
      const cy = h * 0.46;
      if (!reduced) rot += 0.0032 * dt;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const scatter = hover && !reduced;
      const k = scatter ? 0.055 : 0.09;
      const damp = scatter ? 0.86 : 0.78;

      for (const p of particles) {
        let tx = p.hx;
        let ty = p.hy;
        let tz = p.hz;
        if (scatter) {
          tx = p.sx;
          ty = p.sy;
          tz = p.sz;
        } else if (wordOn && p.role === "halo") {
          tx = p.wx;
          ty = p.wy;
          tz = p.wz;
        }
        p.vx += (tx - p.x) * k * dt;
        p.vy += (ty - p.y) * k * dt;
        p.vz += (tz - p.z) * k * dt;
        p.vx *= damp;
        p.vy *= damp;
        p.vz *= damp;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
      }

      const sorted = particles.slice().sort((a, b) => a.z - b.z);
      for (const p of sorted) {
        let x = p.x;
        let z = p.z;
        if (p.role === "face" || !wordOn || scatter) {
          const rx = p.x * cos - p.z * sin;
          z = p.x * sin + p.z * cos;
          x = rx;
        }
        const depth = 1.35 / (1.35 + z);
        const px = cx + x * scale * depth;
        const py = cy + p.y * scale * depth;
        const rad = Math.max(0.6, p.r * depth * (scatter ? 1.15 : 1));
        const a = 0.28 + depth * 0.72;
        ctx.beginPath();
        ctx.fillStyle =
          depth > 1.05
            ? `rgba(255, 248, 230, ${a})`
            : `rgba(232, 196, 140, ${a})`;
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced) {
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = gold.startsWith("#") ? `${gold}22` : "rgba(232,201,160,0.12)";
        ctx.beginPath();
        ctx.arc(cx, cy, scale * 0.55, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      ro.disconnect();
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <button
      ref={wrap}
      type="button"
      onClick={onClick}
      aria-label="Aura — добавить на экран"
      className={`relative block w-full overflow-hidden ${className}`}
    >
      <canvas ref={canvas} className="block h-full w-full" />
    </button>
  );
}
