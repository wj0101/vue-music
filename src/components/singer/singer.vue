<template>
  <div class="singer" ref="singer">
    <list-view :data="singerData" @select="selectSinger"  ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import ListView from 'base/listview/listview'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10
  export default {
    mixins: [playlistMixin],
    data () {
      return {
        apiUrlsin: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg',
        singerData: []
      }
    },
    components: {
      ListView
    },
    created () {
      this.loadData()
    },
    methods: {
      handlePlaylist (playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      selectSinger (singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      loadData () {
        this.$http.jsonp(this.apiUrlsin, {
          params: {
            channel: 'singer',
            page: 'list',
            key: 'all_all_all',
            pagesize: 100,
            pagenum: 1,
            g_tk: 5381,
            loginUin: 0,
            hostUin: 0,
            notice: 0,
            platform: 'yqq',
            needNewCode: 0,
            format: 'jsonp'
          },
          jsonp: 'jsonpCallback'
        })
          .then((response) => {
            this.singerData = this._jsonSinger(response.data.data.list)
          })
      },
      _jsonSinger (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
              avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
            })
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
            avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
          })
        })
        let hot = []
        let reg = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            reg.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        reg.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(reg)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  }
</script>
<style scoped lang="stylus">
  .singer
    position: fixed;
    width: 100%;
    top: 8.8rem;
    bottom: 0;
</style>
