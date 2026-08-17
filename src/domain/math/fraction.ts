/** Aritmética de fracciones con signo en el numerador. */
export interface Fraction {
  n: number; // numerador (lleva el signo)
  d: number; // denominador (> 0)
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/** Normaliza: denominador positivo y fracción reducida. */
export function simplify({ n, d }: Fraction): Fraction {
  if (d === 0) throw new Error("Denominador cero");
  const sign = d < 0 ? -1 : 1;
  n *= sign;
  d *= sign;
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

export function addFractions(a: Fraction, b: Fraction): Fraction {
  return simplify({ n: a.n * b.d + b.n * a.d, d: a.d * b.d });
}

/** Igualdad matemática por producto cruzado (independiente del formato). */
export function fractionsEqual(a: Fraction, b: Fraction): boolean {
  return a.n * b.d === b.n * a.d;
}

export function isReduced(f: Fraction): boolean {
  return gcd(f.n, f.d) === 1 && f.d > 0;
}

export function toDisplay(f: Fraction): string {
  if (f.d === 1) return String(f.n);
  return `${f.n}/${f.d}`;
}

export function toLatex(f: Fraction): string {
  if (f.d === 1) return String(f.n);
  const sign = f.n < 0 ? "-" : "";
  return `${sign}\\dfrac{${Math.abs(f.n)}}{${f.d}}`;
}

/**
 * Parsea la entrada del usuario a Fraction.
 * Acepta "3/4", "-3/4", "5", "2 1/2" (mixto), "0.5" (decimal simple).
 * Devuelve null si no es interpretable.
 */
export function parseFraction(raw: string): Fraction | null {
  const s = raw.trim().replace(/\s+/g, " ");
  if (s === "") return null;

  // mixto: "a b/c"
  const mixed = s.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const whole = parseInt(mixed[1], 10);
    const num = parseInt(mixed[2], 10);
    const den = parseInt(mixed[3], 10);
    if (den === 0) return null;
    const sign = whole < 0 ? -1 : 1;
    return simplify({ n: sign * (Math.abs(whole) * den + num), d: den });
  }

  // fracción "a/b"
  const frac = s.match(/^(-?\d+)\/(-?\d+)$/);
  if (frac) {
    const den = parseInt(frac[2], 10);
    if (den === 0) return null;
    return { n: parseInt(frac[1], 10), d: den };
  }

  // entero
  if (/^-?\d+$/.test(s)) return { n: parseInt(s, 10), d: 1 };

  // decimal simple → fracción
  if (/^-?\d*\.\d+$/.test(s)) {
    const neg = s.startsWith("-");
    const [, dec] = s.replace("-", "").split(".");
    const den = 10 ** dec.length;
    const num = Math.round(parseFloat(s.replace("-", "")) * den);
    return simplify({ n: (neg ? -1 : 1) * num, d: den });
  }

  return null;
}
