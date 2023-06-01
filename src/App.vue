<script setup>
import { ref, onMounted } from 'vue'
import ThreeJs from './components/ThreeJS.vue'
import DemoInfo from './components/DemoInfo.vue'


const filePathToModel = ref('shrek-sfw.glb')
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

</script>

<template>
  <ThreeJs :filePathToModel="filePathToModel"/>
  <DemoInfo />
</template>

<style scoped></style>
