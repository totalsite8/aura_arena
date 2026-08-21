import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const PHRASES = [
  "где найти?",
  "почему так дорого?",
  "а если не оригинал?",
  "сейчас разведут на деньги",
  "как найти лучшее?",
];

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hx: number;
  hy: number;
  gx: number;
  gy: number;
  r: number;
  seed: number;
  glyph: boolean;
};

function samplePhrase(text: string, width: number, height: number): { x: number; y: number }[] {
  const w = Math.max(360, Math.floor(width));
  const h = Math.max(200, Math.floor(height * 0.7));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let font = Math.min(w * 0.15, h * 0.32, 128);
  const family = '"Manrope", system-ui, sans-serif';
  const layout = (size: number) => {
    ctx.font = `800 ${size}px ${family}`;
    const words = text.split(" ");
    if (ctx.measureText(text).width <= w * 0.9 || words.length === 1) return [text];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  };

  let lines = layout(font);
  while (font > 30) {
    ctx.font = `800 ${font}px ${family}`;
    const tooWide = lines.some((ln) => ctx.measureText(ln).width > w * 0.92);
    if (!tooWide) break;
    font -= 3;
    lines = layout(font);
  }
  ctx.font = `800 ${font}px ${family}`;
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(6, font * 0.12);
  ctx.strokeStyle = "#fff";
  const lh = font * 1.12;
  const top = h / 2 - ((lines.length - 1) * lh) / 2;
  lines.forEach((ln, i) => {
    const yy = top + i * lh;
    ctx.strokeText(ln, w / 2, yy);
    ctx.fillText(ln, w / 2, yy);
  });

  const data = ctx.getImageData(0, 0, w, h).data;
  const cx = w / 2;
  const cy = h / 2;
  const pts: { x: number; y: number }[] = [];

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if ((data[(y * w + x) * 4 + 3] ?? 0) < 50) continue;
      const nx = (x - cx) / (w * 0.5);
      const ny = (y - cy) / (h * 0.5);
      const dist = Math.min(1, Math.sqrt(nx * nx + ny * ny));
      const keep = 0.72 + 0.28 * (1 - dist) ** 1.2;
      const copies = dist < 0.22 ? 3 : dist < 0.4 ? 2 : 1;
      for (let k = 0; k < copies; k++) {
        if (Math.random() > keep) continue;
        const j = 0.7 + dist * 0.6;
        pts.push({
          x: (x / w) * width + (Math.random() - 0.5) * j,
          y: (y / h) * height * 0.78 + height * 0.1 + (Math.random() - 0.5) * j,
        });
      }
    }
  }
  return pts;
}

function scatterHomes(n: number, w: number, h: number): { x: number; y: number }[] {
  const out = [];
  const padX = 8;
  const padY = 8;
  for (let i = 0; i < n; i++) {
    if (Math.random() < 0.38) {
      const u = Math.random();
      const v = Math.random();
      const a = Math.PI * 2 * u;
      const r = Math.sqrt(v) * 0.42;
      out.push({
        x: w * (0.5 + Math.cos(a) * r * (w / Math.max(w, h))),
        y: h * (0.48 + Math.sin(a) * r * 0.85),
      });
    } else {
      out.push({
        x: padX + Math.random() * Math.max(1, w - padX * 2),
        y: padY + Math.random() * Math.max(1, h - padY * 2),
      });
    }
  }
  return out;
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = a;
  }
  return arr;
}

export function AuraParticles({
  onClick,
  className = "",
}: {
  onClick?: () => void;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const host = wrap.current;
    if (!el || !host) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    let particles: P[] = [];
    let forming = false;
    let phraseI = 0;
    let raf = 0;
    let last = performance.now();
    const mouse = { x: -9999, y: -9999, on: false };
    const timers: number[] = [];

    const countFor = (w: number, h: number) => Math.round(Math.min(9000, Math.max(2800, (w * h) / 58)));

    const rebuild = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      const homes = scatterHomes(countFor(w, h), w, h);
      particles = homes.map((pos) => {
        const roll = Math.random();
        return {
          x: pos.x,
          y: pos.y,
          vx: 0,
          vy: 0,
          hx: pos.x,
          hy: pos.y,
          gx: pos.x,
          gy: pos.y,
          r: roll > 0.97 ? 1.7 : roll > 0.86 ? 1.05 : 0.35 + Math.random() * 0.55,
          seed: Math.random() * Math.PI * 2,
          glyph: false,
        };
      });
    };

    const assignPhrase = (index: number) => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      const pts = shuffle(samplePhrase(PHRASES[index] ?? "", w, h));
      particles.forEach((p) => {
        p.glyph = false;
        p.gx = p.hx;
        p.gy = p.hy;
      });
      const order = shuffle(particles.map((_, i) => i));
      const n = Math.min(pts.length, order.length);
      for (let i = 0; i < n; i++) {
        const p = particles[order[i]!]!;
        const pt = pts[i]!;
        p.gx = pt.x;
        p.gy = pt.y;
        p.glyph = true;
      }
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = host.clientWidth;
      const h = host.clientHeight;
      el.width = Math.max(1, Math.floor(w * dpr));
      el.height = Math.max(1, Math.floor(h * dpr));
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuild();
      if (forming) assignPhrase(phraseI);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const cycle = () => {
      if (reduced) return;
      timers.push(
        window.setTimeout(() => {
          phraseI = (phraseI + 1) % PHRASES.length;
          assignPhrase(phraseI);
          forming = true;
          timers.push(
            window.setTimeout(() => {
              forming = false;
              particles.forEach((p) => {
                p.glyph = false;
                p.gx = p.hx;
                p.gy = p.hy;
              });
              cycle();
            }, 3800),
          );
        }, 1400),
      );
    };
    cycle();

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.on = true;
    };
    const onLeave = () => {
      mouse.on = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    const R = 120;
    const R2 = R * R;

    const tick = (now: number) => {
      const dt = Math.min(32, now - last) / 16.6;
      last = now;
      const w = host.clientWidth;
      const h = host.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const t = now * 0.001;
      const flow = forming ? 0.7 : 8;
      const pull = forming ? 0.05 : 0.024;

      for (const p of particles) {
        const wx = reduced ? 0 : Math.sin(t * 0.42 + p.seed) * flow;
        const wy = reduced ? 0 : Math.cos(t * 0.31 + p.seed * 1.1) * flow * 0.75;
        const tx = (forming && p.glyph ? p.gx : p.hx) + wx;
        const ty = (forming && p.glyph ? p.gy : p.hy) + wy;

        p.vx += (tx - p.x) * pull * dt;
        p.vy += (ty - p.y) * pull * dt;

        if (mouse.on && !reduced) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 0.25) {
            const d = Math.sqrt(d2);
            const f = (1 - d / R) ** 2 * 2.2;
            p.vx += (dx / d) * f * dt;
            p.vy += (dy / d) * f * dt;
          }
        }

        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }

      const dark = document.documentElement.dataset.theme !== "light";
      for (const p of particles) {
        const a = p.glyph && forming ? 0.82 : dark ? 0.28 + p.r * 0.12 : 0.36 + p.r * 0.1;
        ctx.fillStyle =
          p.glyph && forming
            ? dark
              ? `rgba(246, 228, 190, ${a})`
              : `rgba(40, 32, 20, ${a})`
            : dark
              ? `rgba(214, 178, 122, ${a})`
              : `rgba(92, 72, 42, ${a})`;
        ctx.fillRect(p.x, p.y, p.r, p.r);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <div
      ref={wrap}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) onClick();
      }}
      aria-label={onClick ? "Aura — добавить на экран" : undefined}
      className={`relative block w-full overflow-hidden ${className}`}
    >
      <canvas ref={canvas} className="block h-full w-full" />
    </div>
  );
}
