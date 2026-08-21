import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const PHRASES = [
  "где найти?",
  "почему так дорого?",
  "а если не оригинал?",
  "сейчас разведут на деньги",
  "как найти лучшее?",
];

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hx: number;
  hy: number;
  tx: number;
  ty: number;
  glyph: boolean;
};

function samplePhrase(text: string, width: number, height: number): { x: number; y: number }[] {
  const w = Math.max(480, Math.floor(width));
  const h = Math.max(220, Math.floor(height * 0.82));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;

  const family = '"Syne", "Manrope", system-ui, sans-serif';
  let font = Math.min(w * 0.18, h * 0.42, 160);
  const layout = (size: number) => {
    ctx.font = `800 ${size}px ${family}`;
    const words = text.split(" ");
    if (ctx.measureText(text).width <= w * 0.92 || words.length === 1) return [text];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  };

  let lines = layout(font);
  while (font > 36) {
    ctx.font = `800 ${font}px ${family}`;
    if (!lines.some((ln) => ctx.measureText(ln).width > w * 0.94)) break;
    font -= 2;
    lines = layout(font);
  }
  ctx.font = `800 ${font}px ${family}`;
  ctx.lineWidth = Math.max(10, font * 0.16);
  const lh = font * 1.05;
  const top = h / 2 - ((lines.length - 1) * lh) / 2;
  lines.forEach((ln, i) => {
    const yy = top + i * lh;
    ctx.strokeText(ln, w / 2, yy);
    ctx.fillText(ln, w / 2, yy);
  });

  const data = ctx.getImageData(0, 0, w, h).data;
  const pts: { x: number; y: number }[] = [];
  const step = w > 1100 ? 1 : 1;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if ((data[(y * w + x) * 4 + 3] ?? 0) < 40) continue;
      pts.push({
        x: (x / w - 0.5) * width * 0.92,
        y: -(y / h - 0.5) * height * 0.7,
      });
    }
  }
  return pts;
}

function palette(dark: boolean): [number, number, number][] {
  if (dark) {
    return [
      [0.96, 0.89, 0.74],
      [0.91, 0.79, 0.55],
      [0.83, 0.64, 0.36],
      [0.98, 0.95, 0.88],
      [0.76, 0.42, 0.22],
    ];
  }
  return [
    [0.12, 0.1, 0.08],
    [0.22, 0.18, 0.14],
    [0.45, 0.28, 0.12],
    [0.35, 0.42, 0.18],
    [0.55, 0.22, 0.12],
  ];
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

  useEffect(() => {
    const host = wrap.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
    camera.position.z = 5;

    const uniforms = {
      uSize: { value: 2.2 },
      uDpr: { value: 1 },
    };
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      uniforms,
      vertexShader: `
        attribute float aSize;
        attribute vec3 aColor;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uSize;
        uniform float uDpr;
        void main() {
          vColor = aColor;
          vAlpha = 0.92;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * uSize * uDpr;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float edge = smoothstep(0.5, 0.28, d);
          gl_FragColor = vec4(vColor, vAlpha * edge);
        }
      `,
    });

    let geometry = new THREE.BufferGeometry();
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let dots: Dot[] = [];
    let forming = false;
    let phraseI = 0;
    let w = 1;
    let h = 1;
    const mouse = { x: 0, y: 0, on: false };
    const timers: number[] = [];
    let raf = 0;
    let last = performance.now();

    const colorsFor = (n: number, dark: boolean) => {
      const pal = palette(dark);
      const col = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const c = pal[i % pal.length]!;
        col[i * 3] = c[0]!;
        col[i * 3 + 1] = c[1]!;
        col[i * 3 + 2] = c[2]!;
      }
      return col;
    };

    const buildDots = (glyph: { x: number; y: number }[]) => {
      const ambient = Math.round(Math.min(1800, Math.max(500, (w * h) / 900)));
      const n = glyph.length + ambient;
      const next: Dot[] = [];
      for (let i = 0; i < n; i++) {
        const g = i < glyph.length ? glyph[i]! : null;
        const hx = (Math.random() - 0.5) * w;
        const hy = (Math.random() - 0.5) * h;
        next.push({
          x: hx,
          y: hy,
          vx: 0,
          vy: 0,
          hx,
          hy,
          tx: g ? g.x : hx,
          ty: g ? g.y : hy,
          glyph: Boolean(g),
        });
      }
      return next;
    };

    const upload = () => {
      const n = dots.length;
      const pos = new Float32Array(n * 3);
      const sizes = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const d = dots[i]!;
        pos[i * 3] = d.x;
        pos[i * 3 + 1] = d.y;
        pos[i * 3 + 2] = 0;
        sizes[i] = d.glyph && forming ? 2.15 : 1.15 + (i % 7 === 0 ? 0.7 : 0);
      }
      geometry.dispose();
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      const dark = document.documentElement.dataset.theme !== "light";
      geometry.setAttribute("aColor", new THREE.BufferAttribute(colorsFor(n, dark), 3));
      points.geometry = geometry;
    };

    const setPhrase = (index: number) => {
      const glyph = samplePhrase(PHRASES[index] ?? "", w, h);
      dots = buildDots(glyph);
      forming = true;
      upload();
    };

    const cloud = () => {
      forming = false;
      for (const d of dots) {
        d.tx = d.hx;
        d.ty = d.hy;
      }
    };

    const resize = () => {
      w = Math.max(1, host.clientWidth);
      h = Math.max(1, host.clientHeight);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
      uniforms.uDpr.value = dpr;
      uniforms.uSize.value = Math.max(1.8, Math.min(2.8, w / 520));
      if (forming) setPhrase(phraseI);
      else {
        dots = buildDots([]);
        upload();
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const cycle = () => {
      if (reduced) {
        setPhrase(0);
        return;
      }
      timers.push(
        window.setTimeout(() => {
          phraseI = (phraseI + 1) % PHRASES.length;
          setPhrase(phraseI);
          timers.push(
            window.setTimeout(() => {
              cloud();
              cycle();
            }, 4200),
          );
        }, 900),
      );
    };
    cycle();

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      mouse.x = e.clientX - r.left - w / 2;
      mouse.y = -(e.clientY - r.top - h / 2);
      mouse.on = true;
    };
    const onLeave = () => {
      mouse.on = false;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    const posAttr = () => geometry.getAttribute("position") as THREE.BufferAttribute;

    const tick = (now: number) => {
      const dt = Math.min(32, now - last) / 16.6;
      last = now;
      const attr = posAttr();
      if (!attr) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const arr = attr.array as Float32Array;
      const pull = forming ? 0.085 : 0.028;
      const R = 88;
      const R2 = R * R;
      const t = now * 0.001;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]!;
        const wander = forming && d.glyph ? 0.35 : 6.5;
        const tx = d.tx + (reduced ? 0 : Math.sin(t * 0.4 + i * 0.17) * wander);
        const ty = d.ty + (reduced ? 0 : Math.cos(t * 0.33 + i * 0.13) * wander * 0.7);
        d.vx += (tx - d.x) * pull * dt;
        d.vy += (ty - d.y) * pull * dt;
        if (mouse.on && !reduced) {
          const dx = d.x - mouse.x;
          const dy = d.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 0.4) {
            const dist = Math.sqrt(d2);
            const f = (1 - dist / R) ** 2 * 2.4;
            d.vx += (dx / dist) * f * dt;
            d.vy += (dy / dist) * f * dt;
          }
        }
        d.vx *= 0.86;
        d.vy *= 0.86;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        arr[i * 3] = d.x;
        arr[i * 3 + 1] = d.y;
      }
      attr.needsUpdate = true;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
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
    />
  );
}
