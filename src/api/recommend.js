import axios from 'axios'

export function getDiscList () {
  const url = '/api/getDiscList'

  const data = Object.assign({}, {
    g_tk: 1928093487,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    format: 'jsonp'
  }, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getLyric (mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, {
    g_tk: 1928093487,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    format: 'jsonp'
  }, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 67232076,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function gitLyric (mid) {
  this.$http.jsonp('https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg', {
    params: {
      songmid: mid,
      pcachetime: +new Date(),
      platform: 'yqq',
      hostUin: 0,
      needNewCode: 0,
      g_tk: 67232076,
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      format: 'jsonp'
    },
    jsonp: 'jsonpCallback'
  })
    .then((response) => {
      this.discList = response.data.lyric
    })
}

