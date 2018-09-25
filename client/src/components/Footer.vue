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
          <div class="bd-footer-links">
            <p class="bd-footer-link" v-if="$store.state.userEmail !== undefined">
              <a>Logout</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {}
</script>
