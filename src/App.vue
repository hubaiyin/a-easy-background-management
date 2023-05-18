<template>
  <div id="app">
    <router-view></router-view>
    <!-- <register /> -->
  </div>
</template>

<script>
import register from "./components/register.vue";
export default {
  components: { register },
  name: "App",
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
