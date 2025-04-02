import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

// --- Constants ---
const ASPECT_RATIO = window.innerWidth / window.innerHeight;
const NEAR_PLANE = 0.1;
const FAR_PLANE = 1000;
const CAMERA_FOV = 75;
const INITIAL_CAMERA_Z = 5;
const BOX_SIZE = 2;

// --- DOM Elements ---
const canvas = document.querySelector("#webgl");
if (!canvas) {
  console.error("Canvas element not found!");
}

// --- Core Three.js Elements ---
let scene, camera, renderer, controls, geometry, material, mesh, clock;
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// --- Initialization ---
function init() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    sizes.width / sizes.height,
    NEAR_PLANE,
    FAR_PLANE
  );
  camera.position.z = INITIAL_CAMERA_Z;

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Clock (Replaces Timer.js)
  clock = new THREE.Clock();

  // Load and add 3D Text
  const textLoader = new FontLoader();
  const texturLoader = new THREE.TextureLoader();
  const matCapMetarial = texturLoader.load("/matCap/mat-2.png");
  const matCapTextMetarial = texturLoader.load("/matCap/mat-4.png");

  textLoader.load("/fonts/helvetiker_regular.typeface.json", function (font) {
    const textGeometry = new TextGeometry("Hello Three.js!", {
      font: font,
      size: 0.8, // Reduced size to fit the scene
      depth: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.03,
      bevelOffset: 0,
      bevelSegments: 3,
    });

    const textMaterial = new THREE.MeshMatcapMaterial({
      matcap: matCapTextMetarial,
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textGeometry.center();
    scene.add(textMesh);

    const donutsGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
    const donutsMaterial = new THREE.MeshMatcapMaterial({
      matcap: matCapMetarial,
    });
    for (let i = 0; i < 300; i++) {
      const donuts = new THREE.Mesh(donutsGeometry, donutsMaterial);
      donuts.position.x = (Math.random() - 0.5)* 10
      donuts.position.y = (Math.random() - 0.5)* 10
      donuts.position.z = (Math.random() - 0.5)* 10
      donuts.rotation.x= Math.random() * Math.PI
      donuts.rotation.y= Math.random() * Math.PI
      const scale = Math.random();
      donuts.scale.set(scale,scale,scale)
      scene.add(donuts);
    }
  });

  // Light for text visibility
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  // Event Listeners
  window.addEventListener("resize", handleResize);
}

// --- Event Handlers ---
function handleResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// --- Animation ---
function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  // Use clock for elapsed time
  const elapsedTime = clock.getElapsedTime();

  // Render the scene
  renderer.render(scene, camera);
}

// --- Start ---
init();
animate();
