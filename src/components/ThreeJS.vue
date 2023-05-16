<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const container = ref(null)
let model

var mouseDown = false,
    mouseX = 0,
    mouseY = 0;

function onMouseMove(event) {
    if (!mouseDown) {
        return;
    }

    event.preventDefault();

    var deltaX = event.clientX - mouseX;
    var deltaY = event.clientY - mouseY;
    mouseX = event.clientX;
    mouseY = event.clientY;
    rotateScene(deltaX, deltaY);
}

function onMouseDown(event) {
  event.preventDefault();
    mouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function onMouseUp(event) {
    event.preventDefault();
    mouseDown = false;
}

function addMouseHandler(canvas) {
    canvas.addEventListener('mousemove', function (e) {
        onMouseMove(e);
    }, false);
    canvas.addEventListener('mousedown', function (e) {
        onMouseDown(e);
    }, false);
    canvas.addEventListener('mouseup', function (e) {
        onMouseUp(e);
    }, false);
}

function rotateScene(deltaX, deltaY) {
    model.rotation.y += deltaX / 100;
    model.rotation.x += deltaY / 100;
}


onMounted(async () => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x262626)
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer()

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)

  addMouseHandler(renderer.domElement)

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
  const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 0.5)
  pointLight.position.x = 2
  pointLight.position.y = 3
  pointLight.position.z = 4
  scene.add(pointLight)

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({ color: 0xf2f2f2 })
  material.roughness = 0.4

  const loader = new GLTFLoader();

  await new Promise((resolve, reject) => { 
    loader.load( 'shrek.glb', function ( gltf ) {
      model = gltf.scene
      scene.add( model );
      
      return resolve()

    }, undefined, function ( error ) {
      return
    });
  })

  scene.add( directionalLight )

  // scene.add(cube)

  camera.position.z = 20
  camera.position.y = -7
  animate(renderer, scene, camera, model)
})

function animate(renderer, scene, camera, model) {
  requestAnimationFrame(function () {
    animate(renderer, scene, camera, model)
  })
  
  if(model) {
    // model.rotation.x += 0.01
    model.rotation.y += 0.01 
  }

  renderer.render(scene, camera)
}
</script>

<template>
  <div>
    <div class="3d-container" ref="container"></div>
  </div>
</template>

<style scoped></style>
