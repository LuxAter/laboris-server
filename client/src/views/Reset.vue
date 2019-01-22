<template>
  <div class="home">
    <div class="container" style="padding-top:25px">
      <div class="box">
        <h1 class="title">Reset Password</h1>
        <div class="is-divider"></div>
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
        <progress class="progress" v-bind:class="{'is-danger': strength===1, 'is-warning': strength===2, 'is-success': strength===3}" v-bind:value='strength' max="3">{{ strength }}%</progress>
        <Status v-if="$store.state.responseStatus" />
        <div class="field">
          <div class="control">
            <button class="button is-success is-fullwidth" :disabled="password1 !== password2 || strength === 0"v-on:click="handleReset()">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';
import Status from '@/components/Status.vue';

@Component({
  components: {
    Status,
  },
})
export default class Reset extends Vue {
  @Prop() private token: any;
  private password1: string = '';
  private password2: string = '';
  private strength: number = 0;
  private handleReset(): void {
    this.$store.dispatch('resetPassword', [this.token, this.password1]);
  }
  private validatePassword(): void {
    const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
    const mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');
    if (strongRegex.test(this.password1)) {
      this.strength = 3;
    } else if (mediumRegex.test(this.password1)) {
      this.strength = 2;
    } else {
      this.strength = 1;
    }
  }
}
</script>
