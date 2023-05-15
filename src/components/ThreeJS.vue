<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'

const container = ref(null)

onMounted(() => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x262626)
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer()
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)

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
  const cube = new THREE.Mesh(geometry, material)
  
  directionalLight.castShadow = true
  directionalLight.castShadow = true
  directionalLight.shadow.camera.near = 10
  directionalLight.shadow.camera.far = 100
  directionalLight.shadow.camera.left = -50
  directionalLight.shadow.camera.right = 50
  directionalLight.shadow.camera.top = 50
  directionalLight.shadow.camera.bottom = -50

  cube.castShadow = true
  cube.recieveShadow = true

  scene.add( directionalLight )

  scene.add(cube)

  camera.position.z = 5

  animate(renderer, scene, camera, cube)
})

function animate(renderer, scene, camera, cube) {
  requestAnimationFrame(function () {
    animate(renderer, scene, camera, cube)
  })

  cube.rotation.x += 0.01
  cube.rotation.y += 0.01 
  renderer.render(scene, camera)
}
</script>

<template>
  <div>
    <div class="3d-container" ref="container"></div>
  </div>
</template>

<style scoped></style>
