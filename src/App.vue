<script setup>
import { ref, onMounted } from 'vue'
import ThreeJs from './components/ThreeJS.vue'
import DemoInfoShrek from './components/DemoInfoShrek.vue'
import DemoInfoCamera from './components/DemoInfoCamera.vue'

const filePathToModel = ref('camera.glb')
const toggleNsfw = ref(false)

async function toggleNsfwModel() {
  toggleNsfw.value = !toggleNsfw.value
  filePathToModel.value = toggleNsfw.value ? 'shrek-nsfw.glb' : 'shrek-sfw.glb'
}

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

onMounted(async () => {
  window.addEventListener("keydown", keyStroke);
})

function changeModel(path) {
  if(filePathToModel.value === path) {
    return
  }

  toggleNsfw.value = false

  filePathToModel.value = path
}

</script>

<template>
  <ThreeJs :filePathToModel="filePathToModel"/>
  <DemoInfoCamera v-if="filePathToModel === 'camera.glb'"/>
  <DemoInfoShrek v-else/>
  <div class="buttons">
    <button class="link-button" @click="changeModel('camera.glb')">
      Show Camera
    </button>
    <button class="link-button" @click="changeModel('shrek-sfw.glb')">
      Show Shrek
    </button>
  </div>
</template>

<style scoped>
.buttons {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  gap: 1rem;
  padding: 1rem;
}
</style>
