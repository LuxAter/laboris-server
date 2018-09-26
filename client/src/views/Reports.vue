<template>
  <div>
    <Header />
    <main>
      <section class="hero is-fullheight is-primary is-bold has-text-left">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              Reports
            </h1>
            <h2 class="subtitle">
              Comming Soon
            </h2>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

@Component({
  components: {
    Header,
    Footer,
  },
})
export default class Reports extends Vue {}
</script>
