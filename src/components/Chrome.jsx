import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react'
import { useState } from 'react'
import { railItems } from '../data/content'
import { Btn } from './primitives'

const LINKS = [
  ['#jesus', 'Emmanuel'], ['#birth', 'The Birth'], ['#cross', 'The Cross'],
  ['#risen', 'Risen'], ['#characters', 'Characters'], ['#books', 'The Books'],
]

export function Nav() {
  return (
    <motion.nav
      className="fixed inset-x-0 top-0 z-10 flex h-[72px] items-center justify-between px-gutter"
      initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}
    >
      <a className="flex items-center gap-2.5 font-serif text-2xl tracking-[0.01em]" href="#top">
        <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 0l1.6 8.4L20 10l-8.4 1.6L10 20l-1.6-8.4L0 10l8.4-1.6z" />
        </svg>
        The Bible
      </a>
      <ul className="hidden gap-[34px] font-mono text-[11px] tracking-[0.18em] uppercase lg:flex">
        {LINKS.map(([href, label]) => (
          <li key={href}><a className="opacity-80 transition-opacity hover:opacity-100" href={href}>{label}</a></li>
        ))}
      </ul>
      <Btn href="#forever" size="sm">Read</Btn>
    </motion.nav>
  )
}

export function Rail({ active }) {
  return (
    <ul
      className="rail fixed left-gutter top-1/2 z-[5] hidden -translate-y-1/2 font-mono text-[10px]
                 tracking-[0.2em] uppercase lg:block"
      aria-hidden="true"
    >
      {railItems.map(([id, label]) => (
        <li key={id} className={`flex h-[26px] items-center gap-3 transition-opacity duration-300 ${active === id ? 'on opacity-100' : 'opacity-45'}`}>
          <span className={`transition-opacity duration-300 ${active === id ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
        </li>
      ))}
    </ul>
  )
}

export function Progress() {
  const { scrollYProgress } = useScroll()
  const [pct, setPct] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setPct(Math.round(v * 100)))
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  return (
    <>
      <motion.div
        className="progress-bar fixed inset-x-0 top-0 z-[11] h-0.5 origin-left bg-current opacity-80"
        style={{ scaleX }} aria-hidden="true"
      />
      <div className="pct fixed bottom-[22px] left-1/2 z-[5] -translate-x-1/2 font-mono text-[10px] tracking-[0.2em] opacity-75" aria-hidden="true">
        {pct}%
      </div>
    </>
  )
}

export function GridLines() {
  return (
    <div className="grid fixed inset-0 z-[3] pointer-events-none" aria-hidden="true">
      <div className="absolute inset-x-0 h-px bg-line" style={{ top: 72 }} />
      <div className="absolute inset-y-0 w-px bg-line" style={{ left: 'calc(var(--spacing-gutter) + 90px)' }} />
      <div className="plus absolute size-[11px] -translate-x-1/2 -translate-y-1/2" style={{ top: 72, left: 'calc(var(--spacing-gutter) + 90px)' }} />
      <div className="plus absolute size-[11px] -translate-x-1/2 -translate-y-1/2" style={{ top: 72, left: '66%' }} />
    </div>
  )
}
