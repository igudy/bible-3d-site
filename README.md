# The Bible: One Story (3D site)

React + Vite · **Tailwind CSS v4** · Framer Motion (`motion`) · GSAP ScrollTrigger · Lenis · React Three Fiber.
Scripture quoted from the King James Version (public domain).

```bash
npm install
npm run dev
npm run build
```

## Page order
1. **Emmanuel** — the statue in a white studio, camera circles it (`StatueAct`, layout `beats`)
2. **Ordinary people** — full-screen character panels that stack as you scroll
3. **The Twelve** — a horizontal track, pinned
4. **The Birth** — the nativity in a warm room (`StatueAct`, `frame: 'scene'`, `tone: 'warm'`)
5. **The Cross** — front (death) turns to the back (burial)
6. **The Books** — the bookshelf, with the leather Bible turning beside it
7. **Come to Jesus** — the opening figure again, warm room, laid out as an invitation
   (`StatueAct`, layout `invitation`)


## Add media to a character (no code)
In `src/data/content.js`, on any character:
```js
image: '/media/david.jpg',          // put the file in public/media/
youtube: 'VIDEO_ID', start: 30,     // or a muted looping YouTube background
```

## Add a 3D model
1. Put it in `public/models/<name>/` (`.glb`/`.gltf` preferred; `.fbx` works too).
2. In `src/three/Relics.jsx` copy the `Seal` component, point it at your file, and add it to `RELICS`.
3. Set `relic: '<name>'` on the section in `content.js`.
Lights and cameras inside model files are removed automatically.

## Credits (required for CC-BY models)
Listed in `credits` in `content.js` and shown in the footer.

## Act II statue
`public/models/statue/statue.glb` was compressed from the 17 MB scan with:
`npx @gltf-transform/cli optimize scene.gltf statue.glb --compress meshopt --texture-compress webp --simplify-ratio 0.35`
The lines that appear during the turn are `statueBeats` in `content.js`.

## The Cross model
`public/models/cross/cross.glb` was compressed 133 MB → 2 MB:
```
gltf-transform join scene.gltf j.glb
gltf-transform draco j.glb d2.glb --quantize-position 11 --quantize-normal 7 --quantize-texcoord 10
gltf-transform optimize d2.glb cross.glb --compress draco --texture-compress webp --texture-size 2048 --simplify false
```
`join` matters: the scan ships as 64k-vertex chunks whose borders lock the simplifier.
Draco decoding needs `public/draco/` (copied from `three/examples/jsm/libs/draco/gltf/`).

**Licence:** this model is CC-BY-**NC** 4.0 — credit required and **non-commercial use only**.
The two other models are CC-BY 4.0 (commercial use allowed). All credits are in `credits` in `content.js`.

## Story order
Emmanuel → Ordinary people → The Twelve → The Cross → The Books → Forever.

`StatueAct` is used twice, as the page's bookends — same statue, same turn, different words.
Both are configured in `src/App.jsx` (`EMMANUEL` and `FOREVER`): the giant word, the verses
(`statueBeats` / `foreverBeats` in `content.js`), the corner labels and the closing buttons.

Each section declares its own 3D object with data attributes, read by `useActiveSection`:
`data-world` (background) · `data-relic` (which model) · `data-stage` (where it stands).
Positions live in `PLACE` in `src/components/Stage.jsx` — `center`, `left`, `right`,
`shelf` (top-right, over the bookshelf) and `altar` (the closing bookend, hero-sized).
The Bible hero and the "Promise"/"Sent" acts are commented out in `src/App.jsx`.

## Models
| File | Used by | Source size → shipped | Licence |
|---|---|---|---|
| `public/models/statue/statue.glb` | Emmanuel (opening) | 17 MB → 1.6 MB | CC-BY-4.0, amcgi |
| `public/models/cross/cross.glb` | The Cross | 133 MB → 2.0 MB | CC-BY-**NC**-4.0, noe-3d.at |
| `public/models/nativity/nativity.glb` | Come (closing) | 42.7 MB → 2.2 MB | CC-BY-4.0, SPAWNPAWS |
| `public/models/vg-bible/bible.glb` | spare (`paintedBible`) | 7.5 MB → 0.4 MB | source/licence unconfirmed |
| `public/models/seal/` | spare (unused) | — | CC-BY-4.0, Victor.Alfonso.Ibarra.Ortega |

Compression pipeline (Draco beats meshopt here by ~2.5×):
```
gltf-transform join scene.gltf j.glb      # scans ship as 64k chunks; joining lets the simplifier work
gltf-transform draco j.glb d.glb --quantize-position 11 --quantize-normal 7 --quantize-texcoord 10
gltf-transform optimize d.glb out.glb --compress draco --texture-compress webp --simplify false
```
Draco decoding needs `public/draco/` (copied from `three/examples/jsm/libs/draco/gltf/`).

`StatueAct` takes `model`, `fit`, `lift`, `frame`, `tone` and `layout`, so one component drives
Emmanuel, the Birth and the closing invitation: `frame: 'portrait'` orbits a standing figure, `frame: 'scene'` frames a wide set by its
bounding sphere. `stripBackdrop()` in `Relics.jsx` drops the giant backdrop sphere some scans ship.

`SPIN` in `Stage.jsx` lists relics that turn a full circle (the Bible) rather than rocking
gently — give a relic an entry there (radians per second) to make it rotate all the way round.
A `PLACE` entry with `hideNarrow: true` drops that relic on phones (the Bible, which crowds the shelf).

`surface: 'alabaster'` on a `StatueAct` is for untextured models: it swaps the flat white for warm
stone and swaps the bright `RoomEnvironment` for `makeWarmEnv()` — a dark surround with a few warm
panels, so the form has shadow to fall into instead of being flooded.

## Performance notes
The page carries five WebGL canvases and ~7 MB of models, so it only does work that is on screen:

- **Models load per chapter.** `Relic` in `Stage.jsx` mounts its model the first time its section
  becomes active, so a first paint fetches one model (~1.5 MB) instead of every relic (~13 MB).
  Models that no section references (nativity, the painted Bible, the seal) never load at all.
- **Canvases stop when they're not visible.** `StatueAct` and `CrossAct` watch their own section
  with an IntersectionObserver and set `frameloop="never"` when off screen; `Stage` idles between
  relic sections; the background `Scene` pauses while an opaque chapter (`stone`/`dusk`) covers it.
- **`DPR`** (exported from `StatueAct.jsx`) caps device pixel ratio at 1.5, or 1.25 on phones.
- **Chapter length** comes from `screens` — 4.2 with a model to turn, 2.2 for a text-only chapter,
  so sections without a model don't drag.
- Heavy code is split: `Scene`, `Stage` and `CrossAct` are lazy, which keeps the entry bundle
  around 600 kB (200 kB gzipped) rather than 1.5 MB.
- The Bible's textures are 1024px WebP (577 kB for all three; they were 5 MB of PNG).

`DRAGGABLE` in `Stage.jsx` lists relics the reader turns themselves: those sit still facing front,
and the stage takes pointer events (with `touch-action: pan-y`, so a vertical swipe still scrolls).
