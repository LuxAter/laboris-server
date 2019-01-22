<template>
  <div class="home">
    <div class="container" style="padding-top:25px">
      <div class="box">
          <h1 class="title">Register</h1>
          <div class="is-divider"></div>
          <div class="field">
            <div class="control has-icons-left">
              <input class="input" v-bind:class="{'is-danger': email==='', 'is-warning': !validateEmail(email), 'is-success': validateEmail(email)}" type="email" placeholder="Email" autofocus v-model="email">
              <span class="icon is-left">
                <i class="fas fa-envelope"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <div class="control has-icons-left">
              <input class="input" v-bind:class="{'is-danger': password1 === '' || strength === 0, 'is-warning': strength === 1, 'is-success': strength === 2}" type="password" placeholder="Password" v-model="password1" v-on:input="validatePassword()">
              <span class="icon is-left">
                <i class="fas fa-unlock"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <div class="control has-icons-left">
              <input class="input" v-bind:class="{'is-danger': password2==='', 'is-warning': password1 !== password2, 'is-success': password1 === password2}"type="password" placeholder="Verify Password" v-model="password2">
              <span class="icon is-left">
                <i class="fas fa-unlock"></i>
              </span>
            </div>
          </div>
          <progress class="progress" v-bind:class="{'is-danger': strength===0, 'is-warning': strength===1, 'is-success': strength===2}" v-bind:value='strength' max="2">{{ strength }}%</progress>
          <div class="columns">
            <div class="column is-4">
              <router-link class="button is-small is-link is-outlined is-fullwidth" to="/login">
                Login
              </router-link>
            </div>
            <div class="column is-hidden-mobile"></div>
            <div class="column is-4">
              <router-link class="button is-small is-link is-outlined is-fullwidth" to="/recover">
                Forgot
              </router-link>
            </div>
          </div>
          <Status v-if="$store.state.responseStatus" />
          <div class="field">
            <div class="control">
              <button class="button is-success is-fullwidth" :disabled="!(email && validateEmail(email) && password1 && password2 && password1 === password2 && strength !== 0)" v-on:click="handleRegister()">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Status from '@/components/Status.vue';

@Component({
  components: {
    Status,
  },
})
export default class Register extends Vue {
  private email: string = '';
  private password1: string = '';
  private password2: string = '';
  private strength: number = 0.0;
  private mounted() {
    this.$store.watch((state) => state.email, () => {
      if (this.$store.state.email !== null) {
        this.$router.push('/');
      }
    });
  }
  private handleRegister() {
    this.$store.dispatch('register', [this.email, this.password1]);
  }
  private validateEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  private validatePassword(): void {
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    if (strongRegex.test(this.password1)) {
      this.strength = 2;
    } else if (mediumRegex.test(this.password1)) {
      this.strength = 1;
    } else {
      this.strength = 0;
    }
  }
}
</script>
