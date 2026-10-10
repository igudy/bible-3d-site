import { lazy, Suspense } from 'react'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useActiveSection } from './hooks/useActiveSection'
import { birthBeats, risenBeats, statueBeats } from './data/content'
import { Nav, Rail, Progress, GridLines } from './components/Chrome'
import { Hero, Act, Characters, Disciples, Library, Footer } from './components/Sections'
import Worlds from './components/Worlds'
import StatueAct from './components/StatueAct'


const Stage = lazy(() => import('./components/Stage'))
const CrossAct = lazy(() => import('./components/CrossAct'))

// The two bookends: the same statue and the same turn, opening and closing the story.
const EMMANUEL = {
  id: 'jesus', word: 'Emmanuel', beats: statueBeats,
  meta: {
    tl: ['Jesus', 'God with us'],
    tr: ['Matthew · Mark', 'Luke · John'],
    bl: ['Emmanuel, which being', 'interpreted is, God with us.', 'Matthew 1:23'],
  },
}

// The Birth — no model: the word carries it, sliding the opposite way to Emmanuel.
const BIRTH = {
  id: 'birth', word: 'Birth', beats: birthBeats, model: null, wordDir: 'right', tone: 'warm',
  meta: {
    tl: ['The Birth', 'Bethlehem of Judaea'],
    tr: ['Isaiah 7 · 9', 'Luke 2'],
    bl: ['And she brought forth her firstborn son,', 'and laid him in a manger.', 'Luke 2:7'],
  },
}

// The Resurrection — the word splits open from the middle, like the stone rolled back.
const RISEN = {
  id: 'risen', word: 'Risen', beats: risenBeats, model: null, split: true,
  meta: {
    tl: ['The Resurrection', 'The third day'],
    tr: ['Matthew 28', '1 Corinthians 15'],
    bl: ['He is not here: for he is risen,', 'as he said.', 'Matthew 28:6'],
  },
}

// The closing — the same figure as the opening, laid out as an invitation rather than a gallery.
const COME = {
  id: 'forever', beats: birthBeats, layout: 'invitation', tone: 'warm',
}

export default function App() {
  useSmoothScroll()
  const active = useActiveSection()

  return (
    <>
      {/* No 3D sky any more. It sat at z-0 under the night world's own opaque gradient and
          was switched off entirely for the stone and dusk chapters, so it rendered a
          starfield nobody could see — behind a second starfield the night world draws in 2D. */}
      <Worlds />
      <Suspense fallback={null}><Stage relic={active.relic} pos={active.stage} /></Suspense>
      <GridLines />
      <Nav />
      <Rail active={active.id} />
      <Progress />
      <main>
        {/* Parked while we decide how the Bible itself is introduced:
        <Hero />
        <Act {...acts[0]} />   Before Jesus · "The Promise"
        <Act {...acts[2]} />   After Jesus · "Sent"
        */}
        <StatueAct {...EMMANUEL} />
        <StatueAct {...BIRTH} />
        <Suspense fallback={null}><CrossAct /></Suspense>
        <StatueAct {...RISEN} />
        <Characters />
        <Disciples />
        <Library />
        <StatueAct {...COME} />
      </main>
      <Footer />
    </>
  )
}
