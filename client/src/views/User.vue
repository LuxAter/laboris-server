<template>
  <div class="home">
    <div class="container" style="padding-top:25px">
      <div class="box">
        <h1 class="title">Settings</h1>
        <h2 class="subtitle has-text-grey">{{ $store.state.email }}</h2>
        <div class="is-divider" data-content="SECURITY"></div>
        <div class="content">
          <div class="columns">
            <div class="column is-8">
              <div class="field">
                <div class="control has-icons-left">
                  <input class="input is-primary" type="email" :placeholder="$store.state.email" :disabled="emailLock" v-model="newEmail">
                  <span class="icon is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                </div>
              </div>
            </div>
            <div class="column is-4">
              <div class="field">
                <input id="emailLock" type="checkbox" class="switch" :checked="!emailLock" v-on:click="emailLock=!emailLock">
                <label for="emailLock">Unlock Email</label>
              </div>
            </div>
          </div>
          <button class="button is-warning is-fullwidth is-small" v-if="newEmail !== '' && validateEmail(newEmail)" v-on:click="activeModal=1">Save Changes</button>
          <div class="modal" :class="{'is-active': activeModal === 1}">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Change Email</p>
                <button class="delete" aria-label="close" v-on:click="activeModal=0"></button>
              </header>
              <section class="modal-card-body">
                Are you sure you want to change your email from "{{ $store.state.email }}" to "{{ newEmail }}"?
              </section>
              <footer class="modal-card-foot">
                <button class="button is-success" v-on:click="changeEmail()">Save changes</button>
                <button class="button" v-on:click="activeModal=0">Cancel</button>
              </footer>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="columns">
            <div class="column is-4">
              <button class="button is-warning is-fullwidth" v-on:click="$store.dispatch('recover', $store.state.email)">Reset Password</button>
            </div>
            <div class="column is-8 has-text-grey">
              Sends password reset to the current user email address, which can then be used to reset the users password.
            </div>
          </div>
        </div>
        <div class="content">
          <div class="columns">
            <div class="column is-4">
              <button class="button is-danger is-fullwidth" v-on:click="activeModal=2">Delete Account</button>
            </div>
            <div class="column is-8 has-text-grey">
              Permently deletes user account, and all user data.
            </div>
          </div>
        </div>
        <div class="modal" :class="{'is-active': activeModal === 2}">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Delete Account</p>
              <button class="delete" aria-label="close" v-on:click="activeModal=0"></button>
            </header>
            <section class="modal-card-body">
              Are you sure that you want to delete your account permenently? This cannot be undone, and all of your user data will be lost.
            </section>
            <footer class="modal-card-foot">
              <button class="button is-danger" v-on:click="deleteAccount()">Delete Account</button>
              <button class="button" v-on:click="activeModal=0">Cancel</button>
            </footer>
          </div>
        </div>
        <Status v-if="$store.state.responseStatus"/>
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
export default class Login extends Vue {
  private emailLock: boolean = true;
  private activeModal: number = 0;
  private newEmail: string = '';
  private mounted() {
    this.$store.watch((state) => state.email, () => {
      if (this.$store.state.email !== null) {
        this.$router.push('/');
      }
    });
  }
  private validateEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  private changeEmail(): any {
    this.$store.dispatch('changeEmail', this.newEmail);
    this.activeModal = 0;
  }
  private deleteAccount(): any {
    this.$store.dispatch('deleteAccount');
    this.activeModal = 0;
  }
}
</script>
