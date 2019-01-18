<template>
  <div class="home">
    <div class="box is-8">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {
  private isActive: boolean = false;
}
</script>
