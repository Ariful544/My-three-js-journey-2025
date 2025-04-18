import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas#webgl')

// Scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper(10); // Length of axes
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 10); // Size, divisions
scene.add(gridHelper);


/**
 * House
 */
// Temporary sphere
const Box = new THREE.Mesh(
    new THREE.BoxGeometry(2,2,2),
    new THREE.MeshBasicMaterial({ color:"red" })
)
scene.add(Box)

/**
 * Lights
 */

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const timer = new Timer()

const Animate = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(Animate)
}

Animate()