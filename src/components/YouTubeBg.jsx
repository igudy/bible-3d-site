import { useEffect, useRef, useState } from 'react'

/*
  Muted, looping YouTube video used as a background. It's embedded (not downloaded), so it streams
  from YouTube. The iframe only mounts once the panel is near the screen.
*/
export default function YouTubeBg({ id, start = 0 }) {
  const ref = useRef()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setMounted(true), { rootMargin: '100% 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  const params = new URLSearchParams({
    autoplay: 1, mute: 1, loop: 1, playlist: id, controls: 0, playsinline: 1, start,
    rel: 0, modestbranding: 1, disablekb: 1, iv_load_policy: 3, fs: 0,
  })
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-black bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(https://i.ytimg.com/vi/${id}/maxresdefault.jpg)` }}>
      {mounted && (
        <iframe className="absolute top-1/2 left-1/2 w-[max(100vw,177.78vh)] h-[max(100vh,56.25vw)] -translate-x-1/2 -translate-y-1/2 scale-[1.08] border-0 pointer-events-none"
                src={`https://www.youtube-nocookie.com/embed/${id}?${params}`} title="Background video"
                allow="autoplay; encrypted-media; picture-in-picture" tabIndex={-1} aria-hidden="true" />
      )}
    </div>
  )
}
