<template>
  <div class="m-header">
    <div class="logo"></div>
    <b class="textHeader">Chicken Music</b>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    text-align:center
    color: $color-theme
    position: relative
    height :4.4rem
    .logo
      background :url("logo@2x.png") no-repeat center
      width :3rem
      height 3.2rem
      display: inline-block
      background-size: 3rem 3.2rem
      vertical-align :top
      margin-right :1rem
      margin-top: .6rem
  .mine
    position: absolute
    top: 0
    right: 0
    .icon-mine
      display: block
      padding: 12px
      font-size: 20px
      color: $color-theme
  .textHeader
    display: inline-block
    vertical-align: top
    line-height: 4.4rem
    font-size: $font-size-large
</style>
