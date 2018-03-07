<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="playAmin">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyricP && currentLyricP.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyricP">
                <p ref="lyricLine" class="text" v-for="(line,index) in currentLyricP.lines" :class="{'current': currentLineNum === index }">{{ line.txt }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" >
              <i  class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" >
              <i :class="playClass" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" >
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i :class="iconFavorite(currentSong)" @click="favorite(currentSong)" class="icon"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon" >
          <img  width="40" height="40" :src="currentSong.image" :class="playAmin">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i :class="miniClass" @click.stop="togglePlaying"></i>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playlist" ></play-list>
    <audio :src="currentSong.url" ref="audio" @error="errorPlay" @play="readyPlay" @timeupdate="updateTime" @ended="endMusic"></audio>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {playModel} from 'common/js/config'
  import {Base64} from 'js-base64'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll'
  import PlayList from 'components/playlist/playlist'
  import {playerMixin} from 'common/js/mixin'
  import ProgressBar from 'base/progress-bar/progress-bar'

  export default {
    mixins: [playerMixin],
    computed: {
      musicUrl () {
        return this.currentSong.url + this.key + '&guid=7908460496&fromtag=0'
      },
      playAmin () {
        return this.playing ? 'play' : 'play pause'
      },
      playClass () {
        return this.playing ? 'icon-play' : 'icon-pause'
      },
      miniClass () {
        return this.playing ? 'icon-play-mini' : 'icon-pause-mini'
      },
      percent () {
        return this.currentTime / this.currentSong.duration
      },
      ...mapGetters([
        'fullScreen',
        'playing',
        'currentIndex',
        'key'
      ])
    },
    created () {
      this.touch = {}
    },
    methods: {
      onProgressBarChange (percent) {
        const currentTime = this.currentSong.duration * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
        if (this.currentLyricP) {
          this.currentLyricP.seek(currentTime * 1000)
        }
      },
      showPlayList () {
        this.$refs.playlist.show()
      },
      updateTime (event) {
        this.currentTime = event.target.currentTime
      },
      format (int) {
        int = int | 0
        const minute = int / 60 | 0
        const second = this._pad(int % 60)
        return `${minute}:${second}`
      },
      _pad (num) {
        let len = num.toString().length
        while (len < 2) {
          num = '0' + num
          len++
        }
        return num
      },
      middleTouchStart (e) {
        this.touch.initiated = true
        // 用来判断是否是一次移动
        this.touch.moved = false
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        if (!this.touch.moved) {
          this.touch.moved = true
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style['transitionDuration'] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style['transitionDuration'] = 0
      },
      middleTouchEnd () {
        if (!this.touch.moved) {
          return
        }
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style['transitionDuration'] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style['transitionDuration'] = `${time}ms`
        this.touch.initiated = false
      },
      goBack () {
        this.setFullScreen(false)
      },
      open () {
        this.setFullScreen(true)
      },
      togglePlaying () {
        this.setPlayingState(!this.playing)
        if (this.currentLyricP) {
          this.currentLyricP.togglePlay()
        }
      },
      endMusic () {
        if (this.mode === playModel.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop () {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyricP) {
          this.currentLyricP.seek(0)
        }
      },
      next () {
        if (!this.songReady) {
          return
        }
        if (this.playList.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex + 1
          if (index === this.playList.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
          this.songReady = false
        }
      },
      prev () {
        if (!this.songReady) {
          return
        }
        if (this.playList.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playList.length - 1
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
          this.songReady = false
        }
      },
      readyPlay () {
        this.songReady = true
        this.savePlayHistory(this.currentSong)
      },
      errorPlay () {
        this.songReady = true
        setTimeout(() => {
          if (this.playing) {
            this.next()
            this.currentLyricP.seek(0)
          } else {
            return
          }
        }, 3000)
      },
      gitLyric (mid) {
        return new Promise((resolve, reject) => {
          this.$http.jsonp('https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg', {
            params: {
              songmid: mid,
              pcachetime: +new Date(),
              platform: 'yqq',
              hostUin: 0,
              needNewCode: 0,
              g_tk: 67232076,
              inCharset: 'utf-8',
              outCharset: 'utf-8',
              notice: 0,
              format: 'jsonp'
            },
            jsonp: 'jsonpCallback'
          })
            .then((response) => {
              this.discList = Base64.decode(response.data.lyric)
              resolve(this.discList)
            })
        })
      },
      getLyricP () {
        this.gitLyric(this.currentSong.mid).then((lyric) => {
          this.currentLyricP = new Lyric(lyric, this.handlerLyric)
          if (this.playing) {
            this.currentLyricP.play()
          } else if (!this.playing) {
            this.currentLyricP.stop()
          }
        }).catch(() => {
          this.currentLyricP = null
          this.currentLineNum = 0
        })
      },
      handlerLyric ({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN'
      }),
      ...mapActions([
        'savePlayHistory'
      ])
    },
    watch: {
      currentSong (newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          return
        }
        if (!newSong.id) {
          return
        }
        if (this.currentLyricP) {
          this.currentLyricP.stop()
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$refs.audio.play()
          this.getLyricP()
          // this.currentSong.getLyric()
        }, 1000)
      },
      playing (nowPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          nowPlaying ? audio.play() : audio.pause()
        })
      }
    },
    data () {
      return {
        songReady: false,
        currentTime: 0,
        currentLyricP: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: '',
        swiperOption: {
          pagination: '.swiper-pagination',
          paginationClickable: true
        }
      }
    },
    components: {
      Scroll,
      PlayList,
      ProgressBar
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0 auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
