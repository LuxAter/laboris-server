// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'

Vue.config.productionTip = false
Vue.use(Vuex)

/* eslint-disable no-new */
const store = new Vuex.Store({
  state: {
    email: 'ardenisthebest@gmail.com',
    createTask: true
  }
})

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
