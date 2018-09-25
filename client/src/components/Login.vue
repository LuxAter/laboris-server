<template>
  <div class="column is-6 is-offset-3">
    <div class="box">
      <h3 class="title has-text-grey">Login</h3>
      <form class="has-text-left">
        <div class="field">
          <label class="label">Email</label>
          <div class="control has-icons-left">
            <input class="input" type="email" placeholder="Email" v-model="email" v-bind:class="{ 'is-danger': !email.includes('@') }">
            <span class="icon is-small is-left">
              <i class="fas fa-envelope"></i>
            </span>
          </div>
          <p class="help is-danger" v-if="!email.includes('@')">Please enter a valid email address</p>
        </div>
        <div class="field">
          <label class="label">Password</label>
          <div class="control has-icons-left">
            <input class="input" type="password" placeholder="Password" v-model="password1" v-bind:class="{ 'is-warning': loginRegister && password1.length <= 5 }">
            <span class="icon is-small is-left">
              <i class="fas fa-lock"></i>
            </span>
          </div>
          <p class="help is-warning" v-if="loginRegister && password1.length <= 5">Password too insecure</p>
        </div>
        <div class="field" v-if="loginRegister">
          <label class="label">Password Confirm</label>
          <div class="control has-icons-left">
            <input class="input" type="password" placeholder="Password" v-model="password2" v-bind:class="{ 'is-danger': password2 !== password1 }">
            <span class="icon is-small is-left">
              <i class="fas fa-lock"></i>
            </span>
          </div>
          <p class="help is-danger" v-if="password2 === ''">Must enter password confirmation</p>
          <p class="help is-danger" v-else-if="password1 !== password2">Passwords do not match</p>
        </div>
        <div class="columns">
          <div class="column">
            <button class="button is-block is-text is-fullwidth" v-on:click="loginRegister=!loginRegister" v-if="!loginRegister">Register</button>
            <button class="button is-block is-text is-fullwidth" v-on:click="loginRegister=!loginRegister" v-else>Login</button>
          </div>
          <div class="column">
            <button class="button is-block is-text is-fullwidth">Forgot</button>
          </div>
          <div class="column">
            <button class="button is-block is-info is-fullwidth" v-if="!loginRegister">Login</button>
            <button class="button is-block is-info is-fullwidth" v-else>Register</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Login extends Vue {
  private email: string;
  private password1: string;
  private password2: string;
  private loginRegister: boolean;
  constructor() {
    super();
    this.email = '';
    this.password1 = '';
    this.password2 = '';
    this.loginRegister = false;
  }
  toggle() {
    this.loginRegister = !this.loginRegister;
  }
  login() {
    this.$store.dispatch('login', [this.email, this.password1]);
  }
  register() {
    console.log(this.email, this.password1, this.password2);
    if (this.password1 !== this.password2){
      this.$store.commit('setError', 'Passwords do not match');
    }
    this.$store.dispatch('register', [this.email, this.password1])
  }
}
</script>
