import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

/*
  The glow pass for the sky. Split into its own chunk and loaded only on desktop:
  it is a handful of extra full-screen passes every frame, which phone GPUs —
  fill-rate bound — cannot absorb, and it pulls ~150KB of JS nobody on a phone needs.

  multisampling is 0 on purpose: MSAA on a full-screen target costs 4x the memory
  bandwidth, and mipmapBlur softens the very edges it would have smoothed anyway.
*/
export default function Post() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.55} luminanceThreshold={0.9} luminanceSmoothing={0.15} mipmapBlur />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
