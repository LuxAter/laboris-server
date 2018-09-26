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
    <div class="notification is-success" v-if="sent">
      <button class="delete" v-on:click="sent=!sent"/>
      An email was sent to this email address if it is a valid user.
    </div>
    <button class="button is-block is-info is-fullwidth" v-if="EmailValidate(email) && email !== ''" v-on:click="sent=true">Recover</button>
    <button class="button is-block is-info is-fullwidth" disabled v-else v-on:click="sent=true">Recover</button>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { EmailValidator } from '@/scripts/validators.ts';

@Component
export default class LoginForm extends Vue {
  private email: string = '';
  private sent: boolean = false;
  private EmailValidate(s: string) {
    return EmailValidator(s);
  }
}
</script>
