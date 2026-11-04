"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

// Motor positions in the 300x300 quad drawing (top-down view).
const MOTORS = [
  [70, 70],
  [230, 70],
  [70, 230],
  [230, 230],
] as const;

const KEY_STEPS: Record<string, number> = {
  ArrowUp: 5,
  ArrowRight: 5,
  ArrowDown: -5,
  ArrowLeft: -5,
  PageUp: 20,
  PageDown: -20,
};

function statusFor(t: number) {
  if (t < 2) return "ENGINES OFF";
  if (t < 30) return "SPOOLING UP";
  if (t < 55) return "READY TO LIFT";
  if (t < 95) return "CLIMBING";
  return "CLEARED FOR TAKEOFF";
}

export default function ThrottleHero() {
  const [thr, setThr] = useState(0);
  const thrRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const propRefs = useRef<Array<SVGGElement | null>>([]);
  const discRefs = useRef<Array<SVGCircleElement | null>>([]);
  const craftRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    thrRef.current = thr;
  }, [thr]);

  // Animation loop: spins props, lifts the quad, updates altitude readout.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let angle = 0;
    let alt = 0;
    let t = 0;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      const v = thrRef.current / 100;

      const rps = v < 0.02 ? 0 : 3 + v * 25;
      if (!reduce) angle = (angle + rps * 360 * dt) % 360;
      propRefs.current.forEach((g, i) => {
        if (!g) return;
        const dir = i === 0 || i === 3 ? 1 : -1;
        g.setAttribute("transform", `rotate(${angle * dir})`);
        g.style.opacity = String(1 - v * 0.75);
      });
      discRefs.current.forEach((c) => {
        if (c) c.style.opacity = String(v * 0.55);
      });

      const target = v > 0.55 ? (v - 0.55) / 0.45 : 0;
      alt += (target - alt) * Math.min(1, dt * 2.2);
      const bob = reduce ? 0 : Math.sin(t * 2.4) * 4 * alt;
      const jitter = !reduce && v > 0.08 && alt < 0.05 ? (Math.random() - 0.5) * v * 2 : 0;

      if (craftRef.current) {
        craftRef.current.style.transform = `translate(${jitter}px, ${-alt * 34 + bob}px) scale(${1 + alt * 0.35})`;
      }
      if (shadowRef.current) {
        shadowRef.current.style.transform = `translate(calc(-50% + ${alt * 38}px), calc(-50% + ${alt * 52}px)) scale(${1 - alt * 0.45})`;
        shadowRef.current.style.opacity = String(0.5 - alt * 0.3);
      }
      if (altRef.current) altRef.current.textContent = (alt * 42).toFixed(1).padStart(4, "0");

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const setFromY = useCallback((clientY: number) => {
    const r = trackRef.current?.getBoundingClientRect();
    if (!r) return;
    setThr(Math.round(clamp(((r.bottom - clientY) / r.height) * 100, 0, 100)));
  }, []);

  const status = statusFor(thr);
  const cleared = thr >= 95;

  return (
    <div className="rounded-2xl border-4 border-ink bg-cockpit p-3 text-cloud shadow-[8px_8px_0_0_var(--color-ink)] sm:p-4">
      {/* HUD bar */}
      <div className="mb-3 grid grid-cols-3 gap-2 font-mono text-[11px] sm:text-xs">
        <Readout label="THR" value={`${String(thr).padStart(3, "0")}%`} />
        <Readout label="RPM" value={String(thr * 240).padStart(5, "0")} />
        <div className="rounded-md bg-panel px-2 py-1.5">
          <div className="text-cloud/50">ALT</div>
          <div className="text-hud">
            <span ref={altRef}>00.0</span>m
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {/* Throttle lever */}
        <div className="flex w-16 shrink-0 flex-col items-center sm:w-20">
          <div
            ref={trackRef}
            className="relative h-[280px] w-full cursor-grab touch-none select-none active:cursor-grabbing sm:h-[320px]"
            onPointerDown={(e) => {
              dragging.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              setFromY(e.clientY);
            }}
            onPointerMove={(e) => {
              if (dragging.current) setFromY(e.clientY);
            }}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            {/* groove */}
            <div className="absolute inset-y-2 left-1/2 w-3 -translate-x-1/2 rounded-full bg-black/70">
              <div
                className="absolute inset-x-0 bottom-0 rounded-full bg-hud/80"
                style={{ height: `${thr}%` }}
              />
            </div>
            {/* ticks */}
            {[0, 25, 50, 75, 100].map((tick) => (
              <div
                key={tick}
                className="absolute right-0 h-px w-2 bg-cloud/40"
                style={{ bottom: `calc(${tick / 100} * (100% - 16px) + 8px)` }}
              />
            ))}
            {/* handle */}
            <div
              role="slider"
              tabIndex={0}
              aria-label="Throttle"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={thr}
              aria-valuetext={`${thr}% throttle, ${status.toLowerCase()}`}
              onKeyDown={(e) => {
                if (e.key === "Home") setThr(0);
                else if (e.key === "End") setThr(100);
                else if (KEY_STEPS[e.key] !== undefined) {
                  const step = KEY_STEPS[e.key];
                  setThr((v) => clamp(v + step, 0, 100));
                } else return;
                e.preventDefault();
              }}
              className="absolute left-1/2 flex h-10 w-full -translate-x-1/2 flex-col items-center justify-center gap-1 rounded-md border-2 border-ink bg-burn shadow-[0_4px_0_0_#7a2200] outline-none focus-visible:ring-4 focus-visible:ring-hazard"
              style={{ bottom: `calc(${thr / 100} * (100% - 40px))` }}
            >
              <span className="h-0.5 w-8 rounded bg-ink/50" />
              <span className="h-0.5 w-8 rounded bg-ink/50" />
              <span className="h-0.5 w-8 rounded bg-ink/50" />
            </div>
            {thr === 0 && (
              <div className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 animate-bounce whitespace-nowrap font-mono text-[10px] text-hazard">
                PUSH ↑
              </div>
            )}
          </div>
          <div className="mt-2 font-mono text-[10px] tracking-widest text-cloud/60">THROTTLE</div>
        </div>

        {/* Camera view of the landing pad */}
        <div className="pad-view relative min-h-[300px] flex-1 overflow-hidden rounded-xl border-2 border-black/60 sm:min-h-[340px]">
          <div className="absolute left-2 top-2 font-mono text-[10px] text-cloud/60">CAM 01 · TOP</div>
          <div className="absolute right-2 top-2 flex items-center gap-1 font-mono text-[10px] text-burn">
            <span className="size-1.5 animate-pulse rounded-full bg-burn" /> REC
          </div>

          {/* pad */}
          <div className="absolute left-1/2 top-1/2 size-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[10px] border-dashed border-hazard/80 sm:size-[230px]">
            <div className="absolute inset-3 rounded-full border-2 border-cloud/20" />
            <span className="absolute inset-0 flex items-center justify-center font-display text-7xl text-cloud/15">
              T
            </span>
          </div>

          {/* shadow */}
          <div
            ref={shadowRef}
            className="absolute left-1/2 top-1/2 size-[150px] rounded-full bg-black blur-md sm:size-[170px]"
            style={{ transform: "translate(-50%, -50%)", opacity: 0.5 }}
          />

          {/* quad */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div ref={craftRef} className="will-change-transform">
              <svg viewBox="0 0 300 300" className="size-[190px] sm:size-[220px]" aria-hidden="true">
                {/* arms */}
                <g stroke="#3a414d" strokeWidth="16" strokeLinecap="round">
                  <line x1="70" y1="70" x2="230" y2="230" />
                  <line x1="230" y1="70" x2="70" y2="230" />
                </g>
                {MOTORS.map(([x, y], i) => (
                  <g key={i} transform={`translate(${x} ${y})`}>
                    <circle
                      ref={(el) => {
                        discRefs.current[i] = el;
                      }}
                      r="56"
                      fill="#dfe7f2"
                      style={{ opacity: 0 }}
                    />
                    <circle r="17" fill="#ff5a1f" stroke="#0b1b33" strokeWidth="3" />
                    <g
                      ref={(el) => {
                        propRefs.current[i] = el;
                      }}
                    >
                      <rect x="-54" y="-5" width="108" height="10" rx="5" fill="#dfe7f2" />
                    </g>
                    <circle r="5" fill="#0b1b33" />
                  </g>
                ))}
                {/* body */}
                <rect x="112" y="100" width="76" height="100" rx="18" fill="#0b1b33" />
                <rect x="124" y="112" width="52" height="14" rx="4" fill="#ffc928" />
                <circle cx="150" cy="168" r="10" fill="#4dffa0" opacity="0.9" />
              </svg>
            </div>
          </div>

          {/* status */}
          <div
            className={`absolute inset-x-2 bottom-2 rounded-md px-2 py-1.5 text-center font-mono text-xs tracking-widest ${
              cleared ? "animate-pulse bg-hud text-ink" : "bg-black/60 text-hazard"
            }`}
            aria-live="polite"
          >
            {status}
          </div>
        </div>
      </div>

      <a
        href="#waitlist"
        className={`mt-3 block rounded-md border-2 border-ink py-2 text-center font-display text-sm transition ${
          cleared ? "bg-hud text-ink" : "pointer-events-none bg-panel text-cloud/30"
        }`}
        aria-hidden={!cleared}
        tabIndex={cleared ? 0 : -1}
      >
        {cleared ? "Cleared. Now build yours →" : "Throttle up to take off"}
      </a>
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-panel px-2 py-1.5">
      <div className="text-cloud/50">{label}</div>
      <div className="text-hud">{value}</div>
    </div>
  );
}
