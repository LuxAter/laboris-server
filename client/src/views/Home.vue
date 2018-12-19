<template>
  <div class="home">
    <Header />
    <Login v-if="$store.state.userName === ''" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from '@/components/Header.vue';
import Login from '@/components/Login.vue';

@Component({
  components: {
    Header,
    Login,
  },
})
export default class Home extends Vue {}
</script>
