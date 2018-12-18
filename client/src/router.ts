import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/reports',
      name: 'report',
      component: () => import('./views/Reports.vue'),
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('./views/Create.vue'),
    },
  ],
});
