import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const DEFAULT_NAME = '· name your café ·'

/* Draw the shop-name board onto a canvas (used as a texture). */
function drawBoard(canvas, name) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  // board background — dark stained wood
  ctx.fillStyle = '#33231a'
  ctx.fillRect(0, 0, w, h)

  // subtle wood grain
  ctx.strokeStyle = 'rgba(0,0,0,0.18)'
  ctx.lineWidth = 3
  for (let y = 14; y < h; y += 26) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.bezierCurveTo(w * 0.3, y + 6, w * 0.6, y - 6, w, y + 3)
    ctx.stroke()
  }

  // caramel frame
  ctx.strokeStyle = '#d4915d'
  ctx.lineWidth = 10
  ctx.strokeRect(14, 14, w - 28, h - 28)
  ctx.strokeStyle = 'rgba(232,193,112,0.35)'
  ctx.lineWidth = 2
  ctx.strokeRect(30, 30, w - 60, h - 60)

  // shop name — fitted serif "chalk paint"
  const text = name && name.trim() ? name.trim() : DEFAULT_NAME
  let size = 120
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  do {
    ctx.font = `bold ${size}px Georgia, serif`
    size -= 4
  } while (ctx.measureText(text).width > w - 120 && size > 24)

  ctx.shadowColor = 'rgba(232,193,112,0.55)'
  ctx.shadowBlur = 18
  ctx.fillStyle = '#f7ead2'
  ctx.fillText(text, w / 2, h / 2 + 4)
  ctx.shadowBlur = 0

  // little coffee-cup doodle under the name
  ctx.strokeStyle = '#d4915d'
  ctx.lineWidth = 4
  const cx = w / 2
  const cy = h - 52
  ctx.beginPath()
  ctx.moveTo(cx - 60, cy)
  ctx.lineTo(cx + 60, cy)
  ctx.stroke()
}

function buildScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#1d130d')
  scene.fog = new THREE.Fog('#1d130d', 9, 18)

  const wood = (color, rough = 0.85) =>
    new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.05 })

  // ── floor & walls ──
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 14), wood('#4c3525'))
  floor.rotation.x = -Math.PI / 2
  scene.add(floor)

  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 8), wood('#6e523c', 0.95))
  backWall.position.set(0, 4, -3.2)
  scene.add(backWall)

  // wall shelf with jars
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.08, 0.45), wood('#3a281b'))
  shelf.position.set(-2.2, 2.55, -3)
  scene.add(shelf)
  const jarColors = ['#c8a06a', '#a9c484', '#d98873', '#e8c170']
  jarColors.forEach((c, i) => {
    const jar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.3, 12),
      new THREE.MeshStandardMaterial({ color: c, roughness: 0.4 })
    )
    jar.position.set(-3.4 + i * 0.8, 2.75, -3)
    scene.add(jar)
  })

  // ── counter ──
  const counter = new THREE.Group()
  const body = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.05, 1.0), wood('#5d3f28'))
  body.position.y = 0.525
  counter.add(body)
  // vertical slats on the counter front
  for (let i = 0; i < 9; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.95, 0.03), wood('#6b4a30'))
    slat.position.set(-1.84 + i * 0.46, 0.52, 0.52)
    counter.add(slat)
  }
  const top = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.1, 1.2), wood('#2e1f15', 0.55))
  top.position.y = 1.1
  counter.add(top)
  counter.position.z = 0.4
  scene.add(counter)

  // ── espresso machine ──
  const machine = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({ color: '#8d8378', roughness: 0.35, metalness: 0.6 })
  const mBody = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.55), metal)
  mBody.position.y = 0.28
  machine.add(mBody)
  const mTop = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.6), wood('#2e1f15', 0.4))
  mTop.position.y = 0.59
  machine.add(mTop)
  const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.18, 8), metal)
  spout.position.set(0, 0.12, 0.22)
  machine.add(spout)
  machine.position.set(-1.3, 1.15, 0.35)
  scene.add(machine)

  // ── cups + cake stand ──
  const cupMat = new THREE.MeshStandardMaterial({ color: '#f0e4d0', roughness: 0.5 })
  const cupPositions = [[0.2, 0.45], [0.55, 0.25], [0.9, 0.5]]
  let steamCup = null
  cupPositions.forEach(([x, z], i) => {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.14, 14), cupMat)
    cup.position.set(x, 1.22, z)
    scene.add(cup)
    if (i === 0) steamCup = cup
  })
  const stand = new THREE.Group()
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.04, 20), cupMat)
  plate.position.y = 0.18
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 0.18, 10), cupMat)
  stem.position.y = 0.08
  const cake = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.14, 20),
    new THREE.MeshStandardMaterial({ color: '#c98b62', roughness: 0.8 })
  )
  cake.position.y = 0.28
  stand.add(plate, stem, cake)
  stand.position.set(1.6, 1.15, 0.35)
  scene.add(stand)

  // ── potted plant ──
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.3, 12), wood('#a0522d', 0.9))
  pot.position.set(3.1, 0.15, 1.4)
  scene.add(pot)
  const leafMat = new THREE.MeshStandardMaterial({ color: '#5e7d4a', roughness: 0.9 })
  for (let i = 0; i < 4; i++) {
    const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16 + Math.random() * 0.08, 0), leafMat)
    leaf.position.set(3.1 + (Math.random() - 0.5) * 0.3, 0.45 + i * 0.16, 1.4 + (Math.random() - 0.5) * 0.3)
    scene.add(leaf)
  }

  // ── hanging name board ──
  const board = new THREE.Group()
  const boardCanvas = document.createElement('canvas')
  boardCanvas.width = 1024
  boardCanvas.height = 320
  drawBoard(boardCanvas, '')
  const boardTexture = new THREE.CanvasTexture(boardCanvas)
  boardTexture.colorSpace = THREE.SRGBColorSpace
  const boardFace = new THREE.MeshStandardMaterial({
    map: boardTexture,
    roughness: 0.7,
    emissive: new THREE.Color('#241409'),
    emissiveIntensity: 0.4,
  })
  const boardSide = wood('#2a1b10')
  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(3.0, 0.94, 0.07),
    [boardSide, boardSide, boardSide, boardSide, boardFace, boardSide]
  )
  board.add(panel)
  const ropeMat = new THREE.MeshStandardMaterial({ color: '#c2a878', roughness: 1 })
  ;[-1.25, 1.25].forEach((x) => {
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.0, 6), ropeMat)
    rope.position.set(x, 0.95, 0)
    board.add(rope)
  })
  board.position.set(0, 3.0, -1.4)
  scene.add(board)

  // ── pendant lamps ──
  const lampPositions = [-1.5, 1.5]
  const bulbs = []
  lampPositions.forEach((x) => {
    const lamp = new THREE.Group()
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.6, 6), ropeMat)
    cord.position.y = 0.8
    const shade = new THREE.Mesh(
      new THREE.ConeGeometry(0.28, 0.3, 16, 1, true),
      new THREE.MeshStandardMaterial({ color: '#7a4a26', roughness: 0.6, side: THREE.DoubleSide })
    )
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 10, 10),
      new THREE.MeshStandardMaterial({
        color: '#ffd9a0', emissive: '#ffb45e', emissiveIntensity: 2.2,
      })
    )
    bulb.position.y = -0.1
    const light = new THREE.PointLight('#ffb45e', 8, 6, 1.6)
    light.position.y = -0.15
    lamp.add(cord, shade, bulb, light)
    lamp.position.set(x, 2.6, 0.7)
    scene.add(lamp)
    bulbs.push(light)
  })

  // ── string lights along the back wall ──
  const stringMat = new THREE.MeshStandardMaterial({
    color: '#ffe9b8', emissive: '#e8c170', emissiveIntensity: 1.6,
  })
  for (let i = 0; i < 11; i++) {
    const t = i / 10
    const x = -4 + t * 8
    const y = 4.4 - Math.sin(t * Math.PI) * 0.6
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), stringMat)
    dot.position.set(x, y, -3.0)
    scene.add(dot)
  }

  // ── ambient + key light ──
  scene.add(new THREE.AmbientLight('#5e4630', 1.4))
  const keyLight = new THREE.DirectionalLight('#ffd9ae', 1.1)
  keyLight.position.set(2, 5, 4)
  scene.add(keyLight)

  // ── steam sprites above the first cup ──
  const steamGroup = new THREE.Group()
  const steamMat = new THREE.SpriteMaterial({ color: '#fff5e6', transparent: true, opacity: 0.35 })
  const steamSprites = []
  for (let i = 0; i < 3; i++) {
    const s = new THREE.Sprite(steamMat.clone())
    s.scale.setScalar(0.1)
    steamGroup.add(s)
    steamSprites.push({ sprite: s, offset: i * 0.6 })
  }
  if (steamCup) steamGroup.position.copy(steamCup.position)
  scene.add(steamGroup)

  return { scene, boardCanvas, boardTexture, panel, board, bulbs, steamSprites }
}

export default function CafeScene({ signals = {} }) {
  const cafeName = signals.cafeName ?? ''
  const wrapRef = useRef(null)
  const sceneRef = useRef(null)   // { boardCanvas, boardTexture, ... }
  const popRef = useRef(0)        // timestamp of last name change, drives "pop" animation

  // build renderer + scene once
  useEffect(() => {
    const wrap = wrapRef.current
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(wrap.clientWidth, wrap.clientHeight)
    wrap.appendChild(renderer.domElement)

    const built = buildScene()
    sceneRef.current = built
    const { scene, panel, board, bulbs, steamSprites } = built

    const camera = new THREE.PerspectiveCamera(
      45, wrap.clientWidth / wrap.clientHeight, 0.1, 50
    )

    const clock = new THREE.Clock()
    let frame
    const animate = () => {
      frame = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // gentle camera sway, always looking at the counter
      camera.position.set(Math.sin(t * 0.18) * 0.7, 2.3 + Math.sin(t * 0.3) * 0.06, 6.4)
      camera.lookAt(0, 1.7, 0)

      // board swings softly
      board.rotation.z = Math.sin(t * 0.7) * 0.018

      // name-change pop: scale bounce + glow flash for ~1s
      const since = (performance.now() - popRef.current) / 1000
      if (since < 1) {
        const k = 1 + Math.sin(Math.min(since, 0.5) * Math.PI) * 0.14
        panel.scale.setScalar(k)
        panel.material[4].emissiveIntensity = 0.4 + (1 - since) * 1.4
      } else {
        panel.scale.setScalar(1)
        panel.material[4].emissiveIntensity = 0.4
      }

      // candle-like flicker
      bulbs.forEach((b, i) => {
        b.intensity = 8 + Math.sin(t * 7 + i * 2.3) * 0.5 + Math.sin(t * 13 + i) * 0.3
      })

      // steam drifting upward
      steamSprites.forEach(({ sprite, offset }) => {
        const p = ((t * 0.4 + offset) % 1.8) / 1.8
        sprite.position.set(Math.sin(p * 9) * 0.05, 0.15 + p * 0.6, 0)
        sprite.material.opacity = 0.35 * (1 - p)
        sprite.scale.setScalar(0.08 + p * 0.12)
      })

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const observer = new ResizeObserver(onResize)
    observer.observe(wrap)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      renderer.dispose()
      wrap.removeChild(renderer.domElement)
    }
  }, [])

  // redraw the board whenever the cafe name changes
  useEffect(() => {
    const built = sceneRef.current
    if (!built) return
    drawBoard(built.boardCanvas, cafeName)
    built.boardTexture.needsUpdate = true
    if (cafeName && cafeName.trim()) popRef.current = performance.now()
  }, [cafeName])

  return (
    <div className="cafe-panel">
      <div className="cafe-header">
        <span>Your Café</span>
        {cafeName?.trim() && <span className="cafe-name-tag">“{cafeName.trim()}”</span>}
      </div>
      <div className="cafe-canvas-wrap" ref={wrapRef} />
    </div>
  )
}
