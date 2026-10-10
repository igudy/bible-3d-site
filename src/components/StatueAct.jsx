import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { makeWarmEnv } from '../three/textures'
import { AnimatePresence, motion } from 'motion/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { church, invitation, read } from '../data/content'
import { Btn } from './primitives'

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const NARROW = innerWidth < 900
export const DPR = [1, NARROW ? 1.25 : 1.5]
// antialiasing costs a lot on phone GPUs and is barely visible at that pixel density
export const GL = { antialias: !NARROW, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }
const ease = [0.2, 0.7, 0.2, 1]

// the giant word, sliding behind (and as an outline in front of) the figure
// shared type for the giant word; each use sets its own horizontal anchor so the
// sliding version (left-0) and the splitting halves (left-1/2) never fight over `left`
const WORD_BASE = 'absolute top-[56%] -translate-y-1/2 whitespace-nowrap pointer-events-none font-sans ' +
  'font-bold leading-[0.78] tracking-[-0.07em] uppercase'
const WORD_TYPE = `${WORD_BASE} text-[60vw] lg:text-[44vw]`
// A word that parts down the middle has to fit the screen first, or both halves slide
// straight off a phone and the chapter reads as an empty page. 38vw puts the whole of a
// five-letter word across the viewport; wide screens keep the oversized cut.
const WORD_SPLIT_TYPE = `${WORD_BASE} text-[38vw] lg:text-[44vw]`
const WORD = `${WORD_TYPE} left-0`
const META = 'absolute z-[4] font-mono text-[10px] leading-[1.6] tracking-[0.2em] uppercase text-slate-ink'

/*
  One statue in a white studio. The section is ~4 screens tall with a sticky frame; scrolling
  through it turns the camera a full circle around the statue and pulls back from a close
  portrait to the whole figure, while lines of scripture appear and a giant word slides behind
  (and, as an outline, in front of) it.

  Used twice, as the page's bookends: `Emmanuel` opens the story, `Forever` closes it.
*/
export default function StatueAct({ id, word, beats, meta, actions, model = '/models/statue/statue.glb', fit = 4, lift = 0.6, frame = 'portrait', tone = 'light', layout = 'beats', surface = 'scan', wordDir = 'left', split = false, screens }) {
  const root = useRef()
  const progress = useRef(0)
  const [beat, setBeat] = useState(0)
  const lastBeat = useRef(0)
  const back = useRef(), front = useRef()
  const halfL = useRef(), halfR = useRef()
  // a chapter with a model needs room to turn it; a text-only one should move briskly.
  // Phones get a shorter run — the same story with far less thumb work.
  const tall = screens ?? (model ? (NARROW ? 3 : 4.2) : (NARROW ? 1.6 : 2.2))
  const [live, setLive] = useState(false)
  const [near, setNear] = useState(false)

  // Two rings. The outer one mounts the canvas a screen early, so the model is ready
  // before you reach it; the inner one decides whether to actually draw frames.
  // Leaving the canvas mounted but paused is not enough — a parked WebGL context still
  // holds its GPU memory and its own copy of the model, and this page has several.
  useEffect(() => {
    if (!model) return
    const el = root.current
    // Measure once up front. IntersectionObserver only reports once the page is actually
    // being composited, so a tab opened in the background would otherwise paint the
    // opening chapter with no figure in it until it first draws a frame.
    const r = el.getBoundingClientRect()
    if (r.top < innerHeight * 2 && r.bottom > -innerHeight) {
      setNear(true)
      setLive(r.top < innerHeight * 1.1 && r.bottom > -innerHeight * 0.1)
    }
    const draw = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: '10% 0px' })
    const hold = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '100% 0px' })
    draw.observe(el); hold.observe(el)
    return () => { draw.disconnect(); hold.disconnect() }
  }, [model])

  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true,
      onUpdate: (self) => {
        progress.current = self.progress
        // this runs every scroll frame; only pay for a React render when the beat really turns
        const next = Math.min(beats.length - 1, Math.floor(self.progress * beats.length * 0.999))
        if (next !== lastBeat.current) { lastBeat.current = next; setBeat(next) }
      },
    })
    const track = { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true }
    let slide
    if (split && halfL.current) {
      // the word opens from the middle, like the stone rolling back
      // part them to about a third in from each edge on a phone, so both halves stay
      // readable; the wide-screen travel carries them further out as before
      const [toL, toR] = NARROW ? [-70, -30] : [-94, -6]
      slide = gsap.timeline({ scrollTrigger: track })
        .fromTo(halfL.current, { xPercent: -50 }, { xPercent: toL, ease: 'none' }, 0)
        .fromTo(halfR.current, { xPercent: -50 }, { xPercent: toR, ease: 'none' }, 0)
    } else if (back.current) {
      // the whole word slides past: in from one edge, out of the other
      const off = () => back.current.offsetWidth - innerWidth * 0.65
      const near = () => innerWidth * 0.35
      const [from, to] = wordDir === 'right' ? [() => -off(), near] : [near, () => -off()]
      slide = gsap.fromTo([back.current, front.current], { x: from }, { x: to, ease: 'none', scrollTrigger: track })
    }
    return () => { st.kill(); slide?.scrollTrigger?.kill(); slide?.kill() }
  }, [beats, split, wordDir])

  const b = beats[beat]
  return (
    <section id={id} data-world="stone" data-stage="off" ref={root}
             style={{ height: `${tall * 100}svh` }}   /* svh, not dvh: this drives scroll length and must not move */
             className={`relative z-[4] min-h-0 p-0 text-slate-ink ${tone === 'warm' ? 'bg-[#efe6d8]' : 'bg-[#e9e8e5]'}`}>
      <div className={`${tone === 'warm' ? 'statue-frame-warm' : 'statue-frame'} sticky top-0 h-dvh overflow-hidden`}>
        {layout === 'beats' && (split ? (
          <div className="absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
            {/* the same word twice, each clipped to one half, parting as you scroll */}
            <div className={`${WORD_SPLIT_TYPE} left-1/2 text-slate-ink [clip-path:inset(0_50%_0_0)]`} ref={halfL}>{word}</div>
            <div className={`${WORD_SPLIT_TYPE} left-1/2 text-slate-ink [clip-path:inset(0_0_0_50%)]`} ref={halfR}>{word}</div>
          </div>
        ) : (
          <div className={`${WORD} z-[1] text-slate-ink ${frame === 'scene' ? 'lg:text-[30vw]' : ''}`} ref={back} aria-hidden="true">{word}</div>
        ))}

        {model && near && (
          <Canvas className="absolute! inset-0 z-[2]" camera={{ fov: 30, position: [0, 0, 9] }} dpr={DPR}
                  frameloop={live ? 'always' : 'demand'}
                  gl={GL}>
            <Studio tone={tone} />
            <Suspense fallback={null}><Statue progress={progress} url={model} fit={fit} lift={lift} frame={frame} surface={surface} /></Suspense>
          </Canvas>
        )}

        {layout === 'beats' ? (
          <>
            {model && !split && (
              <div className={`${WORD} z-[3] text-transparent [-webkit-text-stroke:1.5px_rgb(20_20_20/0.45)] ${frame === 'scene' ? 'lg:text-[30vw]' : ''}`} ref={front} aria-hidden="true">{word}</div>
            )}

            {/* editorial furniture, like a gallery catalogue */}
            <div className={`${META} top-24 left-gutter hidden lg:left-rail lg:block`}>
              {meta.tl[0]}<br /><span className="text-slate-ink/50">{meta.tl[1]}</span>
            </div>
            <div className={`${META} top-24 right-gutter hidden text-right lg:block`}>
              {meta.tr[0]}<br /><span className="text-slate-ink/50">{meta.tr[1]}</span>
            </div>
            <div className="absolute bottom-10 left-rail z-[4] hidden font-serif text-[17px] leading-[1.25] tracking-[0.02em] text-slate-ink lg:block">
              {meta.bl[0]}<br /><span>{meta.bl[1]}</span>
              <em className="mt-1.5 block not-italic text-slate-ink/50">{meta.bl[2]}</em>
            </div>

            <div className="absolute right-gutter bottom-10 z-[4] flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em]" aria-hidden="true">
              {beats.map((_, i) => (
                <i key={i} className={`block h-0.5 w-[22px] transition-colors duration-400 ${i === beat ? 'bg-slate-ink' : 'bg-slate-ink/20'}`} />
              ))}
              <span className="ml-2.5">{String(beat + 1).padStart(2, '0')} / {String(beats.length).padStart(2, '0')}</span>
            </div>
            {actions}

            <AnimatePresence mode="wait">
              <motion.div
                key={beat}
                className={`statue-beat ${b.side} absolute inset-x-gutter bottom-[90px] z-[4] max-w-none rounded-sm bg-[rgb(246_245_242/0.96)]
                            px-5 py-[18px] text-slate-ink [box-shadow:0_20px_50px_-30px_rgb(0_0_0/0.35)]
                            lg:inset-x-auto lg:top-[20%] lg:bottom-auto lg:max-w-[360px]
                            ${b.side === 'right' ? 'lg:right-gutter lg:text-right' : 'lg:left-rail'}`}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8, ease }}
              >
                <span className="label text-slate-ink/60">{b.kicker}</span>
                <p className="font-serif text-2xl leading-[1.1] lg:text-[clamp(26px,2.5vw,38px)]">{b.text}</p>
                <a className="mt-[14px] inline-block border-b border-slate-ink/25 pb-[3px] font-mono text-[10px] tracking-[0.2em] uppercase text-slate-ink/60"
                   href={read(b.ref)} target="_blank" rel="noopener">{b.ref} · KJV ↗</a>
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <Invitation />
        )}
      </div>
    </section>
  )
}

/* Neutral studio light: a soft room for reflections, a warm key and a cool rim */
function Studio({ tone }) {
  const { gl, scene } = useThree()
  useMemo(() => {
    if (tone === 'warm') { scene.environment = makeWarmEnv(gl); return }
    const pm = new THREE.PMREMGenerator(gl)
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture
    pm.dispose()
  }, [gl, scene, tone])
  return (
    <>
      <hemisphereLight args={tone === 'warm' ? ['#ffeccd', '#3a3024', 0.3] : ['#ffffff', '#9a958e', 0.7]} />
      <directionalLight position={[4, 6, 5]} intensity={tone === 'warm' ? 3.4 : 2.2} color={tone === 'warm' ? '#ffdfa4' : '#fff4e6'} />
      <directionalLight position={[-5, 3, -4]} intensity={tone === 'warm' ? 0.9 : 1.4} color={tone === 'warm' ? '#9fb4e8' : '#e6ecff'} />
      {tone === 'warm' && <directionalLight position={[-1, 4, -7]} intensity={2.6} color="#fff3d6" />}
    </>
  )
}

let draco
function Statue({ progress, url, fit, lift, frame, surface }) {
  const gltf = useLoader(GLTFLoader, url, (l) => {
    l.setMeshoptDecoder(MeshoptDecoder)   // statue.glb is meshopt-compressed, not Draco
    if (!draco) { draco = new DRACOLoader(); draco.setDecoderPath('/draco/') }
    l.setDRACOLoader(draco)
  })
  const { camera } = useThree()
  const { obj, height, radius } = useMemo(() => {
    const o = gltf.scene.clone(true)
    o.traverse((m) => {
      if (m.isLight || m.isCamera) m.removeFromParent()
      if (!m.isMesh) return
      m.material = m.material.clone()
      m.material.metalness = 0
      if (surface === 'alabaster') {
        // the nativity ships untextured, so give it carved-stone shading: a warm ivory that
        // picks up highlights, with the room reflecting strongly enough to show the form
        m.material.color = new THREE.Color('#e4d8c2')
        m.material.roughness = 0.45
        m.material.envMapIntensity = 2.2
      } else {
        m.material.roughness = 0.85
        m.material.envMapIntensity = 0.7
      }
    })
    // Stand it on the floor, centred, 4 units tall
    const box = new THREE.Box3().setFromObject(o)
    const size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3())
    const k = fit / Math.max(size.x, size.y, size.z)
    const g = new THREE.Group()
    o.position.set(-c.x, -box.min.y, -c.z)
    g.add(o); g.scale.setScalar(k)
    return { obj: g, height: size.y * k, radius: 0.5 * size.length() * k }
  }, [gltf, fit, surface])

  const angle = useRef(Math.PI)
  const zoom = useRef(0)
  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const on = (e) => { mouse.current = { x: e.clientX / innerWidth - 0.5, y: e.clientY / innerHeight - 0.5 } }
    addEventListener('pointermove', on)
    return () => removeEventListener('pointermove', on)
  }, [])

  useFrame((_, dt) => {
    // One full turn across the section, eased so it never jumps
    // The scan faces -z, so start the camera on that side (front), then go once round
    const target = Math.PI + progress.current * Math.PI * 2
    angle.current += (target - angle.current) * (reduce ? 1 : 1 - Math.exp(-dt * 5))
    const a = angle.current + mouse.current.x * 0.25
    zoom.current += (progress.current - zoom.current) * (reduce ? 1 : 1 - Math.exp(-dt * 4))
    const p = zoom.current * zoom.current * (3 - 2 * zoom.current) // smoothstep
    const half = THREE.MathUtils.degToRad(camera.fov / 2)

    if (frame === 'scene') {
      // A wide scene: sit back far enough to hold the whole thing through the turn,
      // and look at its middle rather than its top.
      const r = (radius / Math.sin(half)) * THREE.MathUtils.lerp(0.72, 0.92, p)
      const cy = height * 0.52 + lift * 0.15
      camera.position.set(Math.sin(a) * r, cy + height * 0.14 - mouse.current.y * 0.15, Math.cos(a) * r)
      camera.lookAt(0, cy, 0)
      return
    }

    // A standing figure: close portrait at the start, whole figure on its plinth by the end,
    // with the top of the frame kept a fixed distance above the head.
    const r = THREE.MathUtils.lerp(5.4, 10.5, p)
    const cy = height + lift - r * Math.tan(half)
    camera.position.set(Math.sin(a) * r, cy - mouse.current.y * 0.15, Math.cos(a) * r)
    camera.lookAt(0, cy, 0)
  })

  return (
    <group position={[0, -height * 0.02, 0]}>
      <primitive object={obj} />
      {/* soft contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[1.6, 64]} />
        <meshBasicMaterial transparent depthWrite={false} map={shadowTex()} />
      </mesh>
    </group>
  )
}

let _shadow
function shadowTex() {
  if (_shadow) return _shadow
  const c = document.createElement('canvas'); c.width = c.height = 256
  const g = c.getContext('2d'), r = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  r.addColorStop(0, 'rgba(40,36,32,.4)'); r.addColorStop(1, 'rgba(40,36,32,0)')
  g.fillStyle = r; g.fillRect(0, 0, 256, 256)
  _shadow = new THREE.CanvasTexture(c)
  return _shadow
}


/* The closing invitation. Same figure and the same slow turn as the opening, but laid out
   as a call rather than a gallery: a centred heading, scripture either side, a prayer below. */
function Invitation() {
  const v = invitation
  const col = (items, side) => (
    <div className={`absolute top-[30%] z-[4] hidden w-[min(20vw,260px)] lg:block
                     ${side === 'left' ? 'left-rail text-right' : 'right-gutter text-left'}`}>
      {items.map((q, i) => (
        <motion.figure key={q.ref} className={i ? 'mt-7' : ''}
                       initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }} transition={{ duration: 0.9, ease, delay: 0.15 * i }}>
          <blockquote className="font-serif text-[clamp(17px,1.4vw,21px)] leading-[1.25] text-slate-ink">“{q.text}”</blockquote>
          <figcaption className="mt-2 font-mono text-[9px] tracking-[0.2em] uppercase">
            <a className="border-b border-slate-ink/25 pb-[2px] text-slate-ink/55 hover:text-slate-ink"
               href={read(q.ref)} target="_blank" rel="noopener">{q.ref} ↗</a>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  )

  return (
    <>
      {col(v.left, 'left')}
      {col(v.right, 'right')}

      <motion.div
        className="absolute inset-x-gutter top-[88px] z-[4] text-center lg:inset-x-auto lg:left-1/2 lg:w-[min(90vw,640px)] lg:-translate-x-1/2"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease }}
      >
        <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-slate-ink/60">{v.eyebrow}</span>
        <h2 className="mt-2 text-[clamp(44px,7vw,104px)] leading-[0.92] text-slate-ink">
          {v.title[0]} <em className="text-[#8a5a2a]">{v.title[1]}</em>
        </h2>
      </motion.div>

      {/* the lead, the prayer and the call sit together at the foot */}
      <motion.div
        className="absolute inset-x-gutter bottom-6 z-[4] lg:bottom-10 lg:left-1/2 lg:w-[min(92vw,720px)] lg:-translate-x-1/2 lg:inset-x-auto"
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease, delay: 0.2 }}
      >
        <div className="rounded-sm bg-[rgb(255_250_240/0.97)] px-6 py-5 [box-shadow:0_20px_50px_-30px_rgb(60_40_10/0.5)]">
          <p className="hidden text-center text-[15px] leading-[1.5] text-slate-ink/80 lg:block">{v.lead}</p>
          <p className="border-l-2 border-[#8a5a2a] pl-4 font-serif text-[clamp(17px,1.7vw,23px)] leading-[1.25] text-slate-ink lg:mt-4 lg:border-l-0 lg:pl-0 lg:text-center">
            {v.prayer}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3
                          [&_.btn]:bg-[rgb(42_26_8/0.92)] [&_.btn]:border-white/25 [&_.btn:hover]:bg-[rgb(70_44_14/0.95)]">
            <Btn href={read('John 3')}>Read John 3</Btn>
            <Btn href={church} tone="ghost" className="[&]:bg-slate-ink/10 [&]:text-slate-ink [&]:border-slate-ink/25">Find a church near you</Btn>
          </div>
        </div>
      </motion.div>
    </>
  )
}