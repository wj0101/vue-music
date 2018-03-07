<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progresstouchstrat"
           @touchmove.prevent="progresstouchmove"
           @touchend="touchmovetouchend">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  const bollWidth = 16
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created () {
      this.touch = {}
    },
    methods: {
      progresstouchstrat (e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progresstouchmove (e) {
        if (!this.touch.initiated) {
          return
        }
        const barwidth = this.$refs.progressBar.clientWidth - bollWidth
        const newX = e.touches[0].pageX - this.touch.startX
        const offetWidth = Math.min(barwidth, Math.max(0, this.touch.left + newX))
        this._offset(offetWidth)
      },
      touchmovetouchend () {
        this.touch.initiated = false
        this._tiggleProgress()
      },
      progressClick (e) {
        const rect = this.$refs.progressBar.offsetLeft
        // const rect = this.$refs.progressBar.getBoundingClientRect()
        // const rectleft = rect.left
        const offsetWidth = e.pageX - rect
        this._offset(offsetWidth)
        this._tiggleProgress()
      },
      _offset (moveWidth) {
        this.$refs.progressBtn.style['transform'] = `translate3d(${moveWidth}px, 0, 0)`
        this.$refs.progress.style.width = `${moveWidth}px`
      },
      _tiggleProgress () {
        const barwidth = this.$refs.progressBar.clientWidth - bollWidth
        const percent = this.$refs.progress.clientWidth / barwidth
        this.$emit('percentChange', percent)
      }
    },
    watch: {
      percent (newPercent) {
        if (newPercent >= 0) {
          const barwidth = this.$refs.progressBar.clientWidth - bollWidth
          const moveWidth = newPercent * barwidth
          this._offset(moveWidth)
        }
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
