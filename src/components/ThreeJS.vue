<template>
  <div class="container" ref="container"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import {addMouseHandler, setModel} from '../utils/rotateModel'

const container = ref(null)

let scene, model, camera, renderer

function initateRenderer() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x262626)
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)

  addMouseHandler(renderer.domElement, model)

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  camera.position.z = 20
  camera.position.y = -7
}

function addLights() {
  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  scene.add( directionalLight )

  const pointLight = new THREE.PointLight(0xffffff, 0.5)
  pointLight.position.x = 2
  pointLight.position.y = 3
  pointLight.position.z = 4
  scene.add(pointLight)
}

async function loadModel() {
  const loader = new GLTFLoader();

  await new Promise((resolve, reject) => { 
    loader.load( 'shrek.glb', function ( gltf ) {
      model = gltf.scene
      scene.add( model );
      setModel(model)
      return resolve()

    }, undefined, function ( error ) {
      return
    });
  })
  
}

function animate() {
  requestAnimationFrame(function () {
    animate()
  })
  
  if(model) {
    // model.rotation.x += 0.01
    model.rotation.y += 0.01 
  }

  renderer.render(scene, camera)
}

onMounted(async () => {
  initateRenderer()
  addLights()
  await loadModel()

  animate()
})

</script>

<style scoped>

  .container {
    cursor: grab;
  }

  .container:active {
    cursor: grabbing;
  }

</style>
