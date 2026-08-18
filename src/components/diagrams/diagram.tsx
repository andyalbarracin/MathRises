import type { DiagramSpec } from "@/domain/exercises";

const FIG = "var(--accent)";
const SOFT = "var(--accent-soft)";
const INK = "var(--ink)";
const MUTED = "var(--ink-muted)";

function Label({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="700" fill={INK}>
      {children}
    </text>
  );
}

/** Renderiza un diagrama geométrico a partir de su especificación. */
export function Diagram({ spec }: { spec: DiagramSpec }) {
  const common = { className: "mx-auto h-44 w-auto max-w-full", fill: "none" as const };

  switch (spec.kind) {
    case "right-triangle": {
      const max = Math.max(spec.legA, spec.legB);
      const W = (130 * spec.legA) / max;
      const H = (130 * spec.legB) / max;
      const ox = 55;
      const oy = 165;
      const len = Math.sqrt(W * W + H * H);
      const p2x = ox + W - (22 * W) / len;
      const p2y = oy - (22 * H) / len;
      return (
        <svg viewBox="0 0 250 195" {...common}>
          <polygon points={`${ox},${oy} ${ox + W},${oy} ${ox},${oy - H}`} fill={SOFT} stroke={FIG} strokeWidth="2.5" strokeLinejoin="round" />
          {/* marca de ángulo recto */}
          <path d={`M ${ox + 12} ${oy} L ${ox + 12} ${oy - 12} L ${ox} ${oy - 12}`} fill="none" stroke={MUTED} strokeWidth="1.6" />
          {/* ángulo θ marcado en el vértice inferior derecho */}
          {spec.markAngle && (
            <>
              <path d={`M ${ox + W - 22} ${oy} A 22 22 0 0 1 ${p2x} ${p2y}`} fill="none" stroke={MUTED} strokeWidth="1.6" />
              <text x={ox + W - 30} y={oy - 12} textAnchor="middle" fontSize="14" fontWeight="700" fill={INK}>θ</text>
            </>
          )}
          <Label x={ox + W / 2} y={oy + 18}>{spec.labelA}</Label>
          <Label x={ox - 18} y={oy - H / 2}>{spec.labelB}</Label>
          <Label x={ox + W / 2 + 14} y={oy - H / 2 - 6}>{spec.labelC}</Label>
        </svg>
      );
    }
    case "triangle-angles": {
      const A: [number, number] = [125, 30];
      const B: [number, number] = [45, 155];
      const C: [number, number] = [205, 155];
      return (
        <svg viewBox="0 0 250 185" {...common}>
          <polygon points={`${A[0]},${A[1]} ${B[0]},${B[1]} ${C[0]},${C[1]}`} fill={SOFT} stroke={FIG} strokeWidth="2.5" strokeLinejoin="round" />
          <Label x={125} y={62}>{spec.a}</Label>
          <Label x={72} y={140}>{spec.b}</Label>
          <Label x={178} y={140}>{spec.c}</Label>
        </svg>
      );
    }
    case "rectangle": {
      const max = Math.max(spec.w, spec.h);
      const W = (170 * spec.w) / max;
      const H = (110 * spec.h) / max;
      const ox = (250 - W) / 2;
      const oy = 25;
      return (
        <svg viewBox="0 0 250 175" {...common}>
          <rect x={ox} y={oy} width={W} height={H} rx="4" fill={SOFT} stroke={FIG} strokeWidth="2.5" />
          <Label x={ox + W / 2} y={oy + H + 22}>{spec.labelW}</Label>
          <Label x={ox - 20} y={oy + H / 2}>{spec.labelH}</Label>
        </svg>
      );
    }
    case "circle": {
      return (
        <svg viewBox="0 0 200 200" {...common}>
          <circle cx="100" cy="100" r="72" fill={SOFT} stroke={FIG} strokeWidth="2.5" />
          <line x1="100" y1="100" x2="172" y2="100" stroke={FIG} strokeWidth="2" />
          <circle cx="100" cy="100" r="3" fill={FIG} />
          <Label x={136} y={90}>{spec.labelR}</Label>
        </svg>
      );
    }
    case "coord-point": {
      const u = 15;
      const cx = 100;
      const cy = 100;
      const px = cx + spec.x * u;
      const py = cy - spec.y * u;
      const ticks = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
      return (
        <svg viewBox="0 0 200 200" {...common}>
          {/* grilla */}
          <g stroke="var(--border)" strokeWidth="1">
            {ticks.map((t) => (
              <line key={`v${t}`} x1={cx + t * u} y1="14" x2={cx + t * u} y2="186" />
            ))}
            {ticks.map((t) => (
              <line key={`h${t}`} x1="14" y1={cy + t * u} x2="186" y2={cy + t * u} />
            ))}
          </g>
          {/* ejes */}
          <line x1="10" y1={cy} x2="190" y2={cy} stroke={MUTED} strokeWidth="2" />
          <line x1={cx} y1="10" x2={cx} y2="190" stroke={MUTED} strokeWidth="2" />
          {/* punto */}
          <line x1={px} y1={py} x2={px} y2={cy} stroke={FIG} strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1={px} y1={py} x2={cx} y2={py} stroke={FIG} strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx={px} cy={py} r="5" fill={FIG} />
          <text x={px + (spec.x >= 0 ? 9 : -9)} y={py - 9} textAnchor={spec.x >= 0 ? "start" : "end"} fontSize="13" fontWeight="700" fill={INK}>
            {spec.label ?? "P"}
          </text>
        </svg>
      );
    }
    case "similar-triangles": {
      return (
        <svg viewBox="0 0 270 165" {...common}>
          {/* chico */}
          <polygon points="25,120 80,120 25,80" fill={SOFT} stroke={FIG} strokeWidth="2.2" strokeLinejoin="round" />
          <Label x={52} y={136}>{spec.small[0]}</Label>
          <Label x={12} y={100}>{spec.small[1]}</Label>
          {/* grande */}
          <polygon points="130,140 250,140 130,50" fill={SOFT} stroke={FIG} strokeWidth="2.5" strokeLinejoin="round" />
          <Label x={190} y={156}>{spec.large[0]}</Label>
          <Label x={116} y={95}>{spec.large[1]}</Label>
        </svg>
      );
    }
  }
}
