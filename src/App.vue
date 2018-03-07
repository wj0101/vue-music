<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/header/m-header.vue'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player.vue'
  export default{
    components: {
      MHeader,
      Tab,
      Player
    }
  }
</script>

<style scoped></style>
