<template>
  <scroll class="suggest" :data="searchSong" :pullup="pullup" @scrollToEnd="listMore" ref="suggest" :listenBeforeScroll="listenBeforeScroll" @beforeScrollStart="inputBlur()">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in searchSong" @click="selectitem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getThisName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
  </scroll>
</template>
<script type="text/ecmascript-6">
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'

  const TYPE_SINGER = 'singer'
  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      refresh () {
        this.$refs.suggest.refresh()
      },
      search (query, page, zhida) {
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0)
        this.$http.jsonp(this.apiUrlKey, {
          params: {
            g_tk: 1811452787,
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            w: query,
            zhidaqu: 1,
            catZhida: zhida ? 1 : 0,
            t: 0,
            flag: 1,
            sem: 1,
            aggr: 0,
            perpage: 20,
            n: 20,
            p: page,
            remoteplace: 'txt.mqq.all',
            format: 'jsonp'
          },
          jsonp: 'jsonpCallback'
        })
          .then((response) => {
            this.searchSong = this._getResult(response.data.data)
            this.checkMore(response.data.data)
          })
      },
      searchEnd (query, page, zhida) {
        this.hasMore = true
        this.$http.jsonp(this.apiUrlKey, {
          params: {
            g_tk: 1811452787,
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            w: query,
            zhidaqu: 1,
            catZhida: zhida ? 1 : 0,
            t: 0,
            flag: 1,
            sem: 1,
            aggr: 0,
            perpage: 20,
            n: 20,
            p: page,
            remoteplace: 'txt.mqq.all',
            format: 'jsonp'
          },
          jsonp: 'jsonpCallback'
        })
          .then((response) => {
            this.searchSong = this.searchSong.concat(this._getResult(response.data.data))
            this.checkMore(response.data.data)
          })
      },
      listMore () {
        if (!this.hasMore) {
          return
        }
        this.page ++
        this.searchEnd(this.query, this.page, this.showSinger)
      },
      checkMore (data) {
        const song = data.song
        if (!song.list.length && song.curnum + song.curpage * 20 > song.totalnum) {
          this.hasMore = false
        }
      },
      _getResult (data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({
            ...data.zhida, ...{type: TYPE_SINGER}
          })
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      getThisName (item) {
        if (item.type === TYPE_SINGER) {
          return `${item.singername}~~专辑：${item.albumnum} 单曲：${item.songnum}`
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      getIconCls (item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      selectitem (item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select')
      },
      inputBlur () {
        this.$emit('inputBlur')
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    data () {
      return {
        apiUrlKey: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
        searchSong: [],
        page: 1,
        pullup: true,
        hasMore: true,
        listenBeforeScroll: true
      }
    },
    watch: {
      query () {
        this.search(this.query, this.page, this.showSinger)
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-mediumf
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
