                                                        /** Vintage barnstormer biplane in Hack Club colours, facing right. */
export default function Plane() {
  return (
    <svg viewBox="0 0 240 120" className="w-full overflow-visible drop-shadow-[0_8px_8px_rgba(23,23,29,0.2)]">
      {/* smoke trail */}
      <g fill="#fff" opacity="0.75">
        <circle cx="10" cy="62" r="5" />
        <circle cx="-14" cy="60" r="7" />
        <circle cx="-42" cy="63" r="9" />
        <circle cx="-76" cy="59" r="10" opacity="0.7" />
        <circle cx="-114" cy="62" r="11" opacity="0.45" />
      </g>

      {/* top wing (far half, behind struts) */}
      <rect x="98" y="20" width="84" height="10" rx="5" fill="#d9ae0d" />

      {/* struts + rigging wires */}
      <g stroke="#17171d" strokeWidth="2.5" strokeLinecap="round">
        <line x1="112" y1="28" x2="116" y2="74" />
        <line x1="162" y1="28" x2="166" y2="74" />
        <line x1="140" y1="28" x2="146" y2="50" />
        <line x1="152" y1="28" x2="156" y2="50" />
      </g>
      <g stroke="#17171d" strokeWidth="0.8" opacity="0.6">
        <line x1="112" y1="28" x2="166" y2="74" />
        <line x1="162" y1="28" x2="116" y2="74" />
      </g>

      {/* tail: stabiliser + rudder */}
      <path d="M14 60 C14 56 30 55 48 57 L48 63 C30 65 14 64 14 60 Z" fill="#d9ae0d" />
      <path d="M20 58 C14 40 18 28 30 28 C36 28 40 32 42 38 L50 58 Z" fill="#c42a3f" />
      <path d="M24 46 H44" stroke="#fff" strokeWidth="3" />

      {/* landing gear */}
      <g stroke="#17171d" strokeWidth="3" strokeLinecap="round">
        <line x1="138" y1="72" x2="150" y2="98" />
        <line x1="164" y1="72" x2="152" y2="98" />
        <line x1="34" y1="64" x2="28" y2="74" />
      </g>
      <circle cx="151" cy="100" r="10" fill="#17171d" />
      <circle cx="151" cy="100" r="4" fill="#8492a6" />

      {/* fuselage */}
      <path
        d="M22 60 C40 51 80 47 120 47 L182 47 C188 47 192 52 192 60 C192 68 188 73 182 73 L120 73 C80 73 40 69 22 60 Z"
        fill="#ec3750"
      />
      <path d="M44 61 C80 64 140 64 190 63" stroke="#f1c40f" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* roundel */}
      <circle cx="88" cy="58" r="7" fill="#fff" />
      <circle cx="88" cy="58" r="3.5" fill="#338eda" />

      {/* cockpit + pilot */}
      <path d="M118 48 C122 40 140 40 146 48 Z" fill="#17171d" />
      <circle cx="132" cy="38" r="7.5" fill="#8a5a3b" />
      <path d="M125 36 C126 30 138 30 139 36 Z" fill="#5c3a25" />
      <rect x="132" y="34" width="9" height="5" rx="2.5" fill="#5bc0de" stroke="#17171d" strokeWidth="1.5" />
      {/* scarf flapping in the wind */}
      <path className="plane-scarf" d="M127 44 C112 42 104 48 90 42 C100 50 112 50 126 47 Z" fill="#ff8c37" />
      {/* windscreen */}
      <path d="M146 47 L150 38 L154 47 Z" fill="#bfe9f7" opacity="0.85" />

      {/* bottom wing (near side, in front) */}
      <rect x="106" y="70" width="78" height="9" rx="4.5" fill="#f1c40f" />
      {/* top wing front edge */}
      <rect x="98" y="18" width="84" height="7" rx="3.5" fill="#f1c40f" />

      {/* engine cowling */}
      <path d="M186 46 H198 C202 46 204 50 204 60 C204 70 202 74 198 74 H186 Z" fill="#17171d" />
      <g stroke="#8492a6" strokeWidth="1.5">
        <line x1="190" y1="50" x2="190" y2="70" />
        <line x1="195" y1="49" x2="195" y2="71" />
      </g>

      {/* propeller */}
      <circle cx="207" cy="60" r="4" fill="#8492a6" />
      <ellipse className="plane-prop" cx="209" cy="60" rx="3.5" ry="30" fill="#5c3a25" opacity="0.7" />
    </svg>
  );
}
