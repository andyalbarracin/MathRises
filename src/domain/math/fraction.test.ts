import { describe, it, expect } from "vitest";
import {
  addFractions,
  fractionsEqual,
  gcd,
  isReduced,
  lcm,
  parseFraction,
  simplify,
} from "./fraction";

describe("fraction math", () => {
  it("gcd y lcm", () => {
    expect(gcd(12, 8)).toBe(4);
    expect(gcd(7, 3)).toBe(1);
    expect(lcm(4, 6)).toBe(12);
  });

  it("simplify normaliza signo y reduce", () => {
    expect(simplify({ n: 6, d: 8 })).toEqual({ n: 3, d: 4 });
    expect(simplify({ n: 3, d: -6 })).toEqual({ n: -1, d: 2 });
    expect(() => simplify({ n: 1, d: 0 })).toThrow();
  });

  it("addFractions con distinto denominador", () => {
    expect(addFractions({ n: 1, d: 2 }, { n: 1, d: 3 })).toEqual({ n: 5, d: 6 });
    expect(addFractions({ n: 1, d: 4 }, { n: 1, d: 4 })).toEqual({ n: 1, d: 2 });
  });

  it("fractionsEqual compara por valor, no por formato", () => {
    expect(fractionsEqual({ n: 2, d: 4 }, { n: 1, d: 2 })).toBe(true);
    expect(fractionsEqual({ n: 2, d: 3 }, { n: 3, d: 4 })).toBe(false);
  });

  it("isReduced", () => {
    expect(isReduced({ n: 1, d: 2 })).toBe(true);
    expect(isReduced({ n: 2, d: 4 })).toBe(false);
  });

  describe("parseFraction", () => {
    it("acepta fracciones, enteros, mixtos y decimales", () => {
      expect(parseFraction("3/4")).toEqual({ n: 3, d: 4 });
      expect(parseFraction("-3/4")).toEqual({ n: -3, d: 4 });
      expect(parseFraction("5")).toEqual({ n: 5, d: 1 });
      expect(parseFraction("2 1/2")).toEqual({ n: 5, d: 2 });
      expect(parseFraction("0.5")).toEqual({ n: 1, d: 2 });
    });
    it("rechaza basura y división por cero", () => {
      expect(parseFraction("")).toBeNull();
      expect(parseFraction("abc")).toBeNull();
      expect(parseFraction("3/0")).toBeNull();
    });
  });
});
