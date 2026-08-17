# RiseMath

Sistema de entrenamiento matemático gamificado para preparar el curso de ingreso a Ingeniería de la Universidad Nacional de La Matanza (UNLaM).

Aprendizaje por práctica, dominio antes que avance, repetición espaciada y seguimiento de errores — en sesiones cortas y sostenibles.

## Stack

- **Next.js 16** (App Router) · **TypeScript** strict
- **Tailwind CSS v4**
- **Dexie / IndexedDB** (persistencia local-first, sin backend)
- **KaTeX** para notación matemática
- **GSAP** para microinteracciones
- **Vitest** para la lógica de dominio
- PWA (instalable, offline)

## Desarrollo

Requiere Node 20+.

```bash
npm install
npm run dev        # servidor de desarrollo en http://localhost:3000
```

### Scripts

```bash
npm run build      # build de producción
npm run start      # servir el build
npm run typecheck  # chequeo de tipos
npm run lint       # ESLint
npm run test       # tests (Vitest)
```

## Arquitectura

Monolito modular. La lógica de aprendizaje (mastery, repetición espaciada, generación y corrección de ejercicios) vive en `src/domain` como funciones puras y testeadas, desacopladas de la UI y de la persistencia mediante una interfaz de repositorio (`src/data`). El progreso se guarda localmente en el navegador (IndexedDB).

```
src/
  app/        rutas (Hoy, Roadmap, Práctica, Repasos, Errores, Simulacros, Progreso, Perfil, Sesión)
  components/ UI, tarjetas de aprendizaje, motor de sesión, roadmap, mentores
  domain/     lógica pura: mastery, spaced-repetition, exercises, validation, xp, errors
  data/       interfaz de repositorio + implementación local (Dexie)
  content/    curriculum tipado (conceptos, roadmap, mentores)
```

## Estado

En desarrollo activo. El primer recorrido completo (Fundamentos → Fracciones) funciona de punta a punta: sesión, ejercicios, feedback, registro de errores, mastery, repaso espaciado y XP. El resto del temario se incorpora sobre la misma arquitectura.
