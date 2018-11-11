import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Interface from './classes/interface'
import cookie from './utils/cookie'

Vue.use(element)

Vue.prototype.$apis = new Interface()
Vue.prototype.$cookie = cookie
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
