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
        <input class="input" type="password" placeholder="password" v-model="password1" v-bind:class="{'is-warning': !PasswordValidate(password1)}">
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
      </div>
      <p class="help is-warning" v-if="!PasswordValidate(password1)">Password is insecure</p>
    </div>
    <div class="field">
      <label class="label">Password Confermation</label>
      <div class="control has-icons-left">
        <input class="input" type="password" placeholder="password" v-model="password2" v-bind:class="{'is-danger': password1 !== password2}">
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
      </div>
      <p class="help is-danger" v-if="password1 !== password2">Passwords do not match</p>
    </div>
    <div class="notification is-danger" v-if="$store.state.error.register !== ''">
      <button class="delete" v-on:click="$store.commit('setErrorRegister', '')" />
      {{ $store.state.error.register }}
    </div>
    <div class="notification is-success" v-if="$store.state.success.register !== ''">
      <button class="delete" v-on:click="$store.commit('setSuccessRegister', '')" />
      {{ $store.state.success.register }}
    </div>
    <button class="button is-block is-info is-fullwidth" v-if="EmailValidate(email) && PasswordValidate(password1) && password1 === password2 && email !== ''" v-on:click="register()">Register</button>
    <button class="button is-block is-info is-fullwidth" disabled v-else>Register</button>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { EmailValidator, PasswordValidator } from '@/scripts/validators.ts';

@Component
export default class LoginForm extends Vue {
  private email: string = '';
  private password1: string = '';
  private password2: string = '';
  private EmailValidate(s: string) {
    return EmailValidator(s);
  }
  private PasswordValidate(s: string) {
    return PasswordValidator(s);
  }
  private register() {
    console.log("HI");
    this.$store.dispatch('register', [this.email, this.password1]);
  }
}
</script>
