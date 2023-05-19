<template>
  <div class="container" ref="container" :class="[{'loaded': loaded}]"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = ref(null)
const loaded = ref(false)

let scene, model, camera, renderer, controls

const filePathToModel = ref('shrek-sfw.glb')
const toggleNsfw = ref(false)

function initateRenderer() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer( { alpha: true } )
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)

  // addMouseHandler(renderer.domElement, model)

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight)
  })


/*   document.addEventListener( 'mousewheel', (event) => {
    camera.position.z +=event.deltaY/100;
  }); */

}


function addLights() {
  const ambientLight = new THREE.AmbientLight( 0xffffff, .3 );
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight( 0xffffff, .5 );
  scene.add( directionalLight )

  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.x = 20
  pointLight.position.y = 50
  pointLight.position.z = 20
  scene.add(pointLight)

  const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, .5 );
  scene.add( light );

  scene.fog = new THREE.FogExp2( 0x1b1e2f, .01 )
}

async function toggleNsfwModel() {
  toggleNsfw.value = !toggleNsfw.value
  filePathToModel.value = toggleNsfw.value ? 'shrek-nsfw.glb' : 'shrek-sfw.glb'

  const selectedObject = scene.getObjectByName(model.name);
  scene.remove( selectedObject );
  await loadModel()
}

async function loadModel() {
  loaded.value = false
  const loader = new GLTFLoader();

  await new Promise((resolve, reject) => { 
    loader.load( filePathToModel.value, function ( gltf ) {
      model = gltf.scene
      scene.add( model )
      loaded.value = true
      return resolve()

    }, undefined, function ( error ) {
      return
    });
  })

  model.position.y = 7
}

function animate() {
  requestAnimationFrame(function () {
    animate()
  })

  if(model) {
    // model.rotation.x += 0.01
    model.rotation.y += 0.005 
  }

  renderer.render(scene, camera)
}

onMounted(async () => {
  initateRenderer()
  addLights()
  await loadModel()

  window.addEventListener("keydown", keyStroke);

  controls = new OrbitControls( camera, renderer.domElement );
  controls.minDistance  = 4
  controls.maxDistance = 50;
  camera.position.z = 20
  camera.position.x = 10
  camera.position.y = 10

  controls.update();

  animate()
})

const keyStrokes = ref("")

function keyStroke(event) {
  keyStrokes.value += event.key

  if(keyStrokes.value.length < 4) {
    return 
  }

  const lastFourKeys = keyStrokes.value.substr(keyStrokes.value.length - 4)

  if(lastFourKeys.toLowerCase() === "nsfw") {
    toggleNsfwModel()
    keyStrokes.value = ""
  }
}

</script>

<style scoped lang="scss">

  .container {
    cursor: grab;
    opacity: 0;
    transition: 1s ease-out opacity;

    &.loaded {
      opacity: 1;
    }
  }

  .container:active {
    cursor: grabbing;
  }

</style>
