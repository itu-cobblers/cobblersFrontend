import { useEffect, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { buildScene, drawBoard } from './CafeScene.utils'
import type { CafeSceneRefs } from './CafeScene.types'

/**
 * Owns the Three.js renderer lifecycle and the animation loop. Builds the scene
 * once on mount, redraws the shop board whenever `cafeName` changes, and cleans
 * up on unmount. Returns the ref to attach to the canvas container.
 */
export function useCafeScene(cafeName: string): { wrapRef: RefObject<HTMLDivElement | null> } {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const sceneRef = useRef<CafeSceneRefs | null>(null)
  const popRef = useRef(0) // timestamp of last name change, drives the "pop" animation

  // Build renderer + scene once.
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(wrap.clientWidth, wrap.clientHeight)
    renderer.domElement.style.display = 'block'
    wrap.appendChild(renderer.domElement)

    const built = buildScene()
    sceneRef.current = built
    const { scene, panel, board, bulbs, steamSprites, boardFaceMaterial } = built

    const camera = new THREE.PerspectiveCamera(45, wrap.clientWidth / wrap.clientHeight, 0.1, 50)
    const clock = new THREE.Clock()
    let frame = 0

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
        boardFaceMaterial.emissiveIntensity = 0.4 + (1 - since) * 1.4
      } else {
        panel.scale.setScalar(1)
        boardFaceMaterial.emissiveIntensity = 0.4
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

  // Redraw the board whenever the café name changes.
  useEffect(() => {
    const built = sceneRef.current
    if (!built) return
    drawBoard(built.boardCanvas, cafeName)
    built.boardTexture.needsUpdate = true
    if (cafeName.trim()) popRef.current = performance.now()
  }, [cafeName])

  return { wrapRef }
}
