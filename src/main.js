// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import md5 from 'blueimp-md5'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

// server function
const promiseXHR = (url, data, type) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open(type, url, true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(JSON.parse(xhr.responseText))
        }
      }
    }
    xhr.send(data)
  })
}

// timeArr: [第一根k线时间,第二根k线时间,第三根k线时间]
// status: 0 状态初始化 1 准备建仓 2 已建仓 3 平仓
let obj = {
  timeArr: [],
  firstK: [],
  secondK: [],
  nowK: [],
  ticker: {},
  type: '',
  status: 0
}
// 初始化
function init () {
  const since = new Date().getTime() - 45 * 60 * 1000
  // 获取klines数据
  promiseXHR('/okcoin/v1/future_kline.do?symbol=ltc_usd&type=15min&contract_type=quarter&size=3&since=' + since, null, 'GET').then(value => {
    const klines = value
    obj.timeArr[0] = klines[0][0]
    obj.timeArr[1] = klines[1][0]
    obj.timeArr[2] = klines[2][0]
    obj.firstK = klines[0]
    obj.secondK = klines[1]
    obj.nowK = klines[2]
  })
  // 获取ticker数据
  promiseXHR('/okcoin/v1/future_ticker.do?symbol=ltc_usd&contract_type=this_week', null, 'GET').then(value => {
    obj.ticker = value
  })
  // 获取用户信息
  const hash = md5('api_key=4a7a5dee-035f-4006-a273-3c76accdde62&secret_key=EA6735C6936741AED5B2BC32A3B0EDCA').toUpperCase()
  const paramas = 'api_key=4a7a5dee-035f-4006-a273-3c76accdde62&sign=' + hash
  promiseXHR('/okcoin/v1/future_userinfo.do?', paramas, 'POST').then(value => {
    obj.userInfo = value
  })
  console.log(obj)
}
// 主函数
init()
// 获取ticker数据
promiseXHR('/be.huobi/detail/merged?symbol=ethcny', null, 'GET').then(value => {
  console.log(value)
})
promiseXHR('http://api.huobi.com/staticmarket/detail_ltc_json.js', null, 'GET').then(value => {
  console.log(value)
})
