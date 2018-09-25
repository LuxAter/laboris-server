<template>
  <div class="mdl-grid center-items" style="justify-content:center">
    <div class="mdl-cell mdl-cell--6-col" v-for="task in $store.state.tasks" :key="task.uuid">
      <Task :uuid='task.uuid' />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Task from '@/components/Task.vue';

@Component({
  components: {
    Task,
  },
})
export default class TaskList extends Vue {}
</script>
