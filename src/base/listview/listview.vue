<template>
  <scroll @scroll="scroll"
          :listen-scroll="listenScroll"
          :probe-type="probeType"
          :data="data"
          class="listview"
          ref="listview"
  >
    <ul>
      <li v-for="group in data" class="listView-l" ref="listGroup">
        <h2 class="listView-t">{{ group.title }}</h2>
        <ul class="listView-u2">
          <li v-for="item in group.items" class="listView-l2" @click="selectedItems(item)">
            <img v-lazy="item.avatar" class="listView-ava"/>
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-short"  @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove"
         @touchend.stop>
      <ul>
        <li v-for="(items,index) in shortList" class="itemsList" :data-index="index"
            :class="{'current':currentIndex===index}">
          {{ items }}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h3 class="text-fixed">{{ fixedTitle }}</h3>
    </div>
    <div v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'
  import loading from 'base/loading/loading'

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30
  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1,
        pulldown: true
      }
    },
    created () {
      this.probeType = 3
      this.listenScroll = true
      this.touch = {}
      this.listHeight = []
    },
    components: {
      Scroll,
      loading
    },
    computed: {
      shortList () {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle () {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      selectedItems (item) {
        this.$emit('select', item)
      },
      onShortcutTouchStart (e) {
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
        this.scrollY = -this.listHeight[anchorIndex]
      },
      onShortcutTouchMove (e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
        this.scrollY = -this.listHeight[anchorIndex]
      },
      refresh () {
        this.$refs.listview.refresh()
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      _calculateHeight () {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY (newY) {
        const listHeight = this.listHeight
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff (newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .listView-l
      padding-bottom: 3rem
      .listView-t
        height: 3rem
        line-height: 3rem
        padding-left: 2rem
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
  .listView-l2
    display: flex
    align-items: center
    padding: 2rem 0 0 3rem
    .listView-ava
      width: 5rem
      height: 5rem
      border-radius: 50%
    .name
      margin-left: 20px
      color: $color-text-l
      font-size: $font-size-medium
  .list-short
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 2rem
    padding: 2rem 0
    border-radius: 1rem
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .itemsList
      padding: .3rem
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position :absolute
    left :0
    top :0
    width :100%
    background: $color-highlight-background
    height: 3rem
    line-height: 3rem
    padding-left: 2rem
    font-size: $font-size-small
    color: $color-text-l
</style>
