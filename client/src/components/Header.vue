<template>
  <nav class="navbar is-primary" role="navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item" to="/">
        <h1>Laboris</h1>
      </router-link>
      <a role="button" class="navbar-burger" v-bind:class="{ 'is-active': isActive }" v-on:click="isActive=!isActive">
        <span></span>
        <span></span>
        <span></span>
      </a>
    </div>
    <div class="navbar-menu" v-bind:class="{ 'is-active': isActive }">
      <div class="navbar-end">
        <router-link class="navbar-item" to="/user" v-if="$store.state.email !== null">
          <span class="icon">
            <i class="fas fa-user"></i>
          </span>
          <span>User</span>
        </router-link>
        <router-link class="navbar-item" to="/settings" v-if="$store.state.email !== null">
          <span class="icon">
            <i class="fas fa-cog"></i>
          </span>
          <span>Setting</span>
        </router-link>
        <a class="navbar-item" v-on:click="$store.dispatch('logout')" v-if="$store.state.email !== null">
          <span class="icon">
            <i class="fas fa-sign-out-alt"></i>
          </span>
          <span>Logout</span>
        </a>
        <router-link class="navbar-item" to="/login" v-else>
          <span class="icon">
            <i class="fas fa-sign-in-alt"></i>
          </span>
          <span>Login</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {
  private isActive: boolean = false;
}
</script>
