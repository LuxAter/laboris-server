<template>
  <div class="column is-6 is-offset-3">
    <div class="box">
      <h3 class="title has-text-grey" v-if="mode === 0">Login</h3>
      <h3 class="title has-text-grey" v-else-if="mode === 1">Register</h3>
      <h3 class="title has-text-grey" v-else-if="mode === 2">Recovery</h3>
      <LoginForm v-if="mode === 0"/>
      <RegisterForm v-else-if="mode === 1"/>
      <ForgotForm v-else-if="mode === 2"/>
      <!-- <form class="has&#45;text&#45;left"> -->
      <!--   <div class="field"> -->
      <!--     <label class="label">Email</label> -->
      <!--     <div class="control has&#45;icons&#45;left"> -->
      <!--       <input class="input" type="email" placeholder="Email" v&#45;model="email" v&#45;bind:class="{ 'is&#45;danger': !email.includes('@') }"> -->
      <!--       <span class="icon is&#45;small is&#45;left"> -->
      <!--         <i class="fas fa&#45;envelope"></i> -->
      <!--       </span> -->
      <!--     </div> -->
      <!--     <p class="help is&#45;danger" v&#45;if="!email.includes('@')">Please enter a valid email address</p> -->
      <!--   </div> -->
      <!--   <div v&#45;if="loginRegister === 0"> -->
      <!--     Hello -->
      <!--   </div> -->
      <!--   <div v&#45;else&#45;if="loginRegister === 1"> -->
      <!--     Hi -->
      <!--   </div> -->
      <!--   <div class="field"> -->
      <!--     <label class="label">Password</label> -->
      <!--     <div class="control has&#45;icons&#45;left"> -->
      <!--       <input class="input" type="password" placeholder="Password" v&#45;model="password1" v&#45;bind:class="{ 'is&#45;warning': loginRegister &#38;&#38; password1.length <= 5 }"> -->
      <!--       <span class="icon is&#45;small is&#45;left"> -->
      <!--         <i class="fas fa&#45;lock"></i> -->
      <!--       </span> -->
      <!--     </div> -->
      <!--     <p class="help is&#45;warning" v&#45;if="loginRegister &#38;&#38; password1.length <= 5">Password too insecure</p> -->
      <!--   </div> -->
      <!--   <div class="field" v&#45;if="loginRegister"> -->
      <!--     <label class="label">Password Confirm</label> -->
      <!--     <div class="control has&#45;icons&#45;left"> -->
      <!--       <input class="input" type="password" placeholder="Password" v&#45;model="password2" v&#45;bind:class="{ 'is&#45;danger': password2 !== password1 }"> -->
      <!--       <span class="icon is&#45;small is&#45;left"> -->
      <!--         <i class="fas fa&#45;lock"></i> -->
      <!--       </span> -->
      <!--     </div> -->
      <!--     <p class="help is&#45;danger" v&#45;if="password2 === ''">Must enter password confirmation</p> -->
      <!--     <p class="help is&#45;danger" v&#45;else&#45;if="password1 !== password2">Passwords do not match</p> -->
      <!--   </div> -->
      <!--   <div class="columns"> -->
      <!--     <div class="column"> -->
      <!--       <button class="button is&#45;block is&#45;text is&#45;fullwidth" v&#45;on:click="loginRegister=!loginRegister" v&#45;if="!loginRegister">Register</button> -->
      <!--       <button class="button is&#45;block is&#45;text is&#45;fullwidth" v&#45;on:click="loginRegister=!loginRegister" v&#45;else>Login</button> -->
      <!--     </div> -->
      <!--     <div class="column"> -->
      <!--       <button class="button is&#45;block is&#45;text is&#45;fullwidth">Forgot</button> -->
      <!--     </div> -->
      <!--     <div class="column"> -->
      <!--       <button class="button is&#45;block is&#45;info is&#45;fullwidth" v&#45;if="!loginRegister">Login</button> -->
      <!--       <button class="button is&#45;block is&#45;info is&#45;fullwidth" v&#45;else>Register</button> -->
      <!--     </div> -->
      <!--   </div> -->
      <!-- </form> -->
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
