<template>
  <div class="tab">
    <ul class="tab-ul">
      <router-link to="/recommend" tag="li" class="tab-item">
        <span class="tab-link">推荐</span>
      </router-link>
      <router-link to="/singer" tag="li" class="tab-item">
        <span class="tab-link">歌手</span>
      </router-link>
      <router-link to="/rank" tag="li" class="tab-item">
        <span class="tab-link">排行</span>
      </router-link>
      <router-link to="/search" tag="li" class="tab-item">
        <span class="tab-link">搜索</span>
      </router-link>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6"></script>
<style lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .tab
    height :4.4rem
  .tab-ul
    width :100%
    height :4.4rem
    display :flex
    .tab-item
      float :left
      flex :1
      text-align center
      line-height 4rem
      font-size :$font-size-medium
      color :$color-text-ll
      .tab-link
        padding-bottom: 5px
      &.router-link-active
        .tab-link
          color: $color-theme
          border-bottom: 2px solid $color-theme

</style>
