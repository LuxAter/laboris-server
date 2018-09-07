// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import axios from 'axios'
import router from './router'

Vue.config.productionTip = false
Vue.use(Vuex)

/* eslint-disable no-new */
const store = new Vuex.Store({
  state: {
    email: null,
    error: null,
    createTask: false
  },
  mutations: {
    setEmail (state, payload) {
      state.email = payload
    },
    setError (state, payload) {
      state.error = payload
    }
  },
  actions: {
    login ({ commit }, email, password) {
      console.log(email, password)
      axios.post('/api/user/login', {username: email, password: password}).then((res) => {
        console.log('hello')
        if ('error' in res) commit('setError', res['error'])
        else commit('setEmail', res['email'])
      }).catch((err) => {
        console.log('hi', err, 'more hi')
        commit('setError', err)
      })
    }
  }
})

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
