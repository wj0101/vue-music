<template>
  <transition name="slider">
    <music-list :title="title" :bgImg="`https://y.gtimg.cn/music/photo_new/T002R150x150M000${this.disc.album_mid}.jpg?max_age=2592000`" :songs="songs"></music-list>
  </transition>
</template>
<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/song'
  export default {
    computed: {
      title () {
        return this.disc.singer_name
      },
      ...mapGetters([
        'disc'
      ])
    },
    components: {
      MusicList
    },
    methods: {
      getSongList (mid) {
        if (!this.disc.album_id) {
          this.$router.push('/recommend')
          return
        }
        this.$http.jsonp('https://c.y.qq.com/v8/fcg-bin/musicmall.fcg', {
          params: {
            cmd: 'get_album_buy_page',
            albumid: mid,
            p: Math.random(),
            g_tk: 5381,
            loginUin: 0,
            hostUin: 0,
            format: 'jsonp',
            notice: 0,
            platform: 'yqq',
            needNewCode: 0
          },
          jsonp: 'jsonpCallback'
        })
          .then((response) => {
            this.songs = this._lizeSongs(response.data.data.songlist)
          })
      },
      _lizeSongs (list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.albumid && musicData.songid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    created () {
      this.getSongList(this.disc.album_id)
    },
    data () {
      return {
        songs: []
      }
    }
  }
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  .slider-enter-active,.slider-leave-active
    transition :all 0.3s

  .slider-enter,.slider-leave-to
    transform :translate3D(100%,0,0)
</style>
