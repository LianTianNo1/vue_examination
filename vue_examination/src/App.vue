<template>
  <div id="app">
    <div class="headinfo">
      <div class="head_title">小浪简陋做题</div>
    </div>
    <examination></examination>
  </div>
</template>

<script>
const examination = () => import('@/components/examination.vue')
export default {
  name: "App",
  components: {
    examination
  },
  data() {
    return {

    }
  },
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  margin: 0;
  height: 100vh;
  background-color: #96adc8;
}

#app {
  margin: 0;
  background-color: #9da8b6;
}

.headinfo {
  margin-bottom: 2vh;
  background-color: #f5f7fa;
  box-shadow: 0px 1px 7px #00000033;
}

.head_title {
  color: #336699;
  width: 100%;
  height: 10vh;
  font-weight: bold;
  font-size: 2rem;
  /* padding: 1rem; */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
