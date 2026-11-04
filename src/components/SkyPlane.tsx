"use client";

import { useEffect, useRef } from "react";

const BANNER_TEXT = "BUILD IT · FLY IT";

/**
 * Red biplane towing a banner across the sky on a swooping sine path.
 * The banner follows the plane's trail, so it bends with every curve.
 */
export default function SkyPlane() {
  const svgRef = useRef<SVGSVGElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const bannerRef = useRef<SVGPathElement>(null);
  const centerRef = useRef<SVGPathElement>(null);
  const ropeRef = useRef<SVGPathElement>(null);
  const poleRef = useRef<SVGLineElement>(null);
  const textRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let t = 0;
    let x = Number.NaN;

    const tick = (now: number) => {
      const W = svg.clientWidth;
      const H = svg.clientHeight;
      const small = W < 640;
      const scale = small ? 0.55 : 0.85;
      const A = small ? 26 : 46; // swoop height
      const lambda = Math.max(small ? 360 : 560, W * 0.6); // swoop length
      const baseY = H * (small ? 0.13 : 0.15);
      const tail = 80 * scale;
      const rope = 60 * scale;
      const bannerLen = small ? 170 : 270;
      const bannerH = small ? 30 : 44;
      const tow = tail + rope + bannerLen;
      const X0 = -140;
      const X1 = W + 140 + tow;
      const speed = Math.max(90, W / 11);

      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      if (Number.isNaN(x)) x = reduce ? W * 0.62 : X0 + (X1 - X0) * 0.35;
      if (!reduce) {
        x += speed * dt;
        if (x > X1) x = X0;
      }

      const k = (2 * Math.PI) / lambda;
      const yAt = (px: number) => baseY + A * Math.sin(k * px);
      const ang = Math.atan(A * k * Math.cos(k * x));
      const py = yAt(x);

      planeRef.current?.setAttribute(
        "transform",
        `translate(${x} ${py}) rotate(${(ang * 180) / Math.PI}) scale(${scale})`,
      );

      // Tail hook in world space
      const hx = x - Math.cos(ang) * tail;
      const hy = py - Math.sin(ang) * tail;

      // Banner centreline, front (near plane) → back
      const N = 20;
      const front = x - tail - rope;
      const pts: [number, number][] = [];
      for (let i = 0; i <= N; i++) {
        const bx = front - (bannerLen * i) / N;
        const flutter = reduce ? 0 : Math.sin(i * 0.7 - t * 9) * 3 * (i / N);
        pts.push([bx, yAt(bx) + flutter]);
      }
      const top: [number, number][] = [];
      const bot: [number, number][] = [];
      pts.forEach((p, i) => {
        const a = pts[Math.max(0, i - 1)];
        const b = pts[Math.min(N, i + 1)];
        const tx = b[0] - a[0];
        const ty = b[1] - a[1];
        const len = Math.hypot(tx, ty) || 1;
        const nx = -ty / len;
        const ny = tx / len;
        const h = bannerH / 2;
        top.push([p[0] + nx * h, p[1] + ny * h]);
        bot.push([p[0] - nx * h, p[1] - ny * h]);
      });

      const f = (p: [number, number]) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
      bannerRef.current?.setAttribute(
        "d",
        `M${top.map(f).join(" L")} L${[...bot].reverse().map(f).join(" L")} Z`,
      );
      centerRef.current?.setAttribute("d", `M${[...pts].reverse().map(f).join(" L")}`);
      ropeRef.current?.setAttribute("d", `M${hx} ${hy} L${f(top[0])} M${hx} ${hy} L${f(bot[0])}`);
      const pole = poleRef.current;
      if (pole) {
        pole.setAttribute("x1", String(top[0][0]));
        pole.setAttribute("y1", String(top[0][1]));
        pole.setAttribute("x2", String(bot[0][0]));
        pole.setAttribute("y2", String(bot[0][1]));
      }
      textRef.current?.setAttribute("font-size", String(bannerH * 0.5));

      if (!reduce) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hc-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff6b7d" />
          <stop offset="0.45" stopColor="#ec3750" />
          <stop offset="1" stopColor="#a81f35" />
        </linearGradient>
        <linearGradient id="hc-wing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff5c70" />
          <stop offset="1" stopColor="#c42a3f" />
        </linearGradient>
        <linearGradient id="banner-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e4f2fb" />
        </linearGradient>
      </defs>

      {/* tow ropes + banner */}
      <path ref={ropeRef} stroke="#ffffff" strokeWidth="1.5" opacity="0.9" fill="none" />
      <path ref={bannerRef} fill="url(#banner-shade)" stroke="#338eda" strokeWidth="2" strokeLinejoin="round" />
      <line ref={poleRef} stroke="#8492a6" strokeWidth="3" strokeLinecap="round" />
      <path ref={centerRef} id="throttle-banner-path" fill="none" />
      <text
        ref={textRef}
        fill="#ec3750"
        dominantBaseline="central"
        fontWeight="bold"
        style={{ fontFamily: "'Phantom Sans', sans-serif" }}
      >
        <textPath href="#throttle-banner-path" startOffset="50%" textAnchor="middle">
          {BANNER_TEXT}
        </textPath>
      </text>

      {/* biplane: drawn facing right, origin at its centre */}
      <g ref={planeRef} transform="translate(-400 -400)">
        {/* tail */}
        <path d="M-78 2 C-78 -3 -60 -5 -42 -3 L-42 6 C-60 8 -78 7 -78 2 Z" fill="#c42a3f" />
        <path d="M-66 -2 C-72 -22 -64 -36 -50 -36 C-42 -36 -39 -30 -40 -22 L-36 -2 Z" fill="url(#hc-wing)" />
        <circle cx="-64" cy="10" r="2.5" fill="#17171d" />
        <line x1="-62" y1="4" x2="-64" y2="9" stroke="#17171d" strokeWidth="2" />

        {/* top wing */}
        <path
          d="M-26 -44 C-10 -51 50 -51 66 -44 C70 -42 68 -36 62 -35 L-28 -35 C-34 -36 -32 -42 -26 -44 Z"
          fill="url(#hc-wing)"
        />
        <path d="M-22 -45 C-6 -49 48 -49 62 -45" stroke="#ff8f9d" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* struts */}
        <g stroke="#17171d" strokeWidth="2.5" strokeLinecap="round">
          <line x1="-14" y1="-36" x2="-8" y2="11" />
          <line x1="46" y1="-36" x2="52" y2="11" />
          <line x1="12" y1="-36" x2="16" y2="-14" />
          <line x1="26" y1="-36" x2="30" y2="-14" />
        </g>
        <g stroke="#17171d" strokeWidth="0.8" opacity="0.5">
          <line x1="-14" y1="-36" x2="52" y2="11" />
          <line x1="46" y1="-36" x2="-8" y2="11" />
        </g>

        {/* fuselage */}
        <path
          d="M-72 0 C-56 -9 -20 -17 20 -18 L62 -18 C72 -18 76 -10 76 0 C76 10 72 16 62 16 L20 16 C-20 15 -56 8 -72 0 Z"
          fill="url(#hc-body)"
        />
        <path d="M-56 -5 C-30 -13 10 -15 66 -14" stroke="#ffffff" strokeWidth="2.5" opacity="0.35" fill="none" strokeLinecap="round" />

        {/* cockpit + pilot */}
        <ellipse cx="6" cy="-17" rx="11" ry="3.5" fill="#17171d" />
        <circle cx="4" cy="-23" r="5.5" fill="#5c3a25" />
        <rect x="5" y="-26" width="7" height="3.5" rx="1.7" fill="#5bc0de" />
        <path d="M16 -18 L20 -27 L24 -18 Z" fill="#bfe9f7" opacity="0.8" />

        {/* engine cowling */}
        <path d="M62 -18 L80 -15 C86 -14 89 -8 89 0 C89 8 86 14 80 15 L62 16 Z" fill="url(#hc-body)" />
        <path d="M66 -17 L66 16" stroke="#a81f35" strokeWidth="1.5" />
        <ellipse cx="88" cy="0" rx="3" ry="13" fill="#17171d" />

        {/* lower wing */}
        <path d="M-14 10 L58 10 C64 10 66 16 60 19 L-18 19 C-24 18 -22 11 -14 10 Z" fill="url(#hc-wing)" />

        {/* landing gear */}
        <g stroke="#17171d" strokeWidth="2.5" strokeLinecap="round">
          <line x1="20" y1="17" x2="28" y2="34" />
          <line x1="40" y1="17" x2="31" y2="34" />
        </g>
        <circle cx="30" cy="36" r="8" fill="#17171d" />
        <circle cx="30" cy="36" r="3" fill="#8492a6" />

        {/* propeller */}
        <ellipse className="plane-prop" cx="93" cy="0" rx="4" ry="32" fill="#ffffff" opacity="0.45" />
        <circle cx="92" cy="0" r="4" fill="#8492a6" />
      </g>
    </svg>
  );
}
