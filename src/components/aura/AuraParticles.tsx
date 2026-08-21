import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const PHRASES = [
  "где найти?",
  "почему так дорого?",
  "а если не оригинал?",
  "сейчас разведут?",
  "как найти лучшее?",
];

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  glyph: boolean;
};

function samplePhrase(text: string, width: number, height: number): { x: number; y: number }[] {
  const w = Math.max(640, Math.floor(width));
  const h = Math.max(240, Math.floor(height));
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

  const family = '"Syne", "Manrope", system-ui, sans-serif';
  let font = Math.min(w * 0.2, h * 0.48, 180);
  const layout = (size: number) => {
    ctx.font = `800 ${size}px ${family}`;
    const words = text.split(" ");
    if (ctx.measureText(text).width <= w * 0.9 || words.length < 3) return [text];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  };

  let lines = layout(font);
  while (font > 40) {
    ctx.font = `800 ${font}px ${family}`;
    if (!lines.some((ln) => ctx.measureText(ln).width > w * 0.92)) break;
    font -= 2;
    lines = layout(font);
  }
  ctx.font = `800 ${font}px ${family}`;
  ctx.lineWidth = Math.max(14, font * 0.18);
  const lh = font * 1.02;
  const top = h / 2 - ((lines.length - 1) * lh) / 2;
  lines.forEach((ln, i) => {
    const yy = top + i * lh;
    ctx.strokeText(ln, w / 2, yy);
    ctx.fillText(ln, w / 2, yy);
  });

  const data = ctx.getImageData(0, 0, w, h).data;
  const pts: { x: number; y: number }[] = [];
  const step = 2;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if ((data[(y * w + x) * 4 + 3] ?? 0) < 28) continue;
      pts.push({
        x: (x / w - 0.5) * width * 0.94,
        y: -(y / h - 0.5) * height * 0.78,
      });
    }
  }
  return pts;
}

function palette(dark: boolean): [number, number, number][] {
  if (dark) {
    return [
      [0.97, 0.93, 0.84],
      [0.93, 0.82, 0.58],
      [0.86, 0.55, 0.28],
      [0.55, 0.78, 0.62],
      [0.98, 0.97, 0.93],
    ];
  }
  return [
    [0.1, 0.09, 0.07],
    [0.18, 0.15, 0.12],
    [0.55, 0.28, 0.1],
    [0.32, 0.4, 0.16],
    [0.08, 0.08, 0.07],
  ];
}

function paintColors(n: number, dark: boolean): Float32Array {
  const pal = palette(dark);
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const c = pal[i % 11 === 0 ? 2 : i % 17 === 0 ? 3 : i % 5 === 0 ? 1 : 0]!;
    col[i * 3] = c[0]!;
    col[i * 3 + 1] = c[1]!;
    col[i * 3 + 2] = c[2]!;
  }
  return col;
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

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
    camera.position.z = 6;

    const uniforms = { uSize: { value: 3.1 }, uDpr: { value: 1 } };
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      uniforms,
      vertexShader: `
        attribute float aSize;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform float uSize;
        uniform float uDpr;
        void main() {
          vColor = aColor;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = max(1.4, aSize * uSize * uDpr);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.48) discard;
          float a = smoothstep(0.48, 0.18, d);
          gl_FragColor = vec4(vColor, a);
        }
      `,
    });

    let geometry = new THREE.BufferGeometry();
    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);

    let dots: Dot[] = [];
    let w = 1;
    let h = 1;
    let phraseI = 0;
    const mouse = { x: 0, y: 0, on: false };
    const timers: number[] = [];
    let raf = 0;
    let last = performance.now();

    const upload = () => {
      const n = dots.length;
      const pos = new Float32Array(n * 3);
      const sizes = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const d = dots[i]!;
        pos[i * 3] = d.x;
        pos[i * 3 + 1] = d.y;
        sizes[i] = d.glyph ? 1 : 0.62;
      }
      geometry.dispose();
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      const dark = document.documentElement.dataset.theme !== "light";
      geometry.setAttribute("aColor", new THREE.BufferAttribute(paintColors(n, dark), 3));
      mesh.geometry = geometry;
    };

    const retarget = (glyph: { x: number; y: number }[]) => {
      glyph.sort((a, b) => a.x - b.x || a.y - b.y);
      const need = glyph.length;
      while (dots.length < need) {
        dots.push({
          x: (Math.random() - 0.5) * w,
          y: (Math.random() - 0.5) * h,
          vx: 0,
          vy: 0,
          tx: 0,
          ty: 0,
          glyph: true,
        });
      }
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]!;
        if (i < need) {
          const g = glyph[i]!;
          d.tx = g.x;
          d.ty = g.y;
          d.glyph = true;
        } else {
          d.glyph = false;
          d.tx = (Math.random() - 0.5) * w * 0.96;
          d.ty = (Math.random() - 0.5) * h * 0.92;
        }
      }
      upload();
    };

    const show = (index: number) => {
      retarget(samplePhrase(PHRASES[index] ?? "", w, h));
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
      uniforms.uSize.value = Math.max(2.6, Math.min(3.6, w / 420));
      show(phraseI);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const cycle = () => {
      if (reduced) return;
      timers.push(
        window.setTimeout(() => {
          phraseI = (phraseI + 1) % PHRASES.length;
          show(phraseI);
          cycle();
        }, 4800),
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

    const tick = (now: number) => {
      const dt = Math.min(32, now - last) / 16.6;
      last = now;
      const attr = geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
      if (!attr) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const arr = attr.array as Float32Array;
      const R = 72;
      const R2 = R * R;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]!;
        d.vx += (d.tx - d.x) * 0.09 * dt;
        d.vy += (d.ty - d.y) * 0.09 * dt;
        if (mouse.on && !reduced) {
          const dx = d.x - mouse.x;
          const dy = d.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 0.4) {
            const dist = Math.sqrt(d2);
            const f = (1 - dist / R) ** 2 * 1.8;
            d.vx += (dx / dist) * f * dt;
            d.vy += (dy / dist) * f * dt;
          }
        }
        d.vx *= 0.82;
        d.vy *= 0.82;
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
