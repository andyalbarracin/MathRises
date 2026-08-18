# Sonidos de RiseMath

La app **ya suena sin archivos**: por defecto sintetiza los efectos con la Web Audio API.
Si querés sonidos propios, dejá archivos `.mp3` acá con estos nombres **y poné
`USE_SOUND_FILES = true`** en `src/lib/sound.ts` (así usa tus archivos en vez de
los sintetizados):

| Archivo | Cuándo suena |
|---|---|
| `correct.mp3` | Respuesta correcta |
| `wrong.mp3` | Respuesta incorrecta |
| `complete.mp3` | Fin de sesión |
| `bell.mp3` | Notificaciones / toasts (campanita) |
| `levelup.mp3` | Subir de nivel / logro |
| `tap.mp3` | Toques de UI (opcional) |

## De dónde bajar sonidos libres (para alojar acá)

- **Kenney — Interface Sounds / UI Audio** (licencia CC0, sin atribución, ideal):
  https://kenney.nl/assets/interface-sounds · https://kenney.nl/assets/ui-audio
- **Pixabay — Sound Effects** (sin atribución obligatoria):
  https://pixabay.com/sound-effects/
- **Mixkit — Free SFX** (sin atribución): https://mixkit.co/free-sound-effects/
- **Freesound** (sirve, pero la atribución **depende** de la licencia de cada
  sonido; revisá antes de usar): https://freesound.org/

Recomendado: efectos cortos (<1 s), volumen parejo, formato `.mp3`.
El control de silencio está en la barra lateral (junto al tema).
