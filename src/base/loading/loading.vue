<template>
  <div class="loading">
    <img src="./loading.gif" width="24" height="24"/>
    <div class="textLoading">{{ title }}</div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入中...'
      }
    }
  }
</script>
<style lang="stylus">
  @import "~common/stylus/variable"

  .loading
    text-align :center
  .textLoading
    line-height :2rem
    font-size :$font-size-small
    color :$color-text-l
</style>
