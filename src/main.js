// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import FastClick from 'fastclick'
import router from './router'
import 'common/stylus/index.styl'
import VueResource from 'vue-resource'
import VueLazyload from 'vue-lazyload'
import store from './store'
import VueAwesomeSwiper from 'vue-awesome-swiper'

Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})
Vue.use(VueResource)
Vue.use(VueAwesomeSwiper)

FastClick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
