<script setup>
import { ref, onMounted, render, reactive } from "vue";
import { Entity } from "./enter";

const state = reactive({
  entity: null,
  value: false
})

let loaded = ref(false); // 场景是否准备好
let musucloaded = ref(false); // 音乐是否处理完成

onMounted(async() => {
  // 初始化三维场景
  state.entity = new Entity();
  loaded.value = await state.entity.initCity();
  const play = document.getElementById("play");
  state.entity.initMusic('/music-city/assets/tesihe.mp3')
  function triggerHandler() {
      state.entity.playMusic();
      play.removeEventListener('mousedown', triggerHandler)
  }
  if(loaded.value) play.addEventListener('mousedown', triggerHandler);
})

</script>

<template>
  <!-- <TodoMvc /> -->
  <div>
    <canvas id="webgl"></canvas>
    <div>
      <button id="play">DEMO播放</button>
    </div>
    <div class="loading-wrap" v-if="false">
      <div class="text">资源准备中..</div>
      <div class="loading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  #webgl{
    position: absolute;
    z-index: 10;
  }
  #play{
    position: absolute;
    z-index: 100;
    padding: 10px;
    top: 10px;
    left: 10px;
    cursor: pointer;
  }

   #loading{
    background: rgba(0,0,0,0.2);
    box-shadow: 0px 1px 0px 0 #333;
    width: 100%;
    top: 0;
    height: 40px;
    position: absolute;
    z-index: 100;
    padding: 10px;
    display: flex;
    color: #ddd;
    align-items: center;
    justify-content: space-between;
  }
  #play .option-warp{
    display: flex;
  }
  .option{
    margin-right: 10px;
  }

.loading-wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 99;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(
      circle farthest-corner at center center,
      #666,
      #b5bdca
    );
  }

.loading-wrap .text {
  font-size: 18px;
  color: white;
}

.loading {
  width: 150px;
  height: 15px;
}
.loading span {
  display: inline-block;
  width: 15px;
  height: 100%;
  margin-right: 5px;
  background: lightgreen;
  transform-origin: right bottom;
  animation: load 1s ease infinite;
  -webkit-transform-origin: right bottom;
  -webkit-animation: load 1s ease infinite;
}
.loading span:last-child {
  margin-right: 0px;
}
@keyframes load {
  0% {
    opacity: 1;
    -webkit-transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: rotate(90deg) scale(0.3);
  }
}
@-webkit-keyframes load {
  0% {
    opacity: 1;
    -webkit-transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: rotate(90deg) scale(0.3);
  }
}
.loading span:nth-child(1) {
  animation-delay: 0.13s;
  -webkit-animation-delay: 0.13s;
}
.loading span:nth-child(2) {
  -animation-delay: 0.26s;
  -webkit-animation-delay: 0.26s;
}
.loading span:nth-child(3) {
  animation-delay: 0.39s;
  -webkit-animation-delay: 0.39s;
}
.loading span:nth-child(4) {
  animation-delay: 0.52s;
  -webkit-animation-delay: 0.52s;
}
.loading span:nth-child(5) {
  animation-delay: 0.65s;
  -webkit-animation-delay: 0.65s;
}
</style>
