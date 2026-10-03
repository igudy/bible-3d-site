import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export let lenis = null

// Lenis gives the weighty smooth scroll; GSAP's ticker drives it so ScrollTrigger stays in sync.
export function useSmoothScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    lenis = new Lenis({ lerp: 0.09, anchors: { offset: 0 } })
    // Lenis drives ScrollTrigger. Don't also listen to native scroll: that updates every
    // trigger twice per frame, which stutters badly through the pinned sections.
    lenis.on('scroll', ScrollTrigger.update)
    // Sections below a pinned one are measured before its spacer exists, leaving their
    // start/end stale. Re-measure once the page has settled.
    const refresh = () => ScrollTrigger.refresh()
    const settle = setTimeout(refresh, 400)
    addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)

    const raf = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      clearTimeout(settle); removeEventListener('load', refresh)
      gsap.ticker.remove(raf); lenis.destroy(); lenis = null
    }
  }, [])
}
