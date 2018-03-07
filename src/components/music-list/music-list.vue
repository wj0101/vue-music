<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgImgs" ref="bgImgs">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="randomPlay">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <div class="bg-lays" ref="lays"></div>
    <scroll class="list" :data="songs" ref="list" :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll" >
      <div class="song-list-wrapper">
        <singer-list :songs="songs" @select="selectItem" :rank="rank"></singer-list>
      </div>
    </scroll>
  </div>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import SingerList from 'base/singer-list/singer-list'
  import {mapActions} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  export default {
    mixins: [playlistMixin],
    props: {
      bgImg: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      bgImgs () {
        return `background-image:url(${this.bgImg})`
      }
    },
    mounted () {
      this.imgHeight = this.$refs.bgImgs.clientHeight
      this.minNum = -this.imgHeight + 40
      this.$refs.list.$el.style.top = `${this.imgHeight}px`
    },
    components: {
      Scroll,
      SingerList
    },
    data () {
      return {
        scrollY: 0
      }
    },
    created () {
      this.probeType = 3
      this.listenScroll = true
    },
    methods: {
      handlePlaylist (playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      goBack () {
        this.$router.back()
      },
      selectItem (item, index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      randomPlay () {
        this.randonPlayMode({
          list: this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randonPlayMode'
      ])
    },
    watch: {
      scrollY (newVal) {
        let trans = Math.max(this.minNum, newVal)
        let zIndex = 0
        this.$refs.lays.style['transform'] = `translate3d(0,${trans}px,0)`
        let scale = 1
        const percent = Math.abs(newVal / this.imgHeight)
        if (newVal > 0) {
          scale = 1 + percent
          zIndex = 10
        }
        if (newVal < this.minNum) {
          zIndex = 10
          this.$refs.bgImgs.style.paddingTop = 0
          this.$refs.bgImgs.style.height = '40px'
          this.$refs.playBtn.style.display = 'none'
        } else {
          this.$refs.bgImgs.style.paddingTop = '70%'
          this.$refs.bgImgs.style.height = 0
          this.$refs.playBtn.style.display = ''
        }
        this.$refs.bgImgs.style.zIndex = zIndex
        this.$refs.bgImgs.style['transform'] = `scale(${scale})`
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .bg-lays
    background-color :#222
    height 100%;
    position :relative
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
