import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const HOST='http://10.0.0.21:8000';

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
    login({ commit }, payload): any {
      console.log("HI");
      axios.post(HOST + '/api/auth/login',
        {username: payload[0], password: payload[1]}, {withCredentials: true}).then((res) => {
        console.log(res.data);
        if (res.data.status === 'success') {
          commit('setEmail', res.data.email);
        } else {
          commit('setStatus', res.data);
        }
      });
    },
  },
});
