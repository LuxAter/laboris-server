<template>
  <div class="home">
    <LoginHero v-if="$store.state.email === null"/>
    <div class="container" style="padding-top:25px" v-else>
      <h1 class="title">Tasks</h1>
      <button class="button is-fullwidth" v-on:click="createTask=!createTask">
        <span class="icon is-large">
          <i class="fas fa-plus"></i>
        </span>
      </button>
      <Create v-if="createTask" />
      <div class="is-divider"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LoginHero from '@/components/LoginHero.vue';
import Create from '@/components/Create.vue';

@Component({
  components: {
    LoginHero,
    Create,
  },
})
export default class Home extends Vue {
  private createTask: boolean = false;
}
</script>
