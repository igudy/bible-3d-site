import { useMemo, useRef, useState } from 'react'
import { motion, LayoutGroup } from 'motion/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { characters, credits, disciples, heroStats, library, read } from '../data/content'
import { Anchor, Btn, Reveal, SplitText } from './primitives'
import YouTubeBg from './YouTubeBg'
import CharArt from './CharArt'

gsap.registerPlugin(ScrollTrigger)
const ease = [0.2, 0.7, 0.2, 1]

// Every section shares this frame: full height, generous top padding, and a left
// inset on wide screens that clears the fixed side rail.
const SECTION = 'relative min-h-screen px-gutter pt-[100px] pb-20 lg:pt-[120px] lg:pb-[100px] lg:pl-rail'

/* Giant word behind the 3D object: slides sideways as you scroll through its section (GSAP scrub) */
function Mega({ text, size }) {
  const ref = useRef()
  useGSAP(() => {
    // GSAP moves the wrapper; Framer Motion animates the word inside it, so they never fight over transform
    gsap.fromTo(ref.current, { xPercent: 7 }, {
      xPercent: -7, ease: 'none',
      scrollTrigger: { trigger: ref.current.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    })
  })
  return (
    <div className="mega-wrap" ref={ref} aria-hidden="true">
      <motion.div className="mega" style={{ '--fs': size }} initial={{ opacity: 0, y: '14%' }} whileInView={{ opacity: 1, y: '0%' }}
                  viewport={{ once: true, amount: 0.4 }} transition={{ duration: 1.4, ease }}>
        {text}
      </motion.div>
    </div>
  )
}

/* ---------- Hero: the Bible at the centre, text either side ---------- */
export function Hero() {
  return (
    <section
      id="top" data-world="night" data-stage="center" data-relic="bible"
      className={`${SECTION} grid content-start gap-0 pb-[60vh] lg:grid-cols-2 lg:items-center lg:content-normal lg:gap-[28vw] lg:pb-[24vh]`}
    >
      <div className="shadow max-w-[430px]">
        <Reveal as="span" className="chip">The Holy Bible</Reveal>
        <h1 className="text-[clamp(70px,8.5vw,140px)] leading-[0.9] tracking-[-0.03em]">
          <SplitText text="The" delay={0.2} /> <em className="text-[#dbe6ff]"><SplitText text="Word." delay={0.35} stagger={0.07} /></em>
        </h1>
        <Reveal as="p" className="mt-2.5 max-w-[17ch] font-serif text-[clamp(20px,1.9vw,28px)] leading-[1.1] text-quote" delay={0.7}>
          <em>Thy word is a lamp unto my feet, and a light unto my path.</em>
        </Reveal>
        <Reveal as="p" className="cat mt-2" delay={0.8}>Psalm 119:105</Reveal>
        <Reveal className="actions" delay={0.95}>
          <Btn href="#before">Begin the story</Btn>
          <Btn href="#characters" tone="ghost">Meet the characters</Btn>
        </Reveal>
        <Stats items={heroStats.left} delay={1.1} className="grid-cols-3 gap-[18px]" />
      </div>

      <div className="shadow mt-[30px] max-w-none lg:mt-0 lg:max-w-[300px] lg:justify-self-end lg:text-right">
        <Stats items={heroStats.right} delay={1.2} className="grid-cols-3 lg:mt-0 lg:grid-cols-1" />
        <Reveal className="mt-[30px]" delay={1.4}>
          <span className="label inline-block">Key characters</span>
          <p className="font-serif text-[19px] leading-[1.3] text-ink2">{characters.map((c) => c.name).join(' · ')}</p>
          <a href="#characters" className="mt-2.5 inline-block border-b border-line pb-[3px] font-mono text-[10px] tracking-[0.2em] uppercase">
            See their stories →
          </a>
        </Reveal>
      </div>

      <Reveal className="absolute! right-gutter bottom-[30vh] hidden items-center gap-3 font-mono text-[10px] tracking-[0.24em] uppercase text-ink2 lg:flex" delay={1.6}>
        <span>Scroll</span>
        <i className="scroll-cue block h-[46px] w-px animate-cue bg-linear-to-b from-white to-transparent" />
      </Reveal>
      <Mega text="Bible" size="30vw" />
    </section>
  )
}

function Stats({ items, delay = 0, className = '' }) {
  return (
    <motion.dl className={`mt-[34px] grid gap-[14px] ${className}`} initial="hidden" whileInView="show" viewport={{ once: true }}
               transition={{ staggerChildren: 0.12, delayChildren: delay }}>
      {items.map(([n, label, sub]) => (
        <motion.div key={label} className="border-t border-line pt-2.5"
                    variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }}>
          <dt className="font-serif text-[clamp(34px,3.4vw,52px)] leading-none">{n}</dt>
          <dd className="mt-1 font-mono text-[10px] tracking-[0.2em] uppercase text-ink2">
            {label}{sub && <small className="mt-0.5 block tracking-[0.12em] text-ink3">{sub}</small>}
          </dd>
        </motion.div>
      ))}
    </motion.dl>
  )
}

/* ---------- The three acts ---------- */
function Verse({ text, refText, side }) {
  const ref = useRef()
  useGSAP(() => {
    gsap.fromTo(ref.current, { yPercent: 12 }, {
      yPercent: -12, ease: 'none',
      scrollTrigger: { trigger: ref.current.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    })
  })
  return (
    <figure
      ref={ref}
      className={`verse relative z-[4] m-0 mt-7 w-[min(100%,460px)] self-start rounded-md border border-line
                  bg-white/[0.06] px-[22px] pt-5 pb-4 backdrop-blur-xl
                  ${side === 'right' ? 'lg:mr-[2vw] lg:self-end' : ''}`}
    >
      <Reveal>
        <blockquote className="font-serif text-[clamp(20px,1.7vw,26px)] leading-[1.2]">“{text}”</blockquote>
        <figcaption className="mt-[14px] font-mono text-[10px] tracking-[0.2em] uppercase text-ink3">
          <a className="hover:text-ink" href={read(refText)} target="_blank" rel="noopener">{refText} · KJV ↗</a>
        </figcaption>
      </Reveal>
    </figure>
  )
}

export function Act(c) {
  return (
    <section
      id={c.id} data-world={c.world} data-stage={c.stage} data-relic={c.relic}
      className={`${SECTION} flex min-h-[125vh] flex-col justify-start pb-[70vh] lg:justify-center lg:pb-[30vh]`}
    >
      <div className={`max-w-[460px] ${c.side === 'right' ? 'lg:mr-[2vw] lg:ml-auto' : ''}`}>
        <Reveal as="span" className="label">{c.label}</Reveal>
        <h2 className="text-[clamp(56px,7.5vw,116px)] leading-[0.92]">
          <SplitText text={c.title[0]} />{' '}<em><SplitText text={c.title[1]} delay={0.15} /></em>
        </h2>
        <Reveal as="p" className="cat" delay={0.1}>{c.cat}</Reveal>
        <Reveal as="p" className="lede" delay={0.2}>{c.body}</Reveal>
        <motion.ul className="mt-[30px] grid grid-cols-3 border-t border-line" initial="hidden" whileInView="show"
                   viewport={{ once: true, amount: 0.4 }} transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}>
          {c.moments.map(([b, s]) => (
            <motion.li key={b} className="border-b border-line py-[14px] pr-3"
                       variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}>
              <b className="block font-serif text-[19px] font-normal leading-[1.1] lg:text-2xl">{b}</b>
              <small className="font-mono text-[9px] tracking-[0.16em] uppercase text-ink3">{s}</small>
            </motion.li>
          ))}
        </motion.ul>
      </div>
      <Verse text={c.verse.text} refText={c.verse.ref} side={c.side} />
      <Mega text={c.mega} size={c.megaSize} />
    </section>
  )
}

/* ---------- Characters: full-screen panels that stack as you scroll ---------- */
export function Characters() {
  const root = useRef()
  useGSAP(() => {
    const panels = gsap.utils.toArray('.char-panel', root.current)
    panels.forEach((p, i) => {
      // the picture drifts slower than the page inside each panel
      gsap.fromTo(p.querySelector('.char-media'), { yPercent: -10 }, {
        yPercent: 10, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      if (i === panels.length - 1) return
      // hold this panel while the next one slides up over it, and push it back into the dark
      ScrollTrigger.create({ trigger: p, start: 'top top', pin: true, pinSpacing: false })
      gsap.to(p.querySelector('.char-inner'), {
        scale: 0.88, opacity: 0.25, borderRadius: 18, ease: 'none',
        scrollTrigger: { trigger: panels[i + 1], start: 'top bottom', end: 'top top', scrub: true },
      })
    })
  }, { scope: root })

  return (
    <section id="characters" data-world="night" data-stage="off" ref={root} className="relative min-h-auto p-0">
      <div className="flex min-h-[70vh] flex-col items-start justify-center px-gutter pt-[100px] pb-[60px] lg:pt-[120px] lg:pb-20 lg:pl-rail">
        <Reveal as="span" className="chip">Key characters</Reveal>
        <h2 className="shadow text-[clamp(40px,5vw,72px)] max-w-[16ch]">
          <SplitText text="Ordinary people," /> <em><SplitText text="extraordinary God." delay={0.2} /></em>
        </h2>
        <Reveal as="p" className="lede" delay={0.2}>Shepherds and queens, prophets and fishermen. Scroll through the lives God wrote into His story.</Reveal>
      </div>

      {characters.map((c, i) => (
        <article key={c.id} className="char-panel relative h-screen overflow-hidden bg-[var(--c0)]"
                 style={{ zIndex: 5 + i, '--c0': c.palette[0], '--c1': c.palette[1], '--c2': c.palette[2] }}>
          <div className="char-inner absolute inset-0 origin-top overflow-hidden will-change-[transform,opacity]">
            <div className="char-media absolute inset-x-0 -inset-y-[12%] text-[var(--c2)]">
              {c.youtube ? <YouTubeBg id={c.youtube} start={c.start} />
                : c.image ? <img className="size-full object-cover" src={c.image} alt="" loading="lazy" />
                  : <CharArt symbol={c.symbol} />}
            </div>
            <div className="char-shade absolute inset-0" />
            <div className="absolute -right-[1vw] -bottom-[4vh] font-serif text-[26vw] italic leading-[0.8] whitespace-nowrap text-[var(--c2)] opacity-[0.08] pointer-events-none" aria-hidden="true">
              {c.name}
            </div>

            <motion.div
              className="absolute inset-x-gutter bottom-[8vh] max-w-[470px] text-white lg:inset-x-auto lg:left-rail lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2"
              initial="hidden" whileInView="show" viewport={{ amount: 0.5 }} transition={{ staggerChildren: 0.08 }}
            >
              {[
                <span key="n" className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--c2)]">
                  {String(i + 1).padStart(2, '0')} / {characters.length} · {c.era}
                </span>,
                <h3 key="h" className="mt-3 text-[68px] leading-[0.88] tracking-[-0.02em] lg:text-[clamp(72px,9vw,150px)]">{c.name}</h3>,
                <p key="r" className="mt-1.5 font-serif text-[clamp(22px,2vw,30px)] italic text-[var(--c2)]">{c.role}</p>,
                <p key="b" className="mt-[18px] max-w-[42ch] text-base text-white/80">{c.body}</p>,
                <blockquote key="v" className="my-[22px] border-l border-[var(--c2)] pl-4 font-serif text-xl leading-[1.25]">
                  “{c.verse[0]}”<cite className="mt-2 block font-mono text-[10px] not-italic tracking-[0.2em] uppercase text-white/55">{c.verse[1]}</cite>
                </blockquote>,
                <a key="a" className="btn [&]:bg-white/15 [&]:backdrop-filter-none" href={read(c.passage)} target="_blank" rel="noopener">Read {c.passage} <span className="arr">↗</span></a>,
              ].map((el) => (
                <motion.div key={el.key} variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }}>{el}</motion.div>
              ))}
            </motion.div>
          </div>
        </article>
      ))}
    </section>
  )
}

/* ---------- The Twelve: a horizontal track pinned while you scroll ---------- */
export function Disciples() {
  const root = useRef(), track = useRef()
  useGSAP(() => {
    const dist = () => track.current.scrollWidth - innerWidth
    gsap.to(track.current, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true },
    })
  }, { scope: root })
  return (
    // pinned sections become their own stacking layer, so lift them above the fixed backgrounds
    <section id="disciples" data-world="night" data-stage="off" ref={root} className="relative z-[4] h-screen min-h-0 overflow-hidden p-0">
      <div className="flex h-full w-max items-center gap-[22px] pr-[10vw] pl-gutter lg:pl-rail" ref={track}>
        <div className="mr-[6vw] w-[min(520px,80vw)] flex-none">
          <span className="chip">The Twelve</span>
          <h2 className="text-[clamp(40px,4.6vw,70px)] max-w-[16ch]">Follow me, <em>and I will make you fishers of men.</em></h2>
          <p className="cat">Matthew 4:19 · scroll →</p>
        </div>
        {disciples.map((d, i) => (
          <motion.a
            key={d.name + i} href={read(d.ref)} target="_blank" rel="noopener"
            className="disciple relative flex h-[380px] w-[250px] flex-none flex-col overflow-hidden rounded-lg border
                       border-white/15 bg-linear-160 from-white/10 to-white/[0.02] p-6 backdrop-blur-md lg:h-[420px] lg:w-[300px]"
            whileHover={{ y: -10, rotate: i % 2 ? 1 : -1 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          >
            <span className="font-serif text-[64px] leading-none text-gold">{String(i + 1).padStart(2, '0')}</span>
            <span className="mt-auto font-mono text-[10px] tracking-[0.2em] uppercase text-gold">{d.tag}</span>
            <h3 className="mt-1.5 text-4xl">{d.name}</h3>
            <p className="mt-2.5 text-sm text-ink2">{d.note}</p>
            <span className="mt-4 font-mono text-[10px] tracking-[0.18em] uppercase text-ink3">{d.ref} ↗</span>
          </motion.a>
        ))}
      </div>
    </section>
  )
}

/* ---------- The 66 books as a bookshelf (spine height = chapters) ---------- */
export function Library() {
  const [filter, setFilter] = useState('All')
  const totals = useMemo(() => {
    const t = { Old: [0, 0], New: [0, 0] }
    library.forEach((g) => g.books.forEach(([, ch]) => { t[g.testament][0]++; t[g.testament][1] += ch }))
    return t
  }, [])
  const groups = library.filter((g) => filter === 'All' || g.testament === filter)
  return (
    <section id="books" data-world="night" data-stage="shelf" data-relic="bible" className={`${SECTION} min-h-auto pb-[140px]`}>
      <Reveal as="span" className="chip">The library</Reveal>
      <h2 className="text-[clamp(40px,5vw,72px)] max-w-[16ch]">
        <SplitText text="Sixty-six books," /> <em><SplitText text="one story." delay={0.2} /></em>
      </h2>
      <Reveal as="p" className="lede" delay={0.2}>
        Old Testament: {totals.Old[0]} books, {totals.Old[1]} chapters. New Testament: {totals.New[0]} books, {totals.New[1]} chapters.
        Each spine is as tall as its book is long.
      </Reveal>

      <Reveal className="mt-[30px] inline-flex gap-1 rounded-[40px] border border-line p-1" delay={0.3}>
        {['All', 'Old', 'New'].map((f) => (
          <button
            key={f} onClick={() => setFilter(f)}
            className={`relative z-0 cursor-pointer rounded-[30px] border-0 bg-transparent px-4 py-[9px] font-mono
                        text-[10px] tracking-[0.2em] uppercase ${filter === f ? 'text-[#07090f]' : 'text-ink2'}`}
          >
            {f === 'All' ? 'All 66' : `${f} Testament`}
            {filter === f && <motion.i layoutId="tab" className="absolute inset-0 -z-10 rounded-[30px] bg-gold" />}
          </button>
        ))}
      </Reveal>

      <LayoutGroup>
        <motion.div layout className="mt-14 flex flex-wrap items-end gap-x-[26px] gap-y-[34px]">
          {groups.map((g) => (
            <motion.div layout key={g.testament + g.group} className={`flex flex-col items-start t-${g.testament}`}
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}>
              <div className="flex items-end gap-[3px] border-b-[3px] border-gold/60 pb-2">
                {g.books.map(([name, ch]) => (
                  <motion.a
                    key={name} href={read(name + ' 1')} target="_blank" rel="noopener" title={`${name} · ${ch} chapters`}
                    className="spine flex w-[30px] flex-col items-center justify-between rounded-t-[3px] rounded-b-[1px] pt-2 pb-1.5
                               [box-shadow:inset_-3px_0_0_rgb(0_0_0/0.25),inset_2px_0_0_rgb(255_255_255/0.12)]"
                    style={{ height: 70 + ch * 1.7 }} whileHover={{ y: -14 }}
                  >
                    <span className="font-serif text-sm whitespace-nowrap">{name}</span>
                    <small className="font-mono text-[8px] opacity-75">{ch}</small>
                  </motion.a>
                ))}
              </div>
              <span className="mt-2.5 font-mono text-[10px] tracking-[0.18em] uppercase text-ink3">{g.group}</span>
            </motion.div>
          ))}
        </motion.div>
      </LayoutGroup>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="relative z-[4] flex flex-col items-start gap-5 border-t border-line px-gutter pt-[60px] pb-[70px]
                       font-mono text-[10px] tracking-[0.2em] uppercase text-ink2 lg:pl-rail">
      <span>Scripture quotations from the King James Version</span>
      <div className="flex flex-col gap-1.5 text-[11px] tracking-[0.04em] normal-case text-ink3">
        {credits.map((c) => <span key={c}>{c}</span>)}
      </div>
    </footer>
  )
}
