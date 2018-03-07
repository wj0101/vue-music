<template>
  <transition name="slide">
    <music-list :songs="songsData" :title="title" :bg-img="bgImg"></music-list>
  </transition>
</template>
<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import MusicList from 'components/music-list/music-list'
  import {createSong} from 'common/js/song'

  export default {
    computed: {
      title () {
        return this.singer.name
      },
      bgImg () {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    created () {
      this.loadSingerData(this.singer.id)
    },
    methods: {
      loadSingerData (singerId) {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        this.$http.jsonp(this.apiUrlsin, {
          params: {
            hostUin: 0,
            needNewCode: 0,
            platform: 'yqq',
            order: 'listen',
            begin: 0,
            num: 1000,
            songstatus: 1,
            singermid: singerId,
            format: 'jsonp'
          },
          jsonp: 'jsonpCallback'
        })
          .then((response) => {
            this.songsData = this._lizeSongs(response.data.data.list)
          })
      },
      _lizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    data () {
      return {
        apiUrlsin: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
        songsData: []
      }
    },
    components: {
      MusicList
    }
  }
</script>
<style lang="stylus" scoped="scoped" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active,.slide-leave-active
    transition :all .3s
  .slide-enter,.slide-leave-to
    transform:translate3d(100%,0,0)
</style>
