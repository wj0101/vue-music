<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQuery"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll class="shortcut" :data="searchData" ref="shortcut" :refreshDelay="refreshDelay">
        <div>
          <div class="hot-key">
            <div class="title">热门搜索</div>
            <ul>
              <li class="item" v-for="item in hotKey" @click="addquery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
            </h1>
            <search-list :searches="searchHistory" @select="addquery" @delete="deleteList"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <confirm ref="confirm" text="清空历史记录" @confirm="clearSearchHistory"></confirm>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @inputBlur="blurIn" @select="searchlist" ref="suggest"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import Suggest from 'components/suggest/suggest'
  import {mapActions} from 'vuex'
  import SearchList from 'components/search-list/search-list'
  import Confirm from 'base/confirm/confirm'
  import Scroll from 'base/scroll/scroll'
  import {playlistMixin, searchMixin} from 'common/js/mixin'

  export default {
    mixins: [playlistMixin, searchMixin],
    data () {
      return {
        apiUrlKey: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
        hotKey: []
      }
    },
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    },
    computed: {
      searchData () {
        return this.hotKey.concat(this.searchHistory)
      }
    },
    methods: {
      handlePlaylist (playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.shortcut.refresh()
        this.$refs.suggest.refresh()
      },
      getHotKey () {
        this.$http.jsonp(this.apiUrlKey, {
          params: {
            g_tk: 1811452787,
            notice: 0,
            platform: 'h5',
            needNewCode: 1,
            format: 'jsonp'
          },
          jsonp: 'jsonpCallback'
        })
          .then((response) => {
            this.hotKey = response.data.data.hotkey.slice(0, 10)
          })
      },
      deleteList (item) {
        this.deleteSearchHistory(item)
      },
      showConfirm () {
        this.$refs.confirm.show()
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory'
      ])
    },
    created () {
      this.getHotKey()
    },
    watch: {
      query (newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
