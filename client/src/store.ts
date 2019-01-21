import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const HOST='http://localhost:8000';

export default new Vuex.Store({
  state: {
    email: null,
    responseStatus: null,
  },
  mutations: {
    setEmail(state, payload) {
      state.email = payload;
    },
    setStatus(state, payload) {
      state.responseStatus = payload;
    },
  },
  actions: {
    checkCookie({ commit }): any {
      axios.get(HOST + '/api/auth', {withCredentials: true}).then((res) => {
        if (res.data.status === 'success') {
          commit('setEmail', res.data.user.email);
          commit('setStatus', null);
        }
      });
    },
    login({ commit }, payload): any {
      axios.post(HOST + '/api/auth/login',
        {username: payload[0], password: payload[1]}, {withCredentials: true}).then((res) => {
          if (res.data.status === 'success') {
            commit('setEmail', res.data.email);
            commit('setStatus', null);
          } else {
            commit('setStatus', res.data);
          }
        }).catch((err) => {
          commit('setStatus', {status: 'error', message: 'Invalid email or password'});
        });
    },
    logout({ commit }): any {
      axios.get(HOST + '/api/auth/logout', {withCredentials: true});
      commit('setEmail', null);
      commit('setStatus', null);
    },
    register({ commit }, payload): any {
      axios.post(HOST + '/api/auth/register',
        {email: payload[0], password: payload[1]}, {withCredentials: true}).then((res) => {
          if (res.data.status === 'success') {
            commit('setEmail', res.data.user.email);
            commit('setStatus', null);
          } else {
            commit('setStatus', res.data);
          }
      });
    },
    recover({ commit }, payload): any {
      axios.post(HOST + '/api/auth/recover', {email: payload}, {withCredentials: true}).then((res) => {
        commit('setStatus', res.data);
      });
    },
  },
});
