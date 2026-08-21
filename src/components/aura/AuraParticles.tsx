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
  const w = Math.max(320, Math.floor(width));
  const h = Math.max(180, Math.floor(height * 0.62));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let font = Math.min(w * 0.13, h * 0.28, 108);
  const family = '"Manrope", system-ui, sans-serif';
  const layout = (size: number) => {
    ctx.font = `600 ${size}px ${family}`;
    const words = text.split(" ");
    if (ctx.measureText(text).width <= w * 0.9 || words.length === 1) return [text];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  };

  let lines = layout(font);
  while (font > 32) {
    ctx.font = `600 ${font}px ${family}`;
    const tooWide = lines.some((ln) => ctx.measureText(ln).width > w * 0.92);
    if (!tooWide) break;
    font -= 3;
    lines = layout(font);
  }
  ctx.font = `600 ${font}px ${family}`;
  const lh = font * 1.15;
  const top = h / 2 - ((lines.length - 1) * lh) / 2;
  lines.forEach((ln, i) => ctx.fillText(ln, w / 2, top + i * lh));

  const step = w > 900 ? 2 : 3;
  const data = ctx.getImageData(0, 0, w, h).data;
  const pts: { x: number; y: number }[] = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if ((data[(y * w + x) * 4 + 3] ?? 0) > 88) {
        pts.push({
          x: (x / w) * width,
          y: (y / h) * height * 0.72 + height * 0.12,
        });
      }
    }
  }
  return pts;
}

function scatterHomes(n: number, w: number, h: number): { x: number; y: number }[] {
  const out = [];
  const padX = 12;
  const padY = 10;
  for (let i = 0; i < n; i++) {
    out.push({
      x: padX + Math.random() * Math.max(1, w - padX * 2),
      y: padY + Math.random() * Math.max(1, h - padY * 2),
    });
  }
  return out;
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
    let phrasePts: { x: number; y: number }[] = [];
    let forming = false;
    let phraseI = 0;
    let raf = 0;
    let last = performance.now();
    const mouse = { x: -9999, y: -9999, on: false };
    const timers: number[] = [];

    const countFor = (w: number, h: number) => Math.round(Math.min(2400, Math.max(800, (w * h) / 260)));

    const rebuild = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      const n = countFor(w, h);
      const homes = scatterHomes(n, w, h);
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
          r: roll > 0.92 ? 1.6 + Math.random() * 0.6 : 0.45 + Math.random() * 0.7,
          seed: Math.random() * Math.PI * 2,
          glyph: false,
        };
      });
    };

    const assignPhrase = (index: number) => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      phrasePts = samplePhrase(PHRASES[index] ?? "", w, h);
      particles.forEach((p) => {
        p.glyph = false;
        p.gx = p.hx;
        p.gy = p.hy;
      });
      const used = new Set<number>();
      for (const pt of phrasePts) {
        let best = -1;
        let bestD = 1e12;
        for (let i = 0; i < particles.length; i++) {
          if (used.has(i)) continue;
          const p = particles[i]!;
          const d = (p.hx - pt.x) ** 2 + (p.hy - pt.y) ** 2;
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
        if (best >= 0) {
          used.add(best);
          const p = particles[best]!;
          p.gx = pt.x;
          p.gy = pt.y;
          p.glyph = true;
        }
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
            }, 3400),
          );
        }, 1600),
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

    const R = 108;
    const R2 = R * R;

    const tick = (now: number) => {
      const dt = Math.min(32, now - last) / 16.6;
      last = now;
      const w = host.clientWidth;
      const h = host.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const t = now * 0.001;
      for (const p of particles) {
        const wx = forming || reduced ? 0 : Math.sin(t * 0.35 + p.seed) * 5;
        const wy = forming || reduced ? 0 : Math.cos(t * 0.28 + p.seed) * 4;
        const tx = (forming && p.glyph ? p.gx : p.hx) + wx;
        const ty = (forming && p.glyph ? p.gy : p.hy) + wy;

        p.vx += (tx - p.x) * 0.055 * dt;
        p.vy += (ty - p.y) * 0.055 * dt;

        if (mouse.on && !reduced) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 0.25) {
            const d = Math.sqrt(d2);
            const f = (1 - d / R) ** 2 * 3.1;
            p.vx += (dx / d) * f * dt;
            p.vy += (dy / d) * f * dt;
          }
        }

        p.vx *= 0.84;
        p.vy *= 0.84;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }

      const dark = document.documentElement.dataset.theme !== "light";
      for (const p of particles) {
        const a = p.glyph && forming ? 0.9 : dark ? 0.4 + p.r * 0.1 : 0.5 + p.r * 0.08;
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
