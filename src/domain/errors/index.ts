import type { ErrorCategory } from "@/domain/types";

/** Explicación conceptual por tipo de error (para el feedback). */
export const ERROR_EXPLANATIONS: Partial<Record<ErrorCategory, string>> = {
  FRACTION_COMMON_DENOMINATOR:
    "Al sumar o restar fracciones no se suman los denominadores: primero hay que llevarlas a un denominador común.",
  FRACTION_NOT_SIMPLIFIED:
    "El valor es correcto, pero falta escribirlo en su mínima expresión: dividí numerador y denominador por su factor común.",
  SIGN_ERROR:
    "Cuidado con los signos: el negativo debe distribuirse a todos los términos.",
  ORDER_OF_OPERATIONS:
    "Respetá el orden: primero potencias y raíces, luego multiplicación y división, y por último suma y resta.",
  ARITHMETIC_SLIP:
    "Hubo un error de cálculo en algún paso. Revisá las operaciones con cuidado.",
  UNKNOWN: "Revisá el procedimiento paso a paso.",
};

export function explainError(categories: ErrorCategory[]): string {
  for (const c of categories) {
    const e = ERROR_EXPLANATIONS[c];
    if (e) return e;
  }
  return ERROR_EXPLANATIONS.UNKNOWN!;
}
