import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { makeEnv } from '../three/textures'
import { RELICS } from '../three/Relics'
import { DPR } from './StatueAct'

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const pointer = { x: 0, y: 0 }
addEventListener('pointermove', (e) => { pointer.x = e.clientX / innerWidth - 0.5; pointer.y = e.clientY / innerHeight - 0.5 })

// Where each relic stands: x and y are fractions of the viewport, s is a scale.
// `center` is the hero; `shelf` tucks into the top-right above the bookshelf;
// `altar` is the closing bookend, as big as the hero.
// relics the reader can turn themselves: these sit still, facing front, until dragged
const DRAGGABLE = new Set(['bible'])

// how far the reader has dragged the current relic, in radians
const drag = { turn: 0, tilt: 0, on: false, x: 0, y: 0 }

// the idle float: a side-to-side drift, quicker than the vertical bob
const FLOAT = { sway: 0.3, swaySpeed: 1.5, bob: 0.08, bobSpeed: 0.9 }

const PLACE = {
  center: { x: 0, y: 0, s: 1.25 },
  left: { x: -1, y: 0, s: 1 },
  right: { x: 1, y: 0, s: 1 },
  shelf: { x: 1.3, y: 0.2, s: 0.6, hideNarrow: true },
  altar: { x: -0.5, y: 0.04, s: 1.35 },
}

function Relic({ id, active, pos }) {
  const g = useRef()
  // load the model the first time its section is reached, then keep it
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { if (active) setLoaded(true) }, [active])
  const { viewport } = useThree()
  const Model = RELICS[id]
  const st = useRef({ s: 0, spin: 0, was: false, x: null })

  useFrame(({ clock }, dt) => {
    const s = st.current, o = g.current
    if (active && !s.was) s.spin = Math.PI * 1.25 // spin in when its section arrives
    s.was = active
    const k = 1 - Math.exp(-dt * 4)
    s.s += ((active ? 1 : 0) - s.s) * k
    s.spin += -s.spin * (1 - Math.exp(-dt * 2.2))
    o.visible = s.s > 0.01
    if (!o.visible) return
    const narrow = viewport.width < 7
    const place = PLACE[pos] || PLACE.right
    // some relics only earn their space on a wide screen
    if (narrow && place.hideNarrow) { o.visible = false; return }
    const x = narrow ? 0 : place.x * viewport.width * 0.2
    const t = clock.elapsedTime
    // ease toward the anchor, then float around it
    if (s.x === null) s.x = x
    s.x += (x - s.x) * k
    const baseY = (place.y || 0) * viewport.height + (narrow && pos !== 'center' ? -viewport.height * 0.18 : 0)
    o.position.x = s.x + (reduce ? 0 : Math.sin(t * FLOAT.swaySpeed) * FLOAT.sway)
    o.position.y = baseY + (reduce ? 0 : Math.sin(t * FLOAT.bobSpeed) * FLOAT.bob)
    o.scale.setScalar(s.s * place.s * (narrow ? 0.75 : 1))
    if (DRAGGABLE.has(id)) {
      // front-facing and still; the reader turns it themselves
      o.rotation.y = s.spin + drag.turn
      o.rotation.x = THREE.MathUtils.clamp(drag.tilt, -0.6, 0.6)
    } else {
      o.rotation.y = s.spin + (reduce ? 0 : Math.sin(t * 0.35) * 0.3) + pointer.x * 0.8
      o.rotation.x = pointer.y * 0.3
    }
  })

  return (
    <group ref={g} scale={0}>
      {loaded && <Suspense fallback={null}><Model /></Suspense>}
    </group>
  )
}

function StageScene({ relic, pos }) {
  const { gl, scene } = useThree()
  useEffect(() => { scene.environment = makeEnv(gl) }, [gl, scene])
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 6]} intensity={2.4} />
      <directionalLight position={[-5, -1, 2]} intensity={0.8} color="#9fbaff" />
      {Object.keys(RELICS).map((id) => <Relic key={id} id={id} active={relic === id} pos={pos} />)}
    </>
  )
}

export default function Stage({ relic, pos }) {
  // nothing to draw between relic sections, so stop the loop entirely
  const idle = !relic || pos === 'off'
  const grabbable = DRAGGABLE.has(relic) && !idle

  // reset the reader's rotation when a different relic takes the stage
  useEffect(() => { drag.turn = 0; drag.tilt = 0; drag.on = false }, [relic])

  const onDown = (e) => { drag.on = true; drag.x = e.clientX; drag.y = e.clientY; e.currentTarget.setPointerCapture?.(e.pointerId) }
  const onMove = (e) => {
    if (!drag.on) return
    drag.turn += (e.clientX - drag.x) * 0.01
    drag.tilt += (e.clientY - drag.y) * 0.006
    drag.x = e.clientX; drag.y = e.clientY
  }
  const onUp = () => { drag.on = false }

  return (
    <div
      className={`fixed inset-0 z-[2] ${grabbable ? 'pointer-events-auto touch-pan-y cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
      onPointerDown={grabbable ? onDown : undefined}
      onPointerMove={grabbable ? onMove : undefined}
      onPointerUp={grabbable ? onUp : undefined}
      onPointerCancel={grabbable ? onUp : undefined}
      aria-hidden="true"
    >
      <Canvas className="absolute! inset-0" camera={{ fov: 35, position: [0, 0, 9] }} dpr={DPR}
              frameloop={idle ? 'never' : 'always'}
              gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <StageScene relic={relic} pos={pos} />
      </Canvas>
    </div>
  )
}
