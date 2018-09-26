<template>
  <footer class="footer">
    <div class="content">
      <div class="columns">
        <div class="column">
          <h4 class="bd-footer-title">Laboris</h4>
          <div class="bd-footer-links">
            <p class="bd-footer-link">
              <a href="https://github.com/LuxAtrumStudio/laboris-server">
                <span class="bd-footer-link-icon">
                  <i class="fab fa-github" />
                </span>
                Github Repository
              </a>
            </p>
            <p class="bd-footer-link">
              <a href="https://github.com/LuxAtrumStudio/laboris">
                <span class="bd-footer-link-icon">
                  <i class="fab fa-github" />
                </span>
                CLI Client
              </a>
            </p>
          </div>
          <div class="bd-footer-tsp">
            Created by Arden Rasmussen
          </div>
        </div>
        <div class="column">
          <h4 class="bd-footer-title">Settings</h4>
          <div class="bd-footer-tsp">
            {{ $store.state.userEmail }}
          </div>
          <div class="bd-footer-links">
            <p class="bd-footer-link" v-if="$store.state.userEmail !== undefined">
              <a v-on:click="$store.dispatch('logout')">Logout</a>
            </p>
            <p class="bd-footer-link" v-if="$store.state.userEmail !== undefined">
              <a v-on:click="modalShow=true">Delete</a>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="modal" v-bind:class="{'is-active':modalShow}">
      <div class="modal-background" />
      <div class="modal-card is-danger">
        <header class="modal-card-head">
          <p class="modal-card-title">Delete User</p>
          <button class="delete" aria-label="close" v-on:click="modalShow=false"></button>
        </header>
        <section class="modal-card-body">
          Are you sure that you want to delete your account?
        </section>
        <footer class="modal-card-foot">
          <button class="button is-block is-danger is-fullwidth" v-on:click="deleteUser()">Delete Account</button>
          <button class="button is-block is-fullwidth" v-on:click="modalShow=false">Cancel</button>
        </footer>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {
  private modalShow: boolean = false;
  private deleteUser() {
    this.modalShow = false;
    this.$store.dispatch('delete');
  }
}
</script>
