import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import element from 'element-ui'
import { Notification } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import Interface from './classes/interface'
import cookie from './utils/cookie'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'

Vue.use(element)
Vue.use(Viewer)

Vue.prototype.$apis = new Interface()
Vue.prototype.$cookie = cookie
Vue.config.productionTip = false
window.addEventListener('offline', function (e) {
  Notification({
    title: '网络错误',
    message: '您的网络已断开，请检查网络',
    position: 'top-left',
    type: 'error'
  })
})
window.addEventListener('online', function (e) {
  Notification({
    title: '提示',
    message: '网络已连接，请继续使用',
    position: 'top-left',
    type: 'success'
  })
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
