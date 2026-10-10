import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { crossBeats, read } from '../data/content'

const ease = [0.2, 0.7, 0.2, 1]

// the catalogue labels in the top corners (hidden on small screens)
const META = 'absolute z-[3] hidden font-mono text-[10px] leading-[1.6] tracking-[0.2em] uppercase text-white lg:block'

/*
  Golgotha, drawn rather than modelled.

  This chapter used to carry a 2MB crucifixion model in its own WebGL context. It was the
  slowest thing on the page on a laptop and never drew at all on iOS, so it is gone. In its
  place the two beats each get a line drawing: three crosses on the hill while He dies, then
  the sealed tomb with the stone rolled across. Stroke-only SVG — it costs a paint, not a
  GPU context, and it scales to any screen without a single byte of download.

    beat 0  three crosses   — the death
    beat 1  the sealed tomb — the burial
*/

// viewBox 0 0 200 260. Three crosses on the hill: the centre one taller and forward.
const CROSS_ART = [
  'M10 242 L190 242',
  'M100 34 L100 242', 'M52 96 L148 96',
  'M42 114 L42 242', 'M16 150 L68 150',
  'M158 114 L158 242', 'M132 150 L184 150',
]
// The tomb: the rock face, the dark of the opening, and the stone rolled clear of it.
const TOMB_ART = [
  'M10 242 L190 242',
  'M52 242 L52 158 A48 48 0 0 1 148 158 L148 242',
  'M80 242 L80 178 A20 20 0 0 1 120 178 L120 242',
  'M168 204 m-36 0 a36 36 0 1 0 72 0 a36 36 0 1 0 -72 0',
  'M168 168 L168 240',
]

function Drawing({ paths }) {
  return (
    // A plain fade, not a stroke-dash draw-on: framer-motion's pathLength leaves
    // stroke-dasharray at "1px 1px" here, which renders the whole thing as an invisible
    // dotted hairline. Fading in is also a good deal cheaper.
    <motion.svg
      viewBox="0 0 200 260" className="cross-art size-full overflow-visible text-white/90"
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {paths.map((d) => (
        /* strokeWidth is in viewBox units on purpose, so the line thickens with the
           drawing instead of staying a hairline on a big screen */
        <path key={d} d={d} fill="none" stroke="currentColor" strokeWidth="1.7"
              strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </motion.svg>
  )
}

export default function CrossAct() {
  const root = useRef()
  const turn = useRef(0)   // 0 → 1 across the whole section
  const [beat, setBeat] = useState(0)
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
        {/* the middle of the chapter: a drawing per beat, with room left for the copy */}
        <div className="absolute inset-0 z-[1] grid place-items-center pt-[190px] pb-[270px] lg:p-0" aria-hidden="true">
          <div className="aspect-[200/260] h-[min(34vh,290px)] lg:h-[min(68vh,580px)]">
            <AnimatePresence mode="wait">
              <motion.div key={b.id} className="size-full">
                <Drawing paths={b.id === crossBeats[0].id ? CROSS_ART : TOMB_ART} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

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
              className="absolute bottom-[210px] left-1/2 w-[min(86vw,620px)] -translate-x-1/2 text-center font-serif
                         text-[15px] leading-[1.35] text-white/60 lg:bottom-[84px] lg:text-[17px]"
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
