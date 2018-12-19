<template>
  <div>
    <section class="hero is-fullheight is-primary is-bold has-text-left">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Login With Google
          </h1>
          <h2 class="subtitle">
            <a class="button is-medium is-info" :href="apiRoot + '/api/user/login'">Login</a>
          </h2>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Login extends Vue {
  private apiRoot: string = process.env.VUE_APP_ROOT;
}
</script>

