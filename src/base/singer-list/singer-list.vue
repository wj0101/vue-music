<template>
  <div class="singer-list" ref="songs">
    <ul>
      <li v-for="(song,index) in songs" class="item" @click="selectIndex(song,index)">
        <div class="rank" v-show="rank">
          <span :class="getRankIcon(index)">{{ getRankText(index)}}</span>
        </div>
        <div class="content">
          <h1 class="name">{{ song.name }}</h1>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapMutations} from 'vuex'

  export default {
    props: {
      songs: {
        type: Array,
        default: []
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      selectIndex (item, index) {
        this.$emit('select', item, index)
      },
      getDesc (song) {
        return `${song.singer} 。${song.album}`
      },
      loadSingerKey () {
        this.$http.jsonp('http://base.music.qq.com/fcgi-bin/fcg_musicexpress.fcg', {
          params: {
            json: 3,
            g_tk: 938407465,
            loginUin: 0,
            hostUin: 0,
            guid: 7908460496,
            notice: 0,
            platform: 'yqq',
            needNewCode: 0,
            format: 'jsonp'
          },
          jsonp: 'jsonpCallback'
        })
          .then((response) => {
            this.vKey = response.data.key
            this.setKey(this.vKey)
          })
      },
      getRankIcon (index) {
        if (index <= 2) {
          return `icon icon${index}`
        } else {
          return `text`
        }
      },
      getRankText (index) {
        if (index > 2) {
          return index + 1
        }
      },
      ...mapMutations({
        setKey: 'SET_KEY',
        vKey: 0
      })
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer-list
    .item
      display :flex;
      height 6.4rem;
      font-size 1.4rem
      align-items: center;
      .rank
        flex :0 0 2.5rem;
        width :2.5rem;
        height 2.4rem;
        text-align :center;
        margin-right : 2rem;
        .icon
          display: inline-block;
          width :2.5rem;
          height :2.4rem;
          background-size :2.5rem 2.4rem;
          &.icon0
            background-image :url("first@2x.png")
          &.icon1
            background-image :url("second@2x.png")
          &.icon2
            background-image :url("third@2x.png")
          .text
            color :$color-theme
            font-size :$font-size-large
      .content
        fiex:1;
        line-height :2rem;
        overflow :hidden
        .name
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          color: #fff;
        .desc
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          margin-top: 4px;
          color: rgba(255,255,255,0.3);
</style>
