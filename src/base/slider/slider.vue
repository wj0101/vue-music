<template>
  <div class="v-slider">
    <swiper :options="swiperOption" ref="mySwiper">
      <swiper-slide class="swiper-slide" v-for="item in bannerData" ref="sliderGroup" :key="item.id">
        <a :href="item.linkUrl" class="needsclick">
          <img :src="item.picUrl" ref="imgHeight" @load="imagesload"/>
        </a>
      </swiper-slide>
    </swiper>
    <div class="swiper-pagination"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import 'swiper/dist/css/swiper.css'

  export default {
    data () {
      return {
        bannerData: [],
        apiUrl: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
        screenWidth: document.body.clientWidth,
        swiperOption: {
          pagination: '.swiper-pagination',
          autoplay: 2500,
          autoplayDisableOnInteraction: false,
          preventClicks: true,
          observer: true,
          observeParents: false
        }
      }
    },
    components: {
      swiper,
      swiperSlide
    },
    created () {
      this.$http.jsonp(this.apiUrl, {
        params: {
          g_tk: 5381,
          format: 'jsonp'
        },
        jsonp: 'jsonpCallback'
      })
        .then((response) => {
          this.bannerData = response.data.data.slider
        })
    },
    mounted () {
      const that = this
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          that.screenWidth = window.screenWidth
          this._setSliderWidthTO()
        })()
      }
    },
    methods: {
      imagesload () {
        this._setSliderWidthTO()
      },
      _setSliderWidthTO () {
        this.children = this.$refs.sliderGroup
        this.imgH = this.$refs.imgHeight
        var height = 0
        let slideHeight = this.screenWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.imgH[i]
          child.style.height = slideHeight / 2.5 + 'px'
          height = slideHeight / 2.5 + 'px'
        }
        this.$refs.mySwiper.$el.style.height = height + 'px'
      },
      imgLoad () {
        if (!this.loaded) {
          this.loaded = true
          this.$refs.slider.refresh()
        }
      }
    },
    watch: {
      screenWidth (val) {
        this.screenWidth = val
      }
    }
  }
</script>
<style lang="stylus">
  .swiper-wrapper
    margin :0 auto
    text-align :center
  .swiper-pagination-bullet
    background-color :#fff
    opacity :.5
  .swiper-pagination-bullet-active
    width :2rem
    border-radius : 1rem
    background-color :#fff
    opacity :.9
  .v-slider
    position:relative
    .swiper-pagination-bullets
      bottom: 10px;
      left: 0;
      width: 100%;
      .swiper-pagination-bullet
        margin: 0 5px;
      .swiper-pagination-bullet-active {
        opacity: 1;
        background: #007aff;
      }
</style>
