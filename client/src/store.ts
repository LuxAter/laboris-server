import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

import { CalcUrg } from '@/scripts/task.ts';

Vue.use(Vuex);

export interface State {
  userName: string;
  pendingTasks: any[];
  completedTasks: any[];
}

export default new Vuex.Store<State>({
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
    appendPending(state, payload) {
      state.pendingTasks.push(payload);
    },
    appendCompleted(state, payload) {
      state.completedTasks.push(payload);
    },
    calcUrg(state) {
      for (const task of state.pendingTasks) {
        task.urg = CalcUrg(task);
      }
    },
  },
  actions: {
    loadUser({commit, dispatch}) {
      axios.get(process.env.VUE_APP_ROOT + '/api/user', {withCredentials: true}).then((res: any) => {
        if (res.data.success === true) {
          commit('setUserName', res.data.user.name);
          dispatch('loadPending');
        }
      });
    },
    logout({commit}) {
      commit('setUserName', '');
      commit('setPendingTasks', []);
      commit('setCompletedTasks', []);
      axios.get(process.env.VUE_APP_ROOT + '/api/user/logout', {withCredentials: true});
    },
    loadPending({commit}) {
      axios.get(process.env.VUE_APP_ROOT + '/api/task/pending', {withCredentials: true}).then((res: any) => {
        if (res.data.success === true) {
          commit('setPendingTasks', res.data.pending);
          commit('calcUrg');
        }
      });
    },
    submit({commit}, payload) {
      axios.post(process.env.VUE_APP_ROOT + '/api/task/create', payload, {withCredentials: true}).then((res: any) => {
        if (res.data.success === true) {
          commit('appendPending', res.data.task);
          commit('calcUrg');
        }
      });
    },
  },
});
