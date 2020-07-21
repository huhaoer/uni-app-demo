import Vue from 'vue'
import App from './App'
import request from './utils/request';//引入封装的请求函数


Vue.config.productionTip = false
Vue.prototype.$request = request;//将函数绑定到原型上

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
