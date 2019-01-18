<template>
  <div class="home">
    <div class="container">
      <div class="card">
        <div class="card-content">
          <h1 class="title">Login</h1>
          <div class="is-divider"></div>
          <div class="field">
            <div class="control has-icons-left">
              <input class="input" type="email" placeholder="Email" autofocus v-model="email">
              <span class="icon is-left">
                <i class="fas fa-envelope"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <div class="control has-icons-left">
              <input class="input" type="password" placeholder="Password" v-model="password">
              <span class="icon is-left">
                <i class="fas fa-unlock"></i>
              </span>
            </div>
          </div>
          <div class="columns">
            <div class="column is-4">
              <router-link class="button is-small is-link is-outlined is-fullwidth" to="/register">
                Register
              </router-link>
            </div>
            <div class="column is-hidden-mobile"></div>
            <div class="column is-4">
              <router-link class="button is-small is-link is-outlined is-fullwidth" to="/recover">
                Forgot 
              </router-link>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-success is-fullwidth" :disabled="!(email && password)" v-on:click="handleLogin()">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {
  private email: string = '';
  private password: string = '';
  private handleLogin(){
    this.$store.dispatch('login', [this.email, this.password]);
  }
}
</script>
