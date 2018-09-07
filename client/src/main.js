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
    checkUser ({ commit }) {
      axios.get('/api/user/current').then((res) => {
        if ('error' in res) commit('setError', res['error'])
        else commit('setEmail', res['email'])
      }).catch((err) => {
        commit('setError', err)
      })
    },
    login ({ commit }, payload) {
      axios.post('/api/user/login', {username: payload[0], password: payload[1]}).then((res) => {
        if ('error' in res) commit('setError', res['error'])
        else commit('setEmail', res['email'])
      }).catch((err) => {
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
