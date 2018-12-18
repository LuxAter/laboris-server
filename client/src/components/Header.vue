<template>
  <header>
    <nav class="navbar is-primary" role="navigation">
      <div class="navbar-brand">
        <div class="navbar-item">
          Laboris
        </div>
        <router-link class="navbar-item is-hidden-desktop" to="/create" v-if="$store.state.userEmail !== undefined">
          <span class="icon">
            <i class="fas fa-plus" />
          </span>
        </router-link>
        <a role="button" class="navbar-burger burger" v-bind:class="{ 'is-active': menuActive }"data-target="navMenu" aria-label="menu" aria-expanded="false" v-on:click="menuActive=!menuActive">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu" v-bind:class="{ 'is-active': menuActive }" id="navMenu" v-if="$store.state.userEmail !== undefined">
        <div class="navbar-start">
          <router-link class="navbar-item" v-bind:class="{ 'is-active': $route.path === '/' }" to='/'>
            Tasks
          </router-link>
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
    </nav>
  </header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {
  private menuActive: boolean = false;
  constructor() {
    super();
    this.menuActive = false;
  }
}
</script>
