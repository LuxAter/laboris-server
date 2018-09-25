<template>
  <div class="mdl-card mdl-shadow--2dp mdl-cell--12-col">
    <div class="mdl-card__title mdl-card--border">
      <span class="mdl-card__title-text">{{task.title}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Task extends Vue {
  @Prop(String) private uuid!: string;
  private task: any;
  constructor() {
    super();
    this.task = this.$store.state.tasks[this.$store.state.tasks.map((e: any) => e.uuid).indexOf(this.uuid)];
    console.log(this.task);
  }
}
</script>
