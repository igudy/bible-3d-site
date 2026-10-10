import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

// clip-path is written from JS each frame; the backdrop itself is keyed off data-world
const WORLD = 'world fixed inset-0 z-[1] overflow-hidden pointer-events-none'

/*
  Full-screen backgrounds for night / sand / gold / fire / ink. Each is clipped to the section(s) that use
  that world, with a slanted edge, so scrolling wipes diagonally from one world to the next.
  (The "air" world is the 3D sky behind everything.)
*/
export default function Worlds() {
  const refs = useRef({})
  const [used, setUsed] = useState(null)

  // Only mount the worlds a section actually asks for. Every other one costs a
  // full-screen 2x canvas (~16MB) and a clip-path rewrite per frame to draw nothing.
  useLayoutEffect(() => {
    setUsed(new Set([...document.querySelectorAll('main section[data-world]')].map((s) => s.dataset.world)))
  }, [])

  useEffect(() => {
    if (!used) return
    const worlds = Object.entries(refs.current).map(([name, el]) => ({
      el, secs: [...document.querySelectorAll(`main section[data-world="${name}"]`)],
    }))
    const all = [...document.querySelectorAll('main section')]
    worlds.forEach((w) => {
      const prev = all[all.indexOf(w.secs[0]) - 1]
      w.first = !prev || ['stone', 'none'].includes(prev.dataset.world)
    })
    let lastY = null, lastW = null
    const clip = () => {
      // nothing moved, so nothing to re-measure
      if (scrollY === lastY && innerWidth === lastW) return
      lastY = scrollY; lastW = innerWidth
      const slant = Math.min(innerWidth * 0.09, 140)
      for (const w of worlds) {
        if (!w.secs.length) continue
        const top = w.secs[0].getBoundingClientRect().top
        const bottom = w.secs[w.secs.length - 1].getBoundingClientRect().bottom
        const visible = bottom + slant > 0 && top - slant < innerHeight
        w.el.style.visibility = visible ? 'visible' : 'hidden'
        // Nothing to wipe from above (page top, or a section with its own solid background): straight edge
        const tl = w.first ? top - slant : top + slant
        if (visible) w.el.style.clipPath = `polygon(0 ${tl}px, 100% ${top - slant}px, 100% ${bottom - slant}px, 0 ${bottom + slant}px)`
      }
    }
    gsap.ticker.add(clip)
    return () => gsap.ticker.remove(clip)
  }, [used])

  if (!used) return (<></>)
  return (
    <>
      {used.has('night') && (
        <div className={WORLD} data-world="night" ref={(el) => (refs.current.night = el)} aria-hidden="true">
          <Particles mode="stars" />
          <i className="bethlehem absolute top-[9vh] right-[16vw] size-1 rounded-full bg-white
                        [box-shadow:0_0_30px_12px_rgb(200_220_255/0.55),0_0_120px_50px_rgb(120_160_255/0.25)]" />
        </div>
      )}
      {used.has('sand') && (
        <div className={WORLD} data-world="sand" ref={(el) => (refs.current.sand = el)} aria-hidden="true">
          <Particles mode="dust" />
          <i className="absolute top-[14vh] right-[22vw] size-[22vmin] rounded-full blur-[2px]
                        bg-[radial-gradient(circle,#fff6dc_0,#ffd894_40%,rgb(255_200_120/0)_70%)]" />
        </div>
      )}
      {used.has('gold') && (
        <div className={WORLD} data-world="gold" ref={(el) => (refs.current.gold = el)} aria-hidden="true">
          <i className="rays absolute top-[40%] left-[38%] size-[220vmax] -translate-x-1/2 -translate-y-1/2 animate-spin-slow" />
        </div>
      )}
      {used.has('fire') && (
        <div className={WORLD} data-world="fire" ref={(el) => (refs.current.fire = el)} aria-hidden="true"><Particles mode="embers" /></div>
      )}
      {used.has('ink') && (
        <div className={WORLD} data-world="ink" ref={(el) => (refs.current.ink = el)} aria-hidden="true"><Particles mode="stars" dim /></div>
      )}
    </>
  )
}

/* Twinkling stars, drifting desert dust, rising Pentecost embers */
function Particles({ mode, dim }) {
  const ref = useRef()
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d'), host = c.parentElement
    const stars = mode === 'stars', dust = mode === 'dust'
    let parts = []
    const spawn = (anywhere) => dust
      ? { x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: 0.5 + Math.random() * 1.6, vx: 0.2 + Math.random() * 0.7, vy: (Math.random() - 0.5) * 0.2, a: 0.15 + Math.random() * 0.4 }
      : stars
      ? { x: Math.random() * innerWidth, y: Math.random() * innerHeight * 0.85, r: Math.random() ** 3 * 1.8 + 0.3, tw: Math.random() * 6.28, sp: 0.5 + Math.random() * 2 }
      : { x: innerWidth * (0.3 + Math.random() * 0.7), y: anywhere ? Math.random() * innerHeight : innerHeight + 10,
          r: 0.6 + Math.random() * 2, vy: 0.3 + Math.random() * 1.2, sway: Math.random() * 6.28, life: 0.4 + Math.random() * 0.6 }
    const size = () => {
      // a backdrop of soft dots gains nothing from retina pixels, and the fill cost
      // is quadratic in dpr — 1.5 instead of 2 is 44% less to paint every frame
      const dpr = Math.min(devicePixelRatio, innerWidth < 900 ? 1.25 : 1.5)
      c.width = innerWidth * dpr; c.height = innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = stars ? (dim ? 90 : 180) : dust ? 120 : 90
      parts = Array.from({ length: innerWidth < 900 ? Math.round(n / 2) : n }, () => spawn(true))
    }
    let t = 0
    const draw = () => {
      if (host.style.visibility !== 'visible') return
      t += 0.016
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      ctx.globalCompositeOperation = 'lighter'
      for (const p of parts) {
        if (dust) {
          if (!reduce) { p.x += p.vx; p.y += p.vy; if (p.x > innerWidth + 5) Object.assign(p, spawn(true), { x: -5 }) }
          ctx.fillStyle = `rgba(255,226,170,${p.a})`
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill()
          continue
        }
        if (stars) {
          const a = (reduce ? 0.8 : 0.35 + 0.65 * Math.abs(Math.sin(t * p.sp + p.tw))) * (dim ? 0.5 : 1)
          ctx.fillStyle = `rgba(220,232,255,${a})`
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill()
          continue
        }
        if (!reduce) { p.y -= p.vy; p.sway += 0.03; p.x += Math.sin(p.sway) * 0.5 }
        if (p.y < -10) Object.assign(p, spawn(false))
        const a = Math.min(1, p.y / innerHeight + 0.15) * p.life
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
        g.addColorStop(0, `rgba(255,200,120,${a})`); g.addColorStop(0.4, `rgba(255,90,0,${a * 0.6})`); g.addColorStop(1, 'rgba(255,40,0,0)')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.283); ctx.fill()
      }
    }
    size()
    addEventListener('resize', size)
    gsap.ticker.add(draw)
    return () => { removeEventListener('resize', size); gsap.ticker.remove(draw) }
  }, [mode])
  return <canvas ref={ref} className="absolute inset-0 size-full" />
}
