import { describe, it, expect } from "vitest";
import { TEMPLATES, generateExercise } from "./index";

/**
 * Verificación INDEPENDIENTE de correctitud numérica.
 * Para cada template de respuesta numérica, re-calcula la respuesta a partir del
 * enunciado (promptText) con un evaluador propio, y la compara con la que
 * declara el ejercicio. Así, si un solver tuviera un error, este test lo detecta
 * (no confía en la lógica del propio template).
 */

/** Evalúa una expresión aritmética simple respetando el orden de operaciones. */
function evalArith(raw: string): number {
  // Normaliza símbolos.
  let s = raw
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/\s+/g, "");
  // (a) → permitido; usamos el parser recursivo de abajo.
  let pos = 0;
  const peek = () => s[pos];
  const parseExpr = (): number => {
    let v = parseTerm();
    while (peek() === "+" || peek() === "-") {
      const op = s[pos++];
      const t = parseTerm();
      v = op === "+" ? v + t : v - t;
    }
    return v;
  };
  const parseTerm = (): number => {
    let v = parseFactor();
    while (peek() === "*" || peek() === "/") {
      const op = s[pos++];
      const f = parseFactor();
      v = op === "*" ? v * f : v / f;
    }
    return v;
  };
  const parseFactor = (): number => {
    if (peek() === "(") {
      pos++; // (
      const v = parseExpr();
      pos++; // )
      return applyPow(v);
    }
    // número con signo
    let num = "";
    if (peek() === "-" || peek() === "+") num += s[pos++];
    while (peek() && /[0-9.]/.test(peek())) num += s[pos++];
    return applyPow(parseFloat(num));
  };
  const applyPow = (base: number): number => {
    if (peek() === "^") {
      pos++;
      const exp = parseFactor();
      return Math.pow(base, exp);
    }
    return base;
  };
  s = s.replace(/\^/g, "^");
  const result = parseExpr();
  return result;
}

// Oráculos independientes por template (a partir de promptText).
const ORACLES: Record<string, (prompt: string) => number | null> = {
  INTEGER_ADD: (p) => evalArith(p),
  INTEGER_SUBTRACT: (p) => evalArith(p),
  INTEGER_MULT: (p) => evalArith(p),
  INTEGER_TRIPLE: (p) => evalArith(p),
  ORDER_BASIC: (p) => evalArith(p),
  ORDER_DIVISION: (p) => evalArith(p),
  ORDER_PAREN: (p) => evalArith(p),
  ORDER_TWO_OPS: (p) => evalArith(p),
  POWER_EVAL: (p) => evalArith(p),
  POWER_NEG_BASE: (p) => evalArith(p),
  EVALUATE_EXPR: (p) => {
    // "cx + d, x=v"
    const m = p.match(/^(\d+)x \+ (\d+), x=(-?\d+)$/);
    if (!m) return null;
    return Number(m[1]) * Number(m[3]) + Number(m[2]);
  },
  FUNCTION_EVAL: (p) => {
    // "f(v) con f(x)=cx +/- d"  → promptText: "f(3) con f(x)=2x + 5"
    const m = p.match(/f\((-?\d+)\) con f\(x\)=(\d+)x ([+-]) (\d+)/);
    if (!m) return null;
    const v = Number(m[1]);
    const c = Number(m[2]);
    const d = (m[3] === "-" ? -1 : 1) * Number(m[4]);
    return c * v + d;
  },
  PYTHAGORAS: (p) => {
    const m = p.match(/catetos (\d+) y (\d+)/);
    if (!m) return null;
    return Math.sqrt(Number(m[1]) ** 2 + Number(m[2]) ** 2);
  },
  LOG_EVAL: (p) => {
    const m = p.match(/log base (\d+) de (\d+)/);
    if (!m) return null;
    return Math.log(Number(m[2])) / Math.log(Number(m[1]));
  },
  EXP_SOLVE: (p) => {
    const m = p.match(/(\d+)\^x = (\d+)/);
    if (!m) return null;
    return Math.log(Number(m[2])) / Math.log(Number(m[1]));
  },
  RATIONAL_EQ_SOLVE: (p) => {
    const m = p.match(/(\d+)\/x = (\d+)/);
    if (!m) return null;
    return Number(m[1]) / Number(m[2]);
  },
  RAD_TO_DEG: (p) => {
    const map: Record<string, number> = {
      "\\frac{\\pi}{6} rad a grados": 30,
      "\\frac{\\pi}{4} rad a grados": 45,
      "\\frac{\\pi}{3} rad a grados": 60,
      "\\frac{\\pi}{2} rad a grados": 90,
      "\\frac{2\\pi}{3} rad a grados": 120,
      "\\frac{3\\pi}{4} rad a grados": 135,
      "\\frac{5\\pi}{6} rad a grados": 150,
      "\\pi rad a grados": 180,
    };
    return map[p] ?? null;
  },
};

describe("verificación independiente de correctitud numérica", () => {
  it("el evaluador aritmético de referencia es correcto", () => {
    expect(evalArith("2 + 3 * 4")).toBe(14);
    expect(evalArith("(6 + 2) * 3")).toBe(24);
    expect(evalArith("8 - 3 * 2")).toBe(2);
    expect(evalArith("8 + (-2)")).toBe(6);
    expect(evalArith("(-3)^2")).toBe(9);
    expect(evalArith("(-2)^3")).toBe(-8);
    expect(evalArith("10 + 8 / 2")).toBe(14);
    expect(evalArith("5 - (8 - 3)")).toBe(0);
  });

  for (const [id, oracle] of Object.entries(ORACLES)) {
    const template = TEMPLATES[id];
    it(`${id}: la respuesta declarada coincide con el cálculo independiente`, () => {
      expect(template).toBeDefined();
      for (let i = 0; i < 40; i++) {
        const ex = generateExercise(template, `c-${i}`, i);
        const expected = oracle(ex.promptText);
        expect(expected, `oráculo no pudo parsear: "${ex.promptText}"`).not.toBeNull();
        const declared = Number(ex.correctAnswerDisplay);
        expect(Math.abs((expected as number) - declared), `${id} promptText="${ex.promptText}" esperado=${expected} declarado=${declared}`).toBeLessThan(1e-9);
      }
    });
  }
});
