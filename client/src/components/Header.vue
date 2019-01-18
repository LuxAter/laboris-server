<template>
  <nav class="navbar is-primary">
    <div class="navbar-brand">
      <div class="navbar-item">
        <h1>Laboris</h1>
      </div>
      <a role="button" class="navbar-burger" v-bind:class="{ 'is-active': isActive }" v-on:click="isActive=!isActive">
        <span></span>
        <span></span>
        <span></span>
      </a>
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
