import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userName: '',
    pendingTasks: [],
    completedTasks: [],
  },
  mutations: {
    setUserName(state, payload) {
      state.userName = payload;
    },
    setPendingTasks(state, payload) {
      state.pendingTasks = payload;
    },
    setCompletedTasks(state, payload) {
      state.completedTasks = payload;
    },
  },
  actions: {
    loadUser({commit}) {
      axios.get(process.env.VUE_APP_ROOT + '/api/user', {withCredentials: true}).then((res: any) => {
        if (res.data.success === true) {
          commit('setUserName', res.data.user.name);
        }
      });
    },
    logout({commit}) {
      commit('setUserName', '');
      commit('setPendingTasks', []);
      commit('setCompletedTasks', []);
      axios.get(process.env.VUE_APP_ROOT + '/api/user/logout', {withCredentials: true});
    },
    submit({commit}, payload) {
      console.log(payload);
    },
  },
});
