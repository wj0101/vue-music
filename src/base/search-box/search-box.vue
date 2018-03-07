<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" :placeholder="placeholder" v-model="query" ref="query">
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>
<script type="text/ecmascript-6">
  import {debounce} from 'common/js/util'
  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data () {
      return {
        query: ''
      }
    },
    methods: {
      clear () {
        this.query = ''
      },
      setquery (query) {
        this.query = query
      },
      blur () {
        this.$refs.query.blur()
      }
    },
    created () {
      this.$watch('query', debounce((newquery) => {
        this.$emit('query', newquery)
      }, 500))
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 .6rem
    height: 4rem
    background: $color-highlight-background
    border-radius: .6rem
    .icon-search
      font-size: 2.4rem
      color: #fff
    .box
      flex: 1
      margin: 0 .5rem
      line-height: 1.8rem
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 1.6rem
      color: #fff
</style>
