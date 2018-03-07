<template>
  <transition name="slide">
    <music-list :title="title" :bgImg="bgImg" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>
<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/song'
  export default {
    data () {
      return {
        apiUrlLst: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
        songs: [],
        rank: true
      }
    },
    components: {
      MusicList
    },
    computed: {
      ...mapGetters([
        'topList'
      ]),
      title () {
        return this.topList.topTitle
      },
      bgImg () {
        return this.topList.picUrl
      }
    },
    methods: {
      getLists (topid) {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        this.$http.jsonp(this.apiUrlLst, {
          params: {
            g_tk: 436439854,
            platform: 'h5',
            tpl: 3,
            page: 'detail',
            type: 'top',
            topid: topid,
            format: 'jsonp'
          },
          jsonp: 'jsonpCallback'
        })
          .then((response) => {
            this.songs = this._normalizeSong(response.data.songlist)
          })
      },
      _normalizeSong (list) {
        let ret = []
        list.forEach((item) => {
          const musicData = item.data
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    created () {
      this.getLists(this.topList.id)
    }
  }
</script>
<style rel="stylesheet/stylus" scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .slide-enter-active,.slide-leave-active
    transition :all 0.4s ease
  .slide-enter,.slide-leave-to
    transform :translate3d(100%,0,0)
</style>
