import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from 'three/addons/objects/Sky.js'

// Canvas
const canvas = document.querySelector("#webgl");

// Scene
const scene = new THREE.Scene();

// GUI Controls
const gui = new dat.GUI();

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(5, 3, 7);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lights
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
scene.add(ambientLight);

const directionalsLight = new THREE.DirectionalLight("#86cdff", 1);
directionalsLight.position.set(3, 2, -8);
directionalsLight.castShadow = true;
// Mappings
directionalsLight.shadow.mapSize.width = 256
directionalsLight.shadow.mapSize.height = 256
directionalsLight.shadow.camera.top = 8
directionalsLight.shadow.camera.right = 8
directionalsLight.shadow.camera.bottom = - 8
directionalsLight.shadow.camera.left = - 8
directionalsLight.shadow.camera.near = 1
directionalsLight.shadow.camera.far = 20

scene.add(directionalsLight);

// Orbit Controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const alphaTexture = textureLoader.load("./floor/alpha.jpg");
const floorColorTexture = textureLoader.load(
  "./floor/textures/coast_sand_rocks_02_diff_1k.jpg"
);
const floorARMTexture = textureLoader.load(
  "./floor/textures/coast_sand_rocks_02_arm_1k.jpg"
);
const floorNormalTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg"
);
const floorDisplacementTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg"
);

// floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: alphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: 0.002,
  })
);
floor.rotation.x = -Math.PI * 0.5;

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

scene.add(floor);

gui
  .add(floor.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.001)
  .name("floorDisplacementScale");
gui
  .add(floor.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("floorDisplacementBias");

/*
 ** creating house
 */

const houseGroup = new THREE.Group();
scene.add(houseGroup);

// door light
const doorLight = new THREE.PointLight("#ff7d46", 5);
doorLight.position.set(0, 2.2, 2.5);
houseGroup.add(doorLight);

// walls textures
const wallsColorTexture = textureLoader.load(
  "./walls/castle_brick_broken_06_diff_1k.jpg"
);
const wallsARMTexture = textureLoader.load(
  "./walls/castle_brick_broken_06_arm_1k.jpg"
);
const wallsNormalTexture = textureLoader.load(
  "./walls/castle_brick_broken_06_nor_gl_1k.jpg"
);

// walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallsColorTexture,
    aoMap: wallsARMTexture,
    roughnessMap: wallsARMTexture,
    metalnessMap: wallsARMTexture,
    normalMap: wallsNormalTexture,
  })
);
wallsColorTexture.colorSpace = THREE.SRGBColorSpace;
walls.position.y = 1.25;
houseGroup.add(walls);

// roof textures
const roofColorTexture = textureLoader.load(
  "./roof/ceramic_roof_01_diff_1k.jpg"
);
const roofARMTexture = textureLoader.load("./roof/ceramic_roof_01_arm_1k.jpg");
const roofNormalTexture = textureLoader.load(
  "./roof/ceramic_roof_01_nor_gl_1k.jpg"
);

// roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
);
roofColorTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;

roofColorTexture.colorSpace = THREE.SRGBColorSpace;
roof.position.y = 2.5 + 0.75;
roof.rotation.y = Math.PI * 0.25;
houseGroup.add(roof);

// door textures
const doorColorTexture = textureLoader.load("./door/color.jpg");
const doorAlphaTexture = textureLoader.load("./door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./door/ambientOcclusion.jpg"
);
const doorDisplacementTexture = textureLoader.load("./door/height.jpg");
const doorMetalnessTexture = textureLoader.load("./door/metalness.jpg");
const doorNormalTexture = textureLoader.load("./door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("./door/roughness.jpg");

// door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: doorAlphaTexture,
    transparent: true,
    map: doorColorTexture,
    aoMap: doorAmbientOcclusionTexture,
    metalnessMap: doorMetalnessTexture,
    normalMap: doorNormalTexture,
    roughnessMap: doorRoughnessTexture,
    displacementMap: doorDisplacementTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
  })
);
doorColorTexture.colorSpace = THREE.SRGBColorSpace;

door.position.z = 2 + 0.001;
door.position.y = 1;
houseGroup.add(door);

// bush textures
const bushColorTexture = textureLoader.load(
  "./bush/leaves_forest_ground_diff_1k.jpg"
);
const bushARMTexture = textureLoader.load(
  "./bush/leaves_forest_ground_arm_1k.jpg"
);
const bushNormalTexture = textureLoader.load(
  "./bush/leaves_forest_ground_nor_gl_1k.jpg"
);

// bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMetarial = new THREE.MeshStandardMaterial({
  color: "#ccffcc",
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
});
bushColorTexture.colorSpace = THREE.SRGBColorSpace;

bushColorTexture.repeat.set(2, 1);
bushARMTexture.repeat.set(2, 1);
bushNormalTexture.repeat.set(2, 1);

bushColorTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapS = THREE.RepeatWrapping;

// bush1
const bush1 = new THREE.Mesh(bushGeometry, bushMetarial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.rotation.x = -0.75;
bush1.position.set(0.8, 0.2, 2.2);

// bush2
const bush2 = new THREE.Mesh(bushGeometry, bushMetarial);
bush2.scale.setScalar(0.25);
bush2.rotation.x = -0.75;
bush2.position.set(1.4, 0.1, 2.1);

// bush3
const bush3 = new THREE.Mesh(bushGeometry, bushMetarial);
bush3.scale.setScalar(0.4);
bush3.rotation.x = -0.75;
bush3.position.set(-0.8, 0.1, 2.2);

// bush4
const bush4 = new THREE.Mesh(bushGeometry, bushMetarial);
bush4.scale.setScalar(0.15);
bush4.rotation.x = -0.75;
bush4.position.set(-1, 0.05, 2.6);

houseGroup.add(bush1, bush2, bush3, bush4);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight("#8800ff", 6);
const ghost2 = new THREE.PointLight("#ff0088", 6);
const ghost3 = new THREE.PointLight("#ff0000", 6);
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
scene.add(ghost1, ghost2, ghost3);

/*
 ** creating graves
 */

// grave texture
const graveColorTexture = textureLoader.load(
  "./grave/plastered_stone_wall_diff_1k.jpg"
);
const graveARMTexture = textureLoader.load(
  "./grave/plastered_stone_wall_arm_1k.jpg"
);
const graveNormalTexture = textureLoader.load(
  "./grave/plastered_stone_wall_nor_gl_1k.jpg"
);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMetarial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});
graveColorTexture.colorSpace = THREE.SRGBColorSpace;
graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const grave = new THREE.Mesh(graveGeometry, graveMetarial);
  grave.position.x = x;
  grave.position.z = z;
  grave.position.y = Math.random() * 0.4;

  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  graves.add(grave);

  for(const grave of graves.children){
    grave.castShadow = true;
    grave.receiveShadow = true;
  }
}

/**
 * Sky
 */
const sky = new Sky()
sky.scale.set(100, 100, 100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

/**
 * Fog
 */
// scene.fog = new THREE.Fog('#ff0000', 1, 13)
scene.fog = new THREE.FogExp2('#04343f', 0.1)

// Timer
const timer = new THREE.Clock();

// Resize Event
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Animation Loop
const animate = () => {
  window.requestAnimationFrame(animate);

  // timer.update();
  const elapsedTime = timer.getElapsedTime();

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 5;
  ghost1.position.z = Math.sin(ghost1Angle) * 5;
  ghost1.position.y =
    Math.sin(ghost1Angle) *
    Math.sin(ghost1Angle * 2.34) *
    Math.sin(ghost1Angle * 3.45);

  const ghost2Angle = -elapsedTime * 0.38;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y =
    Math.sin(ghost2Angle) *
    Math.sin(ghost2Angle * 2.34) *
    Math.sin(ghost2Angle * 3.45);
  const ghost3Angle = elapsedTime * 0.23;
  ghost3.position.x = Math.cos(ghost3Angle) * 6;
  ghost3.position.z = Math.sin(ghost3Angle) * 6;
  ghost3.position.y =
    Math.sin(ghost3Angle) *
    Math.sin(ghost3Angle * 2.34) *
    Math.sin(ghost3Angle * 3.45);

  orbitControls.update();
  renderer.render(scene, camera);
};

animate();
