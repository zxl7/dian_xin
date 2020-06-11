// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/reset.css'
import './assets/icon/style.css'
import './assets/icon/styleTwo.css'
import axios from 'axios'
import VueCookies from 'vue-cookies'
import { List, Tab, Tabs, Toast } from 'vant'
import 'lib-flexible'
Vue.prototype.$axios = axios

Vue.use(VueCookies)

Vue.use(List)
Vue.use(Toast)
Vue.use(Tab)
Vue.use(Tabs)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'

})
