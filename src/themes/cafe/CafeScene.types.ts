import type * as THREE from 'three'

export interface SteamSprite {
  sprite: THREE.Sprite
  offset: number
}

/** Long-lived handles the animation loop and board redraw need each frame. */
export interface CafeSceneRefs {
  scene: THREE.Scene
  boardCanvas: HTMLCanvasElement
  boardTexture: THREE.CanvasTexture
  panel: THREE.Mesh
  board: THREE.Group
  /** The board's front face — its emissive intensity flashes on a name change. */
  boardFaceMaterial: THREE.MeshStandardMaterial
  bulbs: THREE.PointLight[]
  steamSprites: SteamSprite[]
}
