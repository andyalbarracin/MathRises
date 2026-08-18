import type { Concept } from "@/domain/types";
import {
  Calculator,
  Divide,
  ListOrdered,
  Superscript,
  Percent,
  Variable,
  Braces,
  Blocks,
  Equal,
  Sigma,
  ChevronsLeftRight,
  Spline,
  LineChart,
  Grid2x2,
  Parentheses,
  Triangle,
  Circle,
  Shapes,
  Compass,
  Waves,
  TrendingUp,
  Binary,
  Layers,
  Ratio,
  type LucideIcon,
} from "lucide-react";
import type { TileTone } from "@/components/ui/tile";
import {
  fraccionesConcept,
  fraccionesLesson,
  FRACCIONES_CONCEPT_ID,
  type LessonContent,
} from "./fractions";
import { enterosConcept, enterosLesson, ENTEROS_CONCEPT_ID } from "./integers";
import { ordenConcept, ordenLesson, ORDEN_CONCEPT_ID } from "./order-ops";
import { potenciasConcept, potenciasLesson, POTENCIAS_CONCEPT_ID } from "./powers";
import { porcentajesConcept, porcentajesLesson, PORCENTAJES_CONCEPT_ID } from "./percentages";
import { expresionesConcept, expresionesLesson, EXPRESIONES_CONCEPT_ID } from "./algebra";
import { polinomiosConcept, polinomiosLesson, POLINOMIOS_CONCEPT_ID } from "./polynomials";
import { factor1Concept, factor1Lesson, FACTOR1_CONCEPT_ID } from "./factoring";
import { linealesConcept, linealesLesson, LINEALES_CONCEPT_ID } from "./linear-eq";
import { cuadraticasConcept, cuadraticasLesson, CUADRATICAS_CONCEPT_ID } from "./quadratic-eq";
import { inecuacionesConcept, inecuacionesLesson, INECUACIONES_CONCEPT_ID } from "./inequalities";
import { funcionConcept, funcionLesson, FUNCION_CONCEPT_ID } from "./functions";
import { funcLinealConcept, funcLinealLesson, FUNC_LINEAL_CONCEPT_ID } from "./linear-functions";
import { sistemasConcept, sistemasLesson, SISTEMAS_CONCEPT_ID } from "./systems";
import { funcCuadraticaConcept, funcCuadraticaLesson, FUNC_CUADRATICA_CONCEPT_ID } from "./quadratic-functions";
import { geoBaseConcept, geoBaseLesson, GEO_BASE_CONCEPT_ID } from "./geometry";
import { geoPlanaConcept, geoPlanaLesson, GEO_PLANA_CONCEPT_ID } from "./geometry";
import { geoSemConcept, geoSemLesson, GEO_SEM_CONCEPT_ID } from "./geometry";
import { trig1Concept, trig1Lesson, TRIG1_CONCEPT_ID } from "./trig";
import { trig2Concept, trig2Lesson, TRIG2_CONCEPT_ID } from "./trig";
import { explogConcept, explogLesson, EXPLOG_CONCEPT_ID } from "./explog";
import { complejosConcept, complejosLesson, COMPLEJOS_CONCEPT_ID } from "./complex";
import { factor2Concept, factor2Lesson, FACTOR2_CONCEPT_ID } from "./factoring2";
import { racionalesConcept, racionalesLesson, RACIONALES_CONCEPT_ID } from "./rational-eq";

export interface PlayableConcept {
  concept: Concept;
  lesson: LessonContent;
  templateIds: string[];
  tone: TileTone;
  icon: LucideIcon;
}

export const PLAYABLE: Record<string, PlayableConcept> = {
  [ENTEROS_CONCEPT_ID]: {
    concept: enterosConcept,
    lesson: enterosLesson,
    templateIds: ["INTEGER_ADD", "INTEGER_MULT", "INTEGER_COMPARE"],
    tone: "blue",
    icon: Calculator,
  },
  [ORDEN_CONCEPT_ID]: {
    concept: ordenConcept,
    lesson: ordenLesson,
    templateIds: ["ORDER_BASIC", "ORDER_PAREN", "ORDER_STEP"],
    tone: "amber",
    icon: ListOrdered,
  },
  [FRACCIONES_CONCEPT_ID]: {
    concept: fraccionesConcept,
    lesson: fraccionesLesson,
    templateIds: ["FRACTION_SIMPLIFY", "FRACTION_ADD", "FRACTION_EQUIVALENCE", "FRACTION_ERROR_SPOTTING"],
    tone: "violet",
    icon: Divide,
  },
  [POTENCIAS_CONCEPT_ID]: {
    concept: potenciasConcept,
    lesson: potenciasLesson,
    templateIds: ["POWER_EVAL", "ROOT_EVAL", "POWER_PRODUCT"],
    tone: "coral",
    icon: Superscript,
  },
  [PORCENTAJES_CONCEPT_ID]: {
    concept: porcentajesConcept,
    lesson: porcentajesLesson,
    templateIds: ["PERCENT_OF", "PERCENT_INCREASE", "PROPORTION"],
    tone: "green",
    icon: Percent,
  },
  [EXPRESIONES_CONCEPT_ID]: {
    concept: expresionesConcept,
    lesson: expresionesLesson,
    templateIds: ["COMBINE_LIKE", "DISTRIBUTE", "EVALUATE_EXPR"],
    tone: "blue",
    icon: Variable,
  },
  [POLINOMIOS_CONCEPT_ID]: {
    concept: polinomiosConcept,
    lesson: polinomiosLesson,
    templateIds: ["POLY_ADD", "MONO_MULT", "NOTABLE_SQUARE"],
    tone: "amber",
    icon: Braces,
  },
  [FACTOR1_CONCEPT_ID]: {
    concept: factor1Concept,
    lesson: factor1Lesson,
    templateIds: ["COMMON_FACTOR", "DIFF_SQUARES", "FACTOR_METHOD"],
    tone: "coral",
    icon: Blocks,
  },
  [LINEALES_CONCEPT_ID]: {
    concept: linealesConcept,
    lesson: linealesLesson,
    templateIds: ["SOLVE_LINEAR", "SOLVE_LINEAR_PAREN", "SOLVE_FRACTION_EQ"],
    tone: "violet",
    icon: Equal,
  },
  [CUADRATICAS_CONCEPT_ID]: {
    concept: cuadraticasConcept,
    lesson: cuadraticasLesson,
    templateIds: ["SOLVE_SQUARE", "QUADRATIC_FACTORABLE", "DISCRIMINANT"],
    tone: "blue",
    icon: Sigma,
  },
  [INECUACIONES_CONCEPT_ID]: {
    concept: inecuacionesConcept,
    lesson: inecuacionesLesson,
    templateIds: ["SOLVE_INEQ", "INEQ_SIGN_FLIP", "INTERVAL_NOTATION"],
    tone: "amber",
    icon: ChevronsLeftRight,
  },
  [FUNCION_CONCEPT_ID]: {
    concept: funcionConcept,
    lesson: funcionLesson,
    templateIds: ["FUNCTION_EVAL", "FUNCTION_EVAL_SQUARE", "DOMAIN_MC"],
    tone: "green",
    icon: Parentheses,
  },
  [FUNC_LINEAL_CONCEPT_ID]: {
    concept: funcLinealConcept,
    lesson: funcLinealLesson,
    templateIds: ["SLOPE_FROM_EQUATION", "SLOPE_TWO_POINTS", "PARALLEL_CHECK"],
    tone: "blue",
    icon: LineChart,
  },
  [SISTEMAS_CONCEPT_ID]: {
    concept: sistemasConcept,
    lesson: sistemasLesson,
    templateIds: ["SYSTEM_SOLVE_X", "SYSTEM_SOLVE_Y", "SYSTEM_SOLUTION_POINT"],
    tone: "violet",
    icon: Grid2x2,
  },
  [FUNC_CUADRATICA_CONCEPT_ID]: {
    concept: funcCuadraticaConcept,
    lesson: funcCuadraticaLesson,
    templateIds: ["VERTEX_X", "CONCAVITY", "ROOTS_PARABOLA"],
    tone: "coral",
    icon: Spline,
  },
  [GEO_BASE_CONCEPT_ID]: {
    concept: geoBaseConcept,
    lesson: geoBaseLesson,
    templateIds: ["PYTHAGORAS", "TRIANGLE_ANGLE_SUM", "RECTANGLE_MEASURE"],
    tone: "blue",
    icon: Triangle,
  },
  [GEO_PLANA_CONCEPT_ID]: {
    concept: geoPlanaConcept,
    lesson: geoPlanaLesson,
    templateIds: ["CIRCLE_MEASURE", "COORD_POINT", "COORD_QUADRANT"],
    tone: "green",
    icon: Circle,
  },
  [GEO_SEM_CONCEPT_ID]: {
    concept: geoSemConcept,
    lesson: geoSemLesson,
    templateIds: ["SIMILAR_SIDE", "SCALE_LENGTH", "SCALE_FACTOR"],
    tone: "amber",
    icon: Shapes,
  },
  [TRIG1_CONCEPT_ID]: {
    concept: trig1Concept,
    lesson: trig1Lesson,
    templateIds: ["TRIG_RATIO", "TRIG_SPECIAL_ANGLE", "TRIG_DEFINITION"],
    tone: "violet",
    icon: Compass,
  },
  [TRIG2_CONCEPT_ID]: {
    concept: trig2Concept,
    lesson: trig2Lesson,
    templateIds: ["DEG_TO_RAD", "RAD_TO_DEG", "LAW_CHOICE"],
    tone: "blue",
    icon: Waves,
  },
  [FACTOR2_CONCEPT_ID]: {
    concept: factor2Concept,
    lesson: factor2Lesson,
    templateIds: ["TRINOMIAL_FACTOR", "RATIONAL_SIMPLIFY", "RATIONAL_DOMAIN"],
    tone: "green",
    icon: Layers,
  },
  [RACIONALES_CONCEPT_ID]: {
    concept: racionalesConcept,
    lesson: racionalesLesson,
    templateIds: ["RATIONAL_EQ_SOLVE", "CROSS_MULTIPLY", "EXCLUDED_VALUE"],
    tone: "coral",
    icon: Ratio,
  },
  [EXPLOG_CONCEPT_ID]: {
    concept: explogConcept,
    lesson: explogLesson,
    templateIds: ["LOG_EVAL", "EXP_SOLVE", "LOG_PROPERTY"],
    tone: "amber",
    icon: TrendingUp,
  },
  [COMPLEJOS_CONCEPT_ID]: {
    concept: complejosConcept,
    lesson: complejosLesson,
    templateIds: ["COMPLEX_ADD", "I_POWER", "COMPLEX_CONJUGATE"],
    tone: "violet",
    icon: Binary,
  },
};

/** Conceptos jugables en orden de aparición (según el plan, por semana). */
export const PLAYABLE_ORDER = [
  ENTEROS_CONCEPT_ID,
  ORDEN_CONCEPT_ID,
  FRACCIONES_CONCEPT_ID,
  POTENCIAS_CONCEPT_ID,
  PORCENTAJES_CONCEPT_ID,
  EXPRESIONES_CONCEPT_ID,
  POLINOMIOS_CONCEPT_ID,
  FACTOR1_CONCEPT_ID,
  FACTOR2_CONCEPT_ID,
  LINEALES_CONCEPT_ID,
  CUADRATICAS_CONCEPT_ID,
  RACIONALES_CONCEPT_ID,
  INECUACIONES_CONCEPT_ID,
  GEO_BASE_CONCEPT_ID,
  FUNCION_CONCEPT_ID,
  FUNC_LINEAL_CONCEPT_ID,
  SISTEMAS_CONCEPT_ID,
  FUNC_CUADRATICA_CONCEPT_ID,
  GEO_PLANA_CONCEPT_ID,
  GEO_SEM_CONCEPT_ID,
  TRIG1_CONCEPT_ID,
  TRIG2_CONCEPT_ID,
  EXPLOG_CONCEPT_ID,
  COMPLEJOS_CONCEPT_ID,
];

export function getPlayable(conceptId: string): PlayableConcept | undefined {
  return PLAYABLE[conceptId];
}

export function isPlayable(conceptId: string): boolean {
  return conceptId in PLAYABLE;
}
