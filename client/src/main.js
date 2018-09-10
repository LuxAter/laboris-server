// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import axios from 'axios'
import router from './router'

Vue.config.productionTip = false
Vue.use(Vuex)

const target = 'http://localhost:3000'
// const target = ''

/* eslint-disable no-new */
const store = new Vuex.Store({
  state: {
    email: null,
    error: null,
    tasks: [],
    createTask: false,
    createProject: false
  },
  mutations: {
    setEmail (state, payload) {
      state.email = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    toggleCreateTask (state) {
      state.createTask = !state.createTask
    },
    toggleCreateProject (state) {
      state.createProject = !state.createProject
    },
    setTasks (state, payload) {
      state.tasks = payload
    },
    appendTask (state, payload) {
      console.log(payload)
      state.tasks.push({
        uuid: payload.uuid,
        modifiedDate: new Date(payload.modifiedDate),
        title: payload['title'],
        projects: payload.projects,
        tags: payload.tags,
        priority: payload.priority,
        entryDate: new Date(payload.entryDate),
        dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
        doneDate: payload.doneDate ? new Date(payload.doneDate) : null,
        status: payload.status,
        times: payload.times,
        active: false
      })
    }
  },
  actions: {
    checkUser ({ commit }) {
      axios.get(target + '/api/user/current', {withCredentials: true}).then((res) => {
        if ('error' in res.data) commit('setError', res.data['error'])
        else {
          commit('setEmail', res.data['email'])
          axios.get(target + '/api/task/', {withCredentials: true}).then((res) => {
            if ('error' in res.data) commit('setError', res.data['error'])
            else {
              console.log(res.data)
              for (var i = 0; i < res.data.length; i++) {
                console.log(res.data[i])
                commit('appendTask', res.data[i])
              }
              // commit('setTasks', res.data)
            }
          })
        }
      }).catch((err) => {
        commit('setError', err)
      })
    },
    login ({ commit }, payload) {
      axios.post(target + '/api/user/login', {username: payload[0], password: payload[1]}, {withCredentials: true}).then((res) => {
        if ('error' in res.data) commit('setError', res.data['error'])
        else {
          commit('setEmail', res.data['email'])
          axios.get(target + '/api/task/', {withCredentials: true}).then((res) => {
            if ('error' in res.data) commit('setError', res.data['error'])
            else {
              for (var task in res.dat) {
                commit('appendTask', task)
              }
              // commit('setTasks', res.data)
            }
          })
        }
      }).catch((err) => {
        commit('setError', err)
      })
    },
    logout ({ commit }) {
      commit('setEmail', null)
      commit('setTasks', [])
      axios.post(target + '/api/user/logout').then((res) => {
      }).catch((err) => {
        commit('setError', err)
      })
    },
    getTasks ({ commit }) {
      axios.get(target + '/api/task/').then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
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
