# Mascota de RiseMath — assets intercambiables

Cada archivo es una expresión/estado de la mascota. La app los carga por nombre,
así que **podés reemplazar cualquiera manualmente** sin tocar código: dejá el
mismo nombre de archivo (podés usar `.svg`, `.png` o `.webp`, ver abajo).

| Archivo | Cuándo se usa |
|---|---|
| `happy.svg` | Estado por defecto / avatares / mensajes tranquilos |
| `cheer.svg` | Festejos: fin de sesión, respuestas correctas, logros |
| `think.svg` | Pensando / diagnóstico / pistas |
| `oops.svg` | Error / "che, te equivocaste" |

## Cómo reemplazar

1. Reemplazá el archivo manteniendo el nombre (p. ej. `cheer.svg`).
2. Si querés usar PNG/WebP en vez de SVG, subí `cheer.png` (o `.webp`) y cambiá
   la constante `MASCOT_EXT` en `src/components/art/mascot.tsx` a `"png"`/`"webp"`.
3. Recomendado: imágenes cuadradas (viewBox/lienzo 1:1), fondo transparente.

## Sumar más estados

Podés agregar más archivos (ej. `sleep.svg`, `love.svg`, `wave.svg`) y usarlos
pasando `expression="sleep"` al componente `<Mascot />`. Agregá el nombre al tipo
`Expression` en `src/components/art/mascot.tsx`.

El diseño incluido es original (no reproduce personajes con derechos de autor).
