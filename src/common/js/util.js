function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (arr) {
  let _arr = arr.slice()
  for (var i = 1; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

// 节流数据做延迟
export function debounce (fun, delay) {
  let time
  return function (...args) {
    if (time) {
      clearTimeout(time)
    }
    time = setTimeout(() => {
      fun.apply(this, args)
    }, delay)
  }
}
