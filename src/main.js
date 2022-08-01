import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './assets/css/global.less'
import * as echarts from 'echarts'
import './theme/chalk'
import './theme/vintage'
import './assets/font/iconfont.css'
import SocketService from '@/utils/socket_service'
// 对服务端进行websocket的连接
// SocketService.Instance.connect()
// 其他的组件  this.$socket
Vue.prototype.$socket = SocketService.Instance
// 将全局的echarts对象挂载到Vue原型对象上
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.prototype.$http = axios
// event Bus 用于无关系组件间的通信。
// Vue.prototype.$bus = new Vue()
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
