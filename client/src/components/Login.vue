<template>
  <div class="column is-6 is-offset-3">
    <div class="box">
      <h3 class="title has-text-grey" v-if="mode === 0">Login</h3>
      <h3 class="title has-text-grey" v-else-if="mode === 1">Register</h3>
      <h3 class="title has-text-grey" v-else-if="mode === 2">Recovery</h3>
      <LoginForm v-if="mode === 0"/>
      <RegisterForm v-else-if="mode === 1"/>
      <ForgotForm v-else-if="mode === 2"/>
      <div class="columns">
        <div class="column">
          <button class="button is-text is-fullwidth" v-on:click="mode=1" v-if="mode === 0 || mode === 2">Register</button>
          <button class="button is-text is-fullwidth" v-on:click="mode=0" v-else>Login</button>
        </div>
        <div class="column">
          <button class="button is-text is-fullwidth" v-on:click="mode=2" v-if="mode === 0 || mode == 1">Forgot</button>
          <button class="button is-text is-fullwidth" v-on:click="mode=0" v-else>Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LoginForm from './LoginForm.vue';
import RegisterForm from './RegisterForm.vue';
import ForgotForm from './ForgotForm.vue';

@Component({
  components: {
    LoginForm,
    RegisterForm,
    ForgotForm,
  },
})
export default class Login extends Vue {
  private email: string;
  private password1: string;
  private password2: string;
  private mode: number;
  constructor() {
    super();
    this.email = '';
    this.password1 = '';
    this.password2 = '';
    this.mode = 0;
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
