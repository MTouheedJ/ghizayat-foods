/**
 * A masala dabba — the round steel spice tin found in every Pakistani kitchen.
 *
 * Pure inline SVG: no WebGL, no model files, no image requests, nothing to
 * lazy-load. It renders identically on the server, so it costs nothing in JS
 * and can never shift layout or delay LCP.
 */

type Bowl = {
  name: string;
  urdu: string;
  /** Bright centre and darker edge, so each mound reads as loose powder. */
  light: string;
  dark: string;
};

const CENTRE: Bowl = {
  name: "Red chilli",
  urdu: "سرخ مرچ",
  light: "#e6414f",
  dark: "#8a142c",
};

const RING: Bowl[] = [
  { name: "Turmeric", urdu: "ہلدی", light: "#fbbf24", dark: "#c2740a" },
  { name: "Cumin", urdu: "زیرہ", light: "#b98a58", dark: "#71512f" },
  { name: "Coriander", urdu: "دھنیا", light: "#a9ad6a", dark: "#6b6f38" },
  { name: "Garam masala", urdu: "گرم مصالحہ", light: "#8a5a41", dark: "#4a2b1e" },
  { name: "Nigella", urdu: "کلونجی", light: "#4a443f", dark: "#1c1917" },
  { name: "Fennel", urdu: "سونف", light: "#c3c98a", dark: "#7d8347" },
];

const R_RING = 105;
const R_BOWL = 52;

const positions = RING.map((bowl, index) => {
  const angle = ((-90 + index * 60) * Math.PI) / 180;
  return {
    ...bowl,
    x: 200 + R_RING * Math.cos(angle),
    y: 200 + R_RING * Math.sin(angle),
  };
});

/**
 * Note: no per-bowl <title> element.
 *
 * React 19 treats <title> as a hoistable document tag wherever it appears —
 * including inside SVG — so nesting one here logs an error and risks competing
 * with the real page title. The parent <svg> carries a single aria-label
 * naming every spice, which is the correct accessible pattern anyway.
 */
function SpiceBowl({
  x,
  y,
  id,
}: {
  x: number;
  y: number;
  id: string;
}) {
  return (
    <g>
      {/* Steel well */}
      <circle cx={x} cy={y} r={R_BOWL} fill="#3d3630" />
      <circle
        cx={x}
        cy={y}
        r={R_BOWL}
        fill="none"
        stroke="#6b6158"
        strokeWidth="1.5"
      />
      {/* Powder */}
      <circle cx={x} cy={y} r={R_BOWL - 7} fill={`url(#${id})`} />
      {/* Light catching the top of the mound */}
      <ellipse
        cx={x}
        cy={y - 14}
        rx={R_BOWL - 20}
        ry={12}
        fill="#ffffff"
        opacity="0.09"
      />
    </g>
  );
}

export default function SpiceTin({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="A masala dabba holding red chilli, turmeric, cumin, coriander, garam masala, nigella and fennel"
    >
      <defs>
        <radialGradient id="tin-body" cx="35%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#6d6259" />
          <stop offset="55%" stopColor="#413a34" />
          <stop offset="100%" stopColor="#211c19" />
        </radialGradient>

        <radialGradient id="spice-centre" cx="42%" cy="34%" r="72%">
          <stop offset="0%" stopColor={CENTRE.light} />
          <stop offset="100%" stopColor={CENTRE.dark} />
        </radialGradient>

        {positions.map((bowl, index) => (
          <radialGradient
            key={bowl.name}
            id={`spice-${index}`}
            cx="42%"
            cy="34%"
            r="72%"
          >
            <stop offset="0%" stopColor={bowl.light} />
            <stop offset="100%" stopColor={bowl.dark} />
          </radialGradient>
        ))}
      </defs>

      {/* Decorative orbit rings — static, purely for depth */}
      <circle
        cx="200"
        cy="200"
        r="196"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="1"
        strokeDasharray="3 9"
        opacity="0.35"
      />

      {/* Tin */}
      <circle cx="200" cy="200" r="186" fill="url(#tin-body)" />
      <circle
        cx="200"
        cy="200"
        r="186"
        fill="none"
        stroke="#8d8177"
        strokeWidth="3"
      />
      <circle
        cx="200"
        cy="200"
        r="172"
        fill="#241f1b"
        stroke="#574e46"
        strokeWidth="1.5"
      />

      {positions.map((bowl, index) => (
        <SpiceBowl
          key={bowl.name}
          x={bowl.x}
          y={bowl.y}
          id={`spice-${index}`}
        />
      ))}

      <SpiceBowl x={200} y={200} id="spice-centre" />
    </svg>
  );
}
