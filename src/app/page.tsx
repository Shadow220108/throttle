import Waitlist from "@/components/Waitlist";
import SkyPlane from "@/components/SkyPlane";

const clouds = [
  { top: "5%", size: 180, dur: 75, delay: -10 },
  { top: "18%", size: 90, dur: 60, delay: -45 },
  { top: "66%", size: 220, dur: 95, delay: -70 },
  { top: "80%", size: 140, dur: 80, delay: -20 },
  { top: "88%", size: 110, dur: 55, delay: -30 },
];

export default function Home() {
  return (
    <main className="sky relative flex min-h-svh flex-col overflow-hidden">
      {/* Official Hack Club flag banner (hackclub.com/brand) */}
      <a href="https://hackclub.com/" className="absolute left-2.5 top-0 z-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://assets.hackclub.com/flag-orpheus-top.svg" alt="Hack Club" className="w-36 sm:w-56" />
      </a>

      {/* Clouds */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {clouds.map((c, i) => (
          <svg
            key={i}
            viewBox="0 0 120 50"
            className="cloud absolute left-0 opacity-90"
            style={{ top: c.top, width: c.size, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}
          >
            <path d="M20 45h80a15 15 0 0 0 0-30 22 22 0 0 0-40-6 16 16 0 0 0-28 8A14 14 0 0 0 20 45Z" fill="#fff" />
          </svg>
        ))}
      </div>

      {/* Plane */}
      <SkyPlane />

      {/* Centre */}
      <section className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 pb-16 pt-40 text-center sm:pt-44">
        <h1 className="text-7xl font-bold leading-[0.9] tracking-[-0.03em] text-white [text-shadow:0_4px_0_rgba(236,55,80,0.55)] sm:text-[9rem]">
          Throttle
        </h1>
        <p className="mt-5 text-2xl font-bold leading-tight text-white [text-shadow:0_2px_6px_rgba(23,23,29,0.35)] sm:text-3xl">
          Build anything that can fly. <span className="text-hc-yellow">We fund it.</span>
        </p>
        <p className="mt-2 text-base text-white/90 [text-shadow:0_1px_4px_rgba(23,23,29,0.35)] sm:text-lg">
          A Hack Club You Ship, We Ship program for teens 13–18.
        </p>

        <div id="rsvp" className="mt-10 w-full max-w-md rounded-2xl bg-white p-4 text-left shadow-xl sm:p-5">
          <p className="mb-3 text-center text-sm font-bold uppercase tracking-wider text-hc-muted">
            RSVP to hear when it opens
          </p>
          <Waitlist />
        </div>
      </section>

      <footer className="relative z-10 pb-5 text-center text-sm text-hc-dark/70">
        Questions? Ask in{" "}
        <a href="https://hackclub.com/slack" className="font-bold underline">
          #throttle
        </a>{" "}
        on the Hack Club Slack.
      </footer>
    </main>
  );
}
