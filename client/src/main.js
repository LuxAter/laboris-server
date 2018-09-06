// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import { MdButton, MdIcon, MdDrawer, MdList, MdToolbar } from 'vue-material/dist/components'
// import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css' // This line here

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(MdButton)
Vue.use(MdIcon)
Vue.use(MdDrawer)
Vue.use(MdList)
Vue.use(MdToolbar)

/* eslint-disable no-new */
const store = new Vuex.Store({
  state: {
    email: 'ardenisthebest@gmail.com'
  }
})

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
