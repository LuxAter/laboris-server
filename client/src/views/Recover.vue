<template>
  <div class="home">
    <div class="container" style="padding-top:25px">
      <div class="box">
          <h1 class="title">Recover</h1>
          <div class="is-divider"></div>
          <div class="field">
            <div class="control has-icons-left">
              <input class="input" v-bind:class="{'is-danger': email==='', 'is-warning': !validateEmail(email), 'is-success': validateEmail(email)}" type="email" placeholder="Email" autofocus v-model="email">
              <span class="icon is-left">
                <i class="fas fa-envelope"></i>
              </span>
            </div>
          </div>
          <div class="columns">
            <div class="column is-4">
              <router-link class="button is-small is-link is-outlined is-fullwidth" to="/login">
                Login
              </router-link>
            </div>
            <div class="column is-hidden-mobile"></div>
            <div class="column is-4">
              <router-link class="button is-small is-link is-outlined is-fullwidth" to="/register">
                Register 
              </router-link>
            </div>
          </div>
          <Status v-if="$store.state.responseStatus" />
          <div class="field">
            <div class="control">
              <button class="button is-success is-fullwidth" :disabled="!email || !validateEmail(email)" v-on:click="handleRecover()">Submit</button>
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
export default class Recover extends Vue {
  private email: string = '';
  private handleRecover() {
    this.$store.dispatch('recover', this.email);
  }
  private validateEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
</script>
