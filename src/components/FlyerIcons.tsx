import type { ReactNode } from "react";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className="size-12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const flyers: { name: string; note: string; icon: ReactNode }[] = [
  {
    name: "Drones",
    note: "Quads, hexes, FPV, VTOL",
    icon: (
      <Icon>
        <path d="M14 14 34 34M34 14 14 34" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="36" cy="12" r="6" />
        <circle cx="12" cy="36" r="6" />
        <circle cx="36" cy="36" r="6" />
        <rect x="20" y="19" width="8" height="10" rx="2" fill="currentColor" />
      </Icon>
    ),
  },
  {
    name: "RC planes",
    note: "Foamies, warbirds, flying wings",
    icon: (
      <Icon>
        <path d="M24 6v34M6 22l18-4 18 4M17 39h14" />
        <path d="M20 5h8" />
      </Icon>
    ),
  },
  {
    name: "Gliders",
    note: "Hand-launch, slope, sailplanes",
    icon: (
      <Icon>
        <path d="M24 10v30M2 19l22-2 22 2M19 39h10" />
      </Icon>
    ),
  },
  {
    name: "Helicopters",
    note: "Coaxial, single rotor, autogyros",
    icon: (
      <Icon>
        <path d="M6 10h36M24 10v6" />
        <ellipse cx="20" cy="24" rx="11" ry="8" />
        <path d="M31 22h12l2-4M12 36h18M16 32v4M26 32v4" />
      </Icon>
    ),
  },
  {
    name: "Rockets",
    note: "Low-power, certified motors",
    icon: (
      <Icon>
        <path d="M24 4c6 6 7 16 6 28H18c-1-12 0-22 6-28Z" />
        <circle cx="24" cy="18" r="3" />
        <path d="M18 26l-5 8h5M30 26l5 8h-5M21 36l3 7 3-7" />
      </Icon>
    ),
  },
  {
    name: "Blimps",
    note: "Indoor airships, balloons",
    icon: (
      <Icon>
        <ellipse cx="22" cy="20" rx="17" ry="9" />
        <path d="M39 20l6-6v12zM18 29v4h8v-4" />
      </Icon>
    ),
  },
  {
    name: "Ornithopters",
    note: "Flapping-wing flyers",
    icon: (
      <Icon>
        <path d="M3 20c8-8 15-6 21 4 6-10 13-12 21-4" />
        <path d="M24 24v14M20 38h8" />
      </Icon>
    ),
  },
  {
    name: "Something new",
    note: "If it leaves the ground, it counts",
    icon: (
      <Icon>
        <path d="M18 18a6 6 0 1 1 9 5c-2 1-3 2-3 5" />
        <circle cx="24" cy="35" r="1.5" fill="currentColor" />
        <circle cx="24" cy="24" r="20" strokeDasharray="4 5" />
      </Icon>
    ),
  },
];
