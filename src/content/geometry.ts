import type { Concept } from "@/domain/types";
import type { LessonContent } from "./fractions";

/* ---- Geometría base (S11) ---- */
export const GEO_BASE_CONCEPT_ID = "geometria-base";

export const geoBaseConcept: Concept = {
  id: GEO_BASE_CONCEPT_ID,
  slug: "geometria-base",
  title: "Geometría base",
  description: "Ángulos de triángulos, Pitágoras, perímetro y área.",
  module: "GEOMETRIA_I",
  prerequisites: ["potencias-radicales"],
  difficulty: "medium",
  targetWeek: 11,
  masteryRequired: 4,
  tags: ["geometria", "triangulos", "pitagoras"],
};

export const geoBaseLesson: LessonContent = {
  explanation: {
    title: "Ángulos, lados y el teorema estrella",
    mentor: "delta",
    body: [
      "Los tres ángulos internos de cualquier triángulo suman 180°. Si conocés dos, el tercero sale restando.",
      "En un triángulo rectángulo vale el teorema de Pitágoras: la hipotenusa al cuadrado es la suma de los cuadrados de los catetos (c² = a² + b²).",
      "El área de un rectángulo es base por altura, y su perímetro es la suma de todos sus lados: 2·(base + altura).",
    ],
    simple: [
      "En cualquier triángulo, los tres ángulos de adentro suman 180°. Si conocés dos, el tercero sale restando.",
      "Pitágoras solo vale si hay un ángulo de 90°. El lado más largo (hipotenusa) al cuadrado es la suma de los cuadrados de los otros dos. Con catetos 3 y 4, la hipotenusa es 5.",
    ],
    recall: {
      conceptId: "potencias-radicales",
      title: "¿Te acordás de potencias y raíces?",
      text: "Pitágoras usa cuadrados y raíz cuadrada: elevás los catetos al cuadrado, sumás, y sacás raíz para hallar la hipotenusa.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "a = 3, \\quad b = 4",
    steps: [
      {
        latex: "c^2 = 3^2 + 4^2 = 9 + 16 = 25",
        note: "Teorema de Pitágoras.",
        plain: "Elevamos cada cateto al cuadrado y sumamos: 9 + 16 = 25.",
      },
      {
        latex: "c = \\sqrt{25} = 5",
        note: "La hipotenusa mide 5.",
        plain: "La hipotenusa es la raíz de 25, que es 5.",
      },
    ],
  },
  materials: ["regla", "compás", "transportador"],
  glossary: [
    { term: "ángulos internos", plain: "Los tres ángulos de adentro de un triángulo. Siempre suman 180°." },
    { term: "triángulo rectángulo", plain: "Un triángulo que tiene un ángulo de 90° (un 'ángulo recto', como la esquina de una hoja)." },
    { term: "hipotenusa", plain: "En un triángulo rectángulo, el lado más largo: el que está enfrente del ángulo de 90°." },
    { term: "catetos", plain: "Los dos lados que forman el ángulo de 90° en un triángulo rectángulo." },
    { term: "teorema de Pitágoras", plain: "En un triángulo rectángulo: la hipotenusa al cuadrado es la suma de los cuadrados de los catetos (c² = a² + b²)." },
    { term: "perímetro", plain: "La suma de todos los lados de una figura (lo que mide su contorno)." },
  ],
};

/* ---- Geometría plana (S16) ---- */
export const GEO_PLANA_CONCEPT_ID = "geometria-plana";

export const geoPlanaConcept: Concept = {
  id: GEO_PLANA_CONCEPT_ID,
  slug: "geometria-plana-avanzada",
  title: "Geometría plana avanzada",
  description: "Círculo, plano cartesiano y cuadrantes.",
  module: "GEOMETRIA_II",
  prerequisites: ["geometria-base"],
  difficulty: "medium",
  targetWeek: 16,
  masteryRequired: 4,
  tags: ["geometria", "circulo", "coordenadas"],
};

export const geoPlanaLesson: LessonContent = {
  explanation: {
    title: "El círculo y el plano cartesiano",
    mentor: "delta",
    body: [
      "En un círculo de radio r, el área es π·r² y el perímetro (circunferencia) es 2·π·r. Se suelen dejar expresados 'en términos de π'.",
      "El plano cartesiano ubica puntos con un par (x; y): primero cuánto te movés en horizontal, después en vertical.",
      "Los ejes dividen el plano en cuatro cuadrantes, numerados en sentido antihorario desde arriba-derecha (I, II, III, IV) según los signos de x e y.",
    ],
    simple: [
      "En un círculo, todo se calcula con el radio (r) y el número π (≈ 3,14). El área es π·r² y el contorno (circunferencia) es 2·π·r.",
      "El plano cartesiano es como la 'batalla naval': un punto (x; y) dice cuánto te movés a la derecha y cuánto para arriba.",
    ],
    recall: {
      conceptId: "geometria-base",
      title: "¿Te acordás de perímetro y área?",
      text: "Acá aplicamos las mismas ideas de área y perímetro que viste en geometría base, ahora al círculo.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "r = 3",
    steps: [
      {
        latex: "A = \\pi r^2 = \\pi \\cdot 3^2 = 9\\pi",
        note: "Área del círculo.",
        plain: "El área es π por el radio al cuadrado: 3² = 9, así que 9π (se deja con π adentro).",
      },
      {
        latex: "P = 2\\pi r = 6\\pi",
        note: "Circunferencia.",
        plain: "La circunferencia es 2·π·radio: 2·π·3 = 6π.",
      },
    ],
  },
  materials: ["papel y lápiz", "compás", "regla"],
  glossary: [
    { term: "radio", plain: "La distancia del centro del círculo al borde. La mitad del diámetro." },
    { term: "circunferencia", plain: "El contorno (perímetro) del círculo. Mide 2·π·r." },
    { term: "plano cartesiano", plain: "La cuadrícula con dos ejes (x horizontal, y vertical) donde ubicamos puntos con un par (x; y)." },
    { term: "cuadrantes", plain: "Las cuatro zonas en que los ejes dividen el plano, numeradas I, II, III, IV." },
  ],
};

/* ---- Semejanza y transformaciones (S17) ---- */
export const GEO_SEM_CONCEPT_ID = "semejanza-transformaciones";

export const geoSemConcept: Concept = {
  id: GEO_SEM_CONCEPT_ID,
  slug: "semejanza-y-transformaciones",
  title: "Semejanza y escalas",
  description: "Razón de semejanza, lados proporcionales y escalas.",
  module: "GEOMETRIA_II",
  prerequisites: ["geometria-base"],
  difficulty: "medium",
  targetWeek: 17,
  masteryRequired: 4,
  tags: ["geometria", "semejanza", "escala"],
};

export const geoSemLesson: LessonContent = {
  explanation: {
    title: "La misma forma, distinto tamaño",
    mentor: "delta",
    body: [
      "Dos figuras son semejantes si tienen la misma forma pero distinto tamaño. Sus lados correspondientes están en la misma proporción, llamada razón de semejanza.",
      "Si conocés la razón, multiplicás un lado del chico por ella para obtener el lado del grande (o dividís para el camino inverso).",
      "Las escalas funcionan igual: en un plano a escala 1:100, cada centímetro representa 100 cm reales, así que multiplicás por 100.",
    ],
    simple: [
      "Dos figuras semejantes son como la misma foto en dos tamaños: la forma es igual, cambia el tamaño. Todos los lados se agrandan (o achican) por el mismo número.",
      "Si la figura grande es el doble de la chica, la razón es 2: cada lado del grande es el del chico por 2.",
    ],
    recall: {
      conceptId: "porcentajes-proporciones",
      title: "¿Te acordás de las proporciones?",
      text: "La semejanza es pura proporción: los lados guardan la misma relación, como la regla de tres que viste en porcentajes.",
    },
  },
  workedExample: {
    title: "Ejemplo resuelto",
    problemLatex: "\\text{chico: } 3, 4 \\quad \\text{grande: } 6, \\;?",
    steps: [
      {
        latex: "k = \\dfrac{6}{3} = 2",
        note: "Razón de semejanza.",
        plain: "La razón es el lado grande dividido el lado chico correspondiente: 6 ÷ 3 = 2.",
      },
      {
        latex: "? = 4 \\times 2 = 8",
        note: "Aplicamos la razón al otro lado.",
        plain: "El otro lado del grande es el del chico (4) por la razón (2): 8.",
      },
    ],
  },
  materials: ["papel y lápiz", "regla"],
  glossary: [
    { term: "semejantes", plain: "Dos figuras con la misma forma pero distinto tamaño (una es una copia agrandada o achicada de la otra)." },
    { term: "razón de semejanza", plain: "El número por el que se multiplican los lados del chico para obtener los del grande (o al revés)." },
    { term: "lados correspondientes", plain: "Los lados que ocupan el mismo lugar en las dos figuras (el que 'hace juego')." },
    { term: "escala", plain: "La relación entre el dibujo y la realidad. En 1:100, cada 1 del plano son 100 reales." },
  ],
};
