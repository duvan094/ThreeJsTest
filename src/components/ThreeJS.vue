<template>
  <div class="container" ref="container" :class="[{'loaded': loaded}]"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = ref(null)
const loaded = ref(false)

const props = defineProps({
  filePathToModel: String
})

watch(props, async (newProps, oldProps) => {
  const selectedObject = scene.getObjectByName(model.name);
  scene.remove( selectedObject );
  await loadModel()
})

let scene, model, camera, renderer, controls

function initateRenderer() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer( { alpha: true } )
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight)
  })
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

async function loadModel() {
  loaded.value = false
  const loader = new GLTFLoader();

  await new Promise((resolve, reject) => { 
    loader.load( props.filePathToModel, function ( gltf ) {
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

  controls.update()

  renderer.render(scene, camera)
}

onMounted(async () => {

  initateRenderer()
  addLights()
  await loadModel()

  controls = new OrbitControls( camera, renderer.domElement );
  controls.minDistance  = 4
  controls.maxDistance = 50
  controls.autoRotate = true

  camera.position.z = 20
  camera.position.x = 10
  camera.position.y = 10

  controls.update();

  animate()
})
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
