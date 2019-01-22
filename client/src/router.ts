import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Register.vue'),
    },
    {
      path: '/recover',
      name: 'recover',
      component: () => import('./views/Recover.vue'),
    },
    {
      path: '/reset/:token',
      name: 'reset',
      component: () => import('./views/Reset.vue'),
      props: true,
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('./views/User.vue'),
    },
  ],
});
