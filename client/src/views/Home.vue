<template>
  <div class="home">
    <LoginHero v-if="$store.state.email === null"/>
    {{ $store.state.email }}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LoginHero from '@/components/LoginHero.vue';

@Component({
  components: {
    LoginHero,
  },
})
export default class Home extends Vue {}
</script>
