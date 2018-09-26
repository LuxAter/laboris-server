<template>
  <form class="has-text-left">
    <div class="field">
      <label class="label">Email</label>
      <div class="control has-icons-left">
        <input class="input" type="email" placeholder="Email" v-model="email" v-bind:class="{'is-danger': !EmailValidate(email)}">
        <span class="icon is-small is-left">
          <i class="fas fa-envelope"></i>
        </span>
      </div>
      <p class="help is-danger" v-if="!EmailValidate(email)">Invalid Email</p>
    </div>
    <div class="field">
      <label class="label">Password</label>
      <div class="control has-icons-left">
        <input class="input" type="password" placeholder="password" v-model="password">
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
      </div>
    </div>
    <div class="notification is-danger" v-if="$store.state.error.login !== ''">
      <button class="delete" v-on:click="$store.commit('setErrorLogin', '')"/>
      {{ $store.state.error.login }}
    </div>
    <button class="button is-block is-info is-fullwidth" v-if="EmailValidate(email)" v-on:click="login()">Login</button>
    <button class="button is-block is-info is-fullwidth" disabled v-else>Login</button>

  </form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { EmailValidator } from '@/scripts/validators.ts';

@Component
export default class LoginForm extends Vue {
  private email: string = '';
  private password: string = '';
  private EmailValidate(s: string) {
    return EmailValidator(s);
  }
  private login() {
    this.$store.dispatch('login', [this.email, this.password]);
  }
}
</script>
