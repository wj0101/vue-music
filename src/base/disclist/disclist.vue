<template>
  <div class="v-disclist">
    <h1 class="listTitle">热门歌单</h1>
    <ul>
      <li v-for="item in discList" class="listHot">
        <div class="icon">
          <img width="60" height="60" :src="item.imgurl">
        </div>
        <div class="text">
          <h2 class="name" v-html="item.creator.name"></h2>
          <p class="desc" v-html="item.dissname"></p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        apiUrls: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
        discList: []
      }
    },
    created () {
      this.$http.jsonp(this.apiUrls, {
        params: {
          rnd: Math.random(),
          g_tk: 5381,
          loginUin: 0,
          hostUin: 0,
          notice: 0,
          platform: 'yqq',
          needNewCode: 0,
          categoryId: 10000000,
          sortId: 5,
          sin: 0,
          ein: 29,
          format: 'jsonp'
        },
        jsonp: 'jsonpCallback'
      })
        .then((response) => {
          this.discList = response.data.data.list
        })
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .listTitle
    text-align :center
    padding :5% 0 2% 0
    font-size :$font-size-large
    color: $color-theme
  .listHot
    display :flex
    flex-direction: row
    align-items: center
    padding: 0 20px 20px 20px
    .icon
      padding :3% 3% 3% 0
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
