<template>
  <section class="hero is-fullheight is-secondary is-bold">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">Laboris</h1>
        <h2 class="subtitle">Task and Time Tracking</h2>
        <div class="buttons">
          <router-link class="button is-medium is-success" to="/login">
            <span class="icon">
              <i class="fas fa-sign-in-alt"></i>
            </span>
            <span>Login</span>
          </router-link>
          <router-link class="button is-medium is-link" to="/register">
            <span class="icon">
              <i class="fas fa-user"></i>
            </span>
            <span>Register</span>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class LoginHero extends Vue {}
</script>
