<template>
  <header>
    <nav class="navbar is-primary has-shadow" role="navigation">
      <div class="navbar-brand">
        <div class="navbar-item">
          Laboris
        </div>
        <a role="button" class="navbar-burger burger" v-bind:class="{ 'is-active': menuActive }"data-target="navMenu" aria-label="menu" aria-expanded="false" v-on:click="menuActive=!menuActive">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu" v-bind:class="{ 'is-active': menuActive }" id="navMenu">
        <div class="navbar-start">
          <router-link class="navbar-item" v-bind:class="{ 'is-active': $route.path === '/' }" to='/'>
            Tasks
          </router-link>
          <router-link class="navbar-item" v-bind:class="{ 'is-active': $route.path === '/reports' }" to='/reports'>
            Reports 
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
  private menuActive: boolean=false; 
  constructor() {
    super();
    this.menuActive = false;
  }
}
</script>
