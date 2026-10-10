import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { DPR, GL } from './StatueAct'
import * as THREE from 'three'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { AnimatePresence, motion } from 'motion/react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { crossBeats, read } from '../data/content'

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
// Phones get Golgotha as words only. The crucifixion model is 2MB and a whole WebGL
// context for a chapter that reads fine without it, and it was not drawing on iOS anyway.
const NARROW = innerWidth < 900
const ease = [0.2, 0.7, 0.2, 1]

// the catalogue labels in the top corners (hidden on small screens)
const META = 'absolute z-[3] hidden font-mono text-[10px] leading-[1.6] tracking-[0.2em] uppercase text-white lg:block'

/*
  The Cross. The section is ~3 screens tall with a sticky frame and holds two views:

    beat 0  the group faces you          — the death
    (turn)  it rotates 180° as you scroll
    beat 1  you are behind the group     — the burial

  Each view is held while its two columns of scripture sit either side of the figures.
*/
export default function CrossAct() {
  const root = useRef()
  const turn = useRef(0)   // 0 → 1 across the whole section
  const [beat, setBeat] = useState(0)
  const [live, setLive] = useState(false)
  const [near, setNear] = useState(false)

  // only render the 3D while this chapter is on screen
  useEffect(() => {
    const r = root.current.getBoundingClientRect()
    if (r.top < innerHeight * 2 && r.bottom > -innerHeight) setNear(true)
    const hold = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '100% 0px' })
    hold.observe(root.current)
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: '10% 0px' })
    io.observe(root.current)
    return () => { io.disconnect(); hold.disconnect() }
  }, [])

  useGSAP(() => {
    ScrollTriggerSafe(root.current, (p) => {
      turn.current = p
      setBeat(p < 0.5 ? 0 : 1)
    })
  }, { scope: root })

  const b = crossBeats[beat]
  return (
    <section id="cross" data-world="dusk" data-stage="off" ref={root} className="relative z-[4] h-[190svh] min-h-0 bg-[#0a0509] p-0 lg:h-[320svh]">
      <div className="cross-frame sticky top-0 h-dvh overflow-hidden">
        {!NARROW && near && (
          <Canvas className="absolute! inset-0 z-[1]" camera={{ fov: 32, position: [0, 0, 10] }} dpr={DPR}
                  frameloop={live ? 'always' : 'demand'}
                  gl={GL}>
            <Lights />
            {live && <Suspense fallback={null}><Group turn={turn} /></Suspense>}
          </Canvas>
        )}

        {/* the title already names the section on small screens */}
        <div className={`${META} top-24 left-rail`}>The Cross<br /><span className="text-ink3">Death &amp; burial</span></div>
        <div className={`${META} top-24 right-gutter text-right`}>Isaiah 53<br /><span className="text-ink3">Matthew 27</span></div>

        <AnimatePresence mode="wait">
          <motion.div key={b.id} className="cross-copy absolute inset-0 z-[3] pointer-events-none [&_a]:pointer-events-auto"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease }}>
            <motion.div
              className="absolute inset-x-gutter top-[84px] w-auto text-left lg:inset-x-auto lg:top-[13%] lg:left-1/2
                         lg:w-[min(90vw,560px)] lg:-translate-x-1/2 lg:text-center"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}
            >
              <span className="label text-ink3">{b.kicker}</span>
              <h2 className="mt-1 text-[clamp(34px,11vw,52px)] leading-none lg:text-[clamp(44px,5.4vw,84px)]">{b.title}</h2>
            </motion.div>

            {['left', 'right'].map((side, i) => (
              <motion.figure
                key={side}
                className={`absolute z-[1] m-0 inset-x-gutter w-auto text-left lg:inset-x-auto lg:top-[44%] lg:z-auto lg:w-[min(22vw,280px)]
                            ${side === 'left'
                              ? 'bottom-[132px] lg:bottom-auto lg:left-[calc(var(--spacing-gutter)+110px)] lg:text-right'
                              : 'bottom-[52px] lg:bottom-auto lg:right-gutter'}`}
                initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.12 }}
              >
                <blockquote className="font-serif text-base leading-[1.3] text-[#f3eef2] [text-shadow:0_2px_24px_rgb(5_2_8/0.9)] lg:text-[clamp(19px,1.65vw,25px)] lg:leading-[1.22]">
                  “{b[side].text}”
                </blockquote>
                <figcaption className="mt-1.5 font-mono text-[10px] tracking-[0.2em] uppercase lg:mt-3">
                  <a className="border-b border-white/20 pb-[3px] text-ink3 hover:text-white" href={read(b[side].ref)} target="_blank" rel="noopener">
                    {b[side].ref} ↗
                  </a>
                </figcaption>
              </motion.figure>
            ))}

            <motion.p
              className="absolute bottom-[84px] left-1/2 hidden w-[min(86vw,620px)] -translate-x-1/2 text-center font-serif
                         text-[17px] leading-[1.35] text-white/60 lg:block"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease, delay: 0.35 }}
            >
              {b.foot}
              <em className="mt-1.5 block font-mono text-[9px] not-italic tracking-[0.2em] uppercase text-white/40">{b.footRef}</em>
            </motion.p>
          </motion.div>
        </AnimatePresence>

        <div className="absolute right-gutter bottom-[18px] z-[3] flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-white lg:bottom-10" aria-hidden="true">
          {crossBeats.map((x, i) => (
            <i key={x.id} className={`block h-0.5 w-[22px] transition-colors duration-400 ${i === beat ? 'bg-white' : 'bg-white/20'}`} />
          ))}
          <span className="ml-2.5">{String(beat + 1).padStart(2, '0')} / {String(crossBeats.length).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  )
}

// Small helper so the GSAP wiring stays out of the component body
function ScrollTriggerSafe(el, onUpdate) {
  gsap.timeline({
    scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: (st) => onUpdate(st.progress) },
  })
}

/* Cold, low light: a dark sky with one hard key, so the stone reads against the dusk */
function Lights() {
  const { gl, scene } = useThree()
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl)
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.06).texture
    pm.dispose()
  }, [gl, scene])
  return (
    <>
      <hemisphereLight args={['#8fa2c8', '#140d12', 0.5]} />
      <directionalLight position={[5, 7, 6]} intensity={2.4} color="#ffe9cf" />
      <directionalLight position={[-6, 2, -5]} intensity={1.5} color="#7f93c8" />
    </>
  )
}

let dracoLoader
function Group({ turn }) {
  const gltf = useLoader(GLTFLoader, '/models/cross/cross.glb', (loader) => {
    if (!dracoLoader) { dracoLoader = new DRACOLoader(); dracoLoader.setDecoderPath('/draco/') }
    loader.setDRACOLoader(dracoLoader)
  })
  const { camera } = useThree()
  const group = useRef()
  const spin = useRef(0)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const on = (e) => { mouse.current = { x: e.clientX / innerWidth - 0.5, y: e.clientY / innerHeight - 0.5 } }
    addEventListener('pointermove', on)
    return () => removeEventListener('pointermove', on)
  }, [])

  const { obj, height } = useMemo(() => {
    const o = gltf.scene.clone(true)
    o.traverse((m) => {
      if (m.isLight || m.isCamera) m.removeFromParent()
      if (m.isMesh) {
        m.material = m.material.clone()
        m.material.roughness = 0.92
        m.material.metalness = 0
        m.material.envMapIntensity = 0.55
      }
    })
    const box = new THREE.Box3().setFromObject(o)
    const size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3())
    const k = 5 / size.y
    const g = new THREE.Group()
    o.position.set(-c.x, -box.min.y, -c.z)
    g.add(o)
    g.scale.setScalar(k)
    return { obj: g, height: 5 }
  }, [gltf])

  useFrame((_, dt) => {
    // Hold the front view, turn through the middle of the section, hold the back view
    const p = THREE.MathUtils.clamp((turn.current - 0.28) / 0.44, 0, 1)
    const eased = p * p * (3 - 2 * p)
    const target = eased * Math.PI
    spin.current += (target - spin.current) * (reduce ? 1 : 1 - Math.exp(-dt * 6))
    group.current.rotation.y = spin.current + mouse.current.x * 0.12

    // Fill the frame: the cross runs nearly the full height and the plinth crops off the bottom.
    // Pull back a little through the turn so the whole group reads from behind.
    const r = THREE.MathUtils.lerp(7.4, 8.8, eased)
    const halfH = r * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    // Anchor the top of the cross just under the frame edge; the plinth crops off the bottom
    const cy = height + 0.3 - halfH
    camera.position.set(0, cy - mouse.current.y * 0.2, r)
    camera.lookAt(0, cy, 0)
  })

  return (
    <group ref={group}>
      <primitive object={obj} />
    </group>
  )
}
