import { useMemo } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// 3D objects for each part of the story. Each is fitted to roughly 3.4 units and centred.
// To add a new model: put it in public/models, write a component like <Seal/>, add it to RELICS.

const bevel = { bevelEnabled: true, bevelSegments: 8, curveSegments: 48 }

// Model files often ship with their own scene lights and cameras (this Bible had a 1000-intensity
// point light that blew the cover out to white). We light everything ourselves, so drop them.
function stripLights(obj) {
  const extra = []
  obj.traverse((o) => (o.isLight || o.isCamera) && extra.push(o))
  extra.forEach((o) => o.removeFromParent())
}

// Some scans ship a giant backdrop sphere around the subject. It swallows the bounding
// box (and the view), so drop any mesh far larger than the rest of the model.
function stripBackdrop(obj) {
  const meshes = []
  obj.traverse((o) => {
    if (!o.isMesh) return
    const s = new THREE.Box3().setFromObject(o).getSize(new THREE.Vector3())
    meshes.push({ o, d: s.length() })
  })
  if (meshes.length < 2) return
  meshes.sort((a, b) => b.d - a.d)
  if (meshes[0].d > meshes[1].d * 2.5) meshes[0].o.removeFromParent()
}

// Centre an object and scale its largest side to `size`
function fit(obj, size = 3.4) {
  const box = new THREE.Box3().setFromObject(obj)
  const s = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3())
  const k = size / Math.max(s.x, s.y, s.z)
  const g = new THREE.Group()
  obj.position.sub(c)
  g.add(obj)
  g.scale.setScalar(k)
  return g
}

/* The Holy Bible (public/models/bible): leather cover, gold lettering and gilded page edges */
const tex = (url, srgb) => { const t = new THREE.TextureLoader().load(url); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t }
export function Bible() {
  const fbx = useLoader(FBXLoader, '/models/bible/bible.fbx')
  const obj = useMemo(() => {
    const B = '/models/bible/'
    const gold = new THREE.MeshStandardMaterial({
      color: '#e2b65a', metalness: 1, roughness: 0.32,
      normalMap: tex(B + 'gold-scuffed_normal.png'), roughnessMap: tex(B + 'gold-scuffed_roughness_2.webp'), envMapIntensity: 1.4,
    })
    const pages = new THREE.MeshStandardMaterial({ color: '#d9a94a', metalness: 1, roughness: 0.45, envMapIntensity: 1.2 })
    const leather = new THREE.MeshStandardMaterial({
      color: '#3a2016', roughness: 0.55, metalness: 0,
      map: tex(B + 'tmp_eu_thumb_8ffa_f9ff_2.webp', true), bumpMap: tex(B + 'tmp_eu_thumb_2434_cf83.webp'), bumpScale: 0.4,
    })
    const ribbon = new THREE.MeshStandardMaterial({ color: '#7a0d16', roughness: 0.5 })
    const o = fbx.clone(true)
    stripLights(o)
    o.traverse((m) => {
      if (!m.isMesh) return
      const n = m.name.toLowerCase()
      m.material = n.startsWith('text') || n.startsWith('frame') ? gold
        : n.includes('pages') ? pages
          : n.includes('bookmark') ? ribbon
            : leather
    })
    // Stand the book up with its cover facing the viewer
    o.rotation.x = Math.PI / 2
    return fit(o, 3.6)
  }, [fbx])
  return <primitive object={obj} />
}

/* The painted Bible (public/models/vg-bible): keeps its own brushwork textures */
let draco
function useDraco(url) {
  return useLoader(GLTFLoader, url, (l) => {
    if (!draco) { draco = new DRACOLoader(); draco.setDecoderPath('/draco/') }
    l.setDRACOLoader(draco)
  })
}
export function PaintedBible() {
  const gltf = useDraco('/models/vg-bible/bible.glb')
  const obj = useMemo(() => {
    const o = gltf.scene.clone(true)
    stripLights(o)
    stripBackdrop(o)
    // the painting lives in this model's own maps, so leave its materials alone
    return fit(o, 4.2)
  }, [gltf])
  return <primitive object={obj} />
}

/* The Nazarene seal (public/models/seal): menorah, star of David and fish in one, CC-BY-4.0 */
export function Seal() {
  const gltf = useLoader(GLTFLoader, '/models/seal/scene.gltf')
  const obj = useMemo(() => { const o = gltf.scene.clone(true); stripLights(o); return fit(o, 3.6) }, [gltf])
  return <primitive object={obj} />
}

/* Before Jesus: the two tablets of stone */
export function Tablets() {
  const { geo, stone, grooves } = useMemo(() => {
    const w = 1.1, h = 1.7, r = w / 2
    const s = new THREE.Shape()
    s.moveTo(-r, -h / 2); s.lineTo(r, -h / 2); s.lineTo(r, h / 2 - r)
    s.absarc(0, h / 2 - r, r, 0, Math.PI, false)
    s.lineTo(-r, -h / 2)
    const g = new THREE.ExtrudeGeometry(s, { ...bevel, depth: 0.22, bevelThickness: 0.06, bevelSize: 0.05 })
    g.translate(0, 0, -0.11)
    const stone = new THREE.MeshStandardMaterial({ color: '#cdbb98', roughness: 0.9, metalness: 0 })
    const grooves = new THREE.MeshStandardMaterial({ color: '#5a4a32', roughness: 1 })
    return { geo: g, stone, grooves }
  }, [])
  // Five carved lines on each tablet (I–V, VI–X)
  const lines = [0.42, 0.18, -0.06, -0.3, -0.54]
  return (
    <group>
      {[-0.6, 0.6].map((x, i) => (
        <group key={x} position={[x, 0, 0]} rotation={[0, i ? -0.12 : 0.12, 0]}>
          <mesh geometry={geo} material={stone} />
          {lines.map((y) => (
            <mesh key={y} position={[0, y, 0.175]} material={grooves}>
              <boxGeometry args={[0.7 - Math.abs(y) * 0.2, 0.05, 0.02]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

/* Jesus: the ichthys */
function quad(p0, c, p1, t) {
  const u = 1 - t
  return new THREE.Vector2(u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1])
}
export function Fish() {
  const { geos, material } = useMemo(() => {
    const nose = [1.6, 0], t1 = [-1.6, -0.72], t2 = [-1.6, 0.72], up = [0, 1.45], down = [0, -1.45]
    // The two arcs cross at t = 0.8: body = both arcs up to that point, tail = the rest
    const body = [], tail = []
    for (let i = 0; i <= 40; i++) body.push(quad(nose, up, t1, (i / 40) * 0.8))
    for (let i = 40; i >= 0; i--) body.push(quad(nose, down, t2, (i / 40) * 0.8))
    for (let i = 0; i <= 12; i++) tail.push(quad(nose, up, t1, 0.8 + (i / 12) * 0.2))
    for (let i = 12; i >= 0; i--) tail.push(quad(nose, down, t2, 0.8 + (i / 12) * 0.2))
    const opts = { ...bevel, depth: 0.28, bevelThickness: 0.16, bevelSize: 0.08 }
    const geos = [body, tail].map((p) => { const g = new THREE.ExtrudeGeometry(new THREE.Shape(p), opts); g.translate(0, 0, -0.14); return g })
    const material = new THREE.MeshStandardMaterial({ color: '#f4c560', metalness: 1, roughness: 0.12, emissive: '#6a3a00', emissiveIntensity: 0.25 })
    return { geos, material }
  }, [])
  return (
    <group scale={1.1}>
      {geos.map((g, i) => <mesh key={i} geometry={g} material={material} />)}
      <mesh position={[0.95, 0.12, 0.2]} material={material}><sphereGeometry args={[0.07, 24, 16]} /></mesh>
    </group>
  )
}

export const RELICS = { bible: Bible, paintedBible: PaintedBible, tablets: Tablets, fish: Fish, seal: Seal }
