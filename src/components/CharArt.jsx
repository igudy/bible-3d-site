import { motion } from 'motion/react'

// Line-art emblems drawn on as the panel arrives. Used until a real image or video is added.
const PATHS = {
  ark: ['M20 120 L180 120 L160 150 L40 150 Z', 'M50 120 L50 85 L150 85 L150 120', 'M70 85 L100 60 L130 85', 'M10 165 Q40 155 60 165 T110 165 T160 165 T200 165'],
  stars: ['M100 20 L106 44 L130 50 L106 56 L100 80 L94 56 L70 50 L94 44 Z', 'M45 95 L48 106 L59 109 L48 112 L45 123 L42 112 L31 109 L42 106 Z', 'M155 100 L158 111 L169 114 L158 117 L155 128 L152 117 L141 114 L152 111 Z', 'M100 130 L102 138 L110 140 L102 142 L100 150 L98 142 L90 140 L98 138 Z', 'M20 175 L180 175'],
  sea: ['M10 60 Q40 30 70 60 L70 175', 'M190 60 Q160 30 130 60 L130 175', 'M70 175 L130 175', 'M85 140 L100 120 L115 140', 'M100 120 L100 175'],
  wheat: ['M100 180 L100 40', 'M100 60 Q80 50 78 30 Q95 38 100 60', 'M100 60 Q120 50 122 30 Q105 38 100 60', 'M100 90 Q78 80 74 58 Q94 66 100 90', 'M100 90 Q122 80 126 58 Q106 66 100 90', 'M100 120 Q76 110 72 86 Q94 94 100 120', 'M100 120 Q124 110 128 86 Q106 94 100 120'],
  crown: ['M40 140 L30 60 L70 100 L100 40 L130 100 L170 60 L160 140 Z', 'M40 160 L160 160', 'M100 40 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0', 'M75 125 L125 125'],
  sceptre: ['M60 170 L140 50', 'M140 50 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0', 'M130 30 L150 70', 'M120 50 L160 50', 'M70 140 L90 160'],
  flame: ['M100 175 C50 160 50 110 80 80 C80 110 95 115 100 95 C105 70 95 50 110 25 C125 60 160 90 150 135 C145 160 125 175 100 175 Z', 'M100 175 C80 165 80 140 95 125 C100 140 115 140 112 120 C130 135 128 165 100 175 Z'],
  lion: ['M100 100 m-35 0 a35 35 0 1 0 70 0 a35 35 0 1 0 -70 0', 'M100 30 L100 50 M150 50 L136 64 M170 100 L150 100 M150 150 L136 136 M100 170 L100 150 M50 150 L64 136 M30 100 L50 100 M50 50 L64 64', 'M86 95 L90 95 M110 95 L114 95', 'M92 112 Q100 120 108 112'],
  star: ['M100 15 L112 88 L185 100 L112 112 L100 185 L88 112 L15 100 L88 88 Z', 'M100 100 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0'],
  scroll: ['M50 40 L150 40 L150 160 L50 160 Z', 'M40 30 a10 10 0 0 1 0 20 L160 50 a10 10 0 0 0 0 -20 Z', 'M40 150 a10 10 0 0 0 0 20 L160 170 a10 10 0 0 1 0 -20 Z', 'M70 75 L130 75 M70 95 L130 95 M70 115 L120 115 M70 135 L110 135'],
}

export default function CharArt({ symbol }) {
  return (
    <div className="char-art absolute inset-0 grid place-items-center">
      <motion.svg viewBox="0 0 200 200" className="emblem mb-[30vh] w-[60vw] opacity-90 lg:mx-0 lg:mb-0 lg:ml-[30vw] lg:w-[min(62vh,46vw)]" initial="hidden" whileInView="show" viewport={{ amount: 0.4 }}>
        {(PATHS[symbol] || PATHS.star).map((d, i) => (
          <motion.path key={i} d={d} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1, transition: { duration: 2.2, delay: 0.15 * i, ease: [0.4, 0, 0.2, 1] } } }} />
        ))}
      </motion.svg>
    </div>
  )
}
