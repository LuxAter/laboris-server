<template>
  <div>
    <Header />
    <main>
      Reports!
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from '@/components/Header.vue';

@Component({
  components: {
    Header,
  },
})
export default class Reports extends Vue{}
</script>
