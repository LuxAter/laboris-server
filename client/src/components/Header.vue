<template>
  <header>
    <nav class="navbar is-primary" role="navigation">
      <div class="navbar-brand">
        <div class="navbar-item">
          Laboris
        </div>
        <a class="navbar-item is-hidden-desktop" :href="apiRoot + '/api/user/login'" v-if="$route.path === '/' && $store.state.userName === ''">
          <span class="icon">
            <i class="fas fa-user"></i>
          </span>
        </a>
        <router-link class="navbar-item is-hidden-desktop" to="/task/create" v-if="$store.state.userName !== '' && $route.path === '/'">
          <span class="icon">
            <i class="fas fa-plus"></i>
          </span>
        </router-link>
        <router-link class="navbar-item is-hidden-desktop" to="/" v-if="$store.state.userName !== '' && $route.path !== '/'">
          <span class="icon">
            <i class="fas fa-home"></i>
          </span>
        </router-link>
        <router-link class="navbar-item is-hidden-desktop" to="/" v-if="$store.state.userName !== ''">
          <span class="icon">
            <i class="fas fa-sign-out-alt"></i>
          </span>
        </router-link>
        <a role="button" class="navbar-burger burger" v-bind:class="{ 'is-active': menuActive }"data-target="navMenu" aria-label="menu" aria-expanded="false" v-on:click="menuActive=!menuActive">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu" v-bind:class="{ 'is-active': menuActive }" id="navMenu" v-if="$store.state.userName !== ''">
        <div class="navbar-start">
          <router-link class="navbar-item" v-bind:class="{ 'is-active': $route.path === '/reports' }" to='/reports'>
            Reports
          </router-link>
        </div>
        <div class="navbar-end">
          <router-link class="navbar-item is-hidden-touch" to="/create" v-if="$store.state.userEmail !== undefined">
            <span class="icon">
              <i class="fas fa-plus" />
            </span>
          </router-link>
        </div>
      </div>
      <div class="navbar-end">
        <a class="navbar-item is-hidden-touch" :href="apiRoot + '/api/user/login'" v-if="$route.path === '/' && $store.state.userName === ''">
          <span class="icon">
            <i class="fas fa-user"></i>
          </span>
        </a>
        <router-link class="navbar-item is-hidden-touch" to="/task/create" v-if="$store.state.userName !== '' && $route.path === '/'">
          <span class="icon">
            <i class="fas fa-plus"></i>
          </span>
        </router-link>
        <router-link class="navbar-item is-hidden-touch" to="/" v-if="$store.state.userName !== '' && $route.path !== '/'">
          <span class="icon">
            <i class="fas fa-home"></i>
          </span>
        </router-link>
        <router-link class="navbar-item is-hidden-touch" to="/" v-if="$store.state.userName !== ''" v-on:click.native="$store.dispatch('logout')">
          <span class="icon">
            <i class="fas fa-sign-out-alt"></i>
          </span>
        </router-link>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {
  private apiRoot: string = process.env.VUE_APP_ROOT;
  private menuActive: boolean = false;
}
</script>

