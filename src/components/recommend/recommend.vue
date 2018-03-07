<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content"
            :data="discList"
            :pullDownRefresh="pullDownRefreshObj"
            :pullUpLoad="pullUpLoadObj"
            @pullingDown="singListNum"
    >
      <div>
        <v-swiper></v-swiper>
        <div class="v-disclist">
          <h1 class="listTitle">热门歌单</h1>
          <ul>
            <li v-for="item in discList" class="listHot" @click="selectitem(item)">
              <div class="icon">
                <img width="60" height="60" v-lazy="`https://y.gtimg.cn/music/photo_new/T002R150x150M000${item.album_mid}.jpg?max_age=2592000`">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.album_name"></h2>
                <p class="desc" v-html="item.singer_name"></p>
              </div>
            </li>
          </ul>
        </div>
        <slot name="pulldown"></slot>
      </div>
      <div class="loadingBox" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import VSwiper from 'base/slider/slider.vue'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playlistMixin],
    components: {
      VSwiper,
      Scroll,
      Loading
    },
    data () {
      return {
        apiUrls: 'https://c.y.qq.com/v8/fcg-bin/musicmall.fcg',
        discList: [],
        pullDownRefresh: true,
        pullDownRefreshThreshold: 90,
        pullDownRefreshStop: 40,
        pullUpLoad: true,
        pullUpLoadThreshold: 0
      }
    },
    created () {
    },
    methods: {
      singListNum () {
        this.$http.jsonp(this.apiUrls, {
          params: {
            g_tk: 5381,
            loginUin: 0,
            hostUin: 0,
            format: 'jsonp',
            notice: 0,
            platform: 'yqq',
            needNewCode: 0,
            cmd: 'pc_index_new'
          },
          jsonp: 'jsonpCallback'
        })
          .then((response) => {
            this.discList = response.data.data.content[0].albumlist
          })
      },
      selectitem (item) {
        this.$router.push({
          path: `/recommend/${item.singer_id}`
        })
        this.setDisc(item)
      },
      handlePlaylist (playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    mounted () {
      setTimeout(() => {
        this.singListNum()
      }, 20)
    },
    watch: {
      pullDownRefreshObj: {
        handler () {
          this.rebuildScroll()
        },
        deep: true
      },
      pullUpLoadObj: {
        handler () {
          this.rebuildScroll()
        },
        deep: true
      }
    },
    computed: {
      pullDownRefreshObj: function () {
        return this.pullDownRefresh ? {
          threshold: parseInt(this.pullDownRefreshThreshold),
          stop: parseInt(this.pullDownRefreshStop)
        } : false
      },
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .recommend
    position: fixed
    width: 100%
    top: 8.8rem
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      position :relative
  .listTitle
    text-align :center
    padding :5% 0 2% 0
    font-size :$font-size-large
    color: $color-theme
  .listHot
    display :flex
    flex-direction: row
    align-items: center
    padding: 0 20px
    .icon
      padding :10px
      flex: 0 0 60px
    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden
      font-size: $font-size-medium
      .name
        margin-bottom: .5rem
        color: $color-text
      .desc
        color: $color-text-d
</style>
