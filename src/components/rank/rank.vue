<template>
  <div class="rank" ref="rank">
    <scroll class="topList" :data="topList" ref="toplist"
            :pullDownRefresh="pullDownRefreshObj"
            :pullUpLoad="pullUpLoadObj"
            @pullingDown="topListNum">
      <ul>
        <li class="item" v-for="items in topList" @click="selecItem(items)">
          <div class="icon">
            <img v-lazy="items.picUrl" alt="" width="100" height="100">
          </div>
          <ul class="songList">
            <li class="song"  v-for="(song,index) in items.songList">
                <span>{{index + 1}}</span>
                <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <slot name="pulldown"></slot>
      <div class="loadingBox" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playlistMixin],
    components: {
      Scroll,
      Loading
    },
    methods: {
      topListNum () {
        this.$http.jsonp(this.apiUrlLst, {
          params: {
            g_tk: 436439854,
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            format: 'jsonp'
          },
          jsonp: 'jsonpCallback'
        })
          .then((response) => {
            this.topList = response.data.data.topList
          })
      },
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.rank.style.bottom = bottom
        this.$refs.toplist.refresh()
      },
      selecItem (item) {
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.setTopList(item)
      },
      ...mapMutations({
        setTopList: 'SET_TOP_LIST'
      })
    },
    computed: {
      pullDownRefreshObj () {
        return this.pullDownRefresh ? {
          threshold: parseInt(this.pullDownRefreshThreshold),
          stop: parseInt(this.pullDownRefreshStop)
        } : false
      },
      pullUpLoadObj () {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      }
    },
    created () {
      this.topListNum()
    },
    data () {
      return {
        apiUrlLst: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
        topList: [],
        pullDownRefresh: true,
        pullDownRefreshThreshold: 90,
        pullDownRefreshStop: 40,
        pullUpLoad: true,
        pullUpLoadThreshold: 0
      }
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
    }
  }
</script>
<style rel="stylesheet/stylus" scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .rank
    position :fixed;
    top :8.8rem;
    width 100%;
    bottom :0
    .topList
      height 100%;
      overflow :hidden;
      position: relative;
      .item
        display :flex;
        margin :0 2rem 1rem 2rem
        height 10rem
        &:last-child
          padding-bottom: 2rem
        .icon
          width 10rem;
          height 10rem;
          flex: 0 0 10rem
        .songList
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 2rem
          height: 10rem
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 2.6rem
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
