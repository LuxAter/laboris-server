<template>
  <main class="container">
    <div class="column is-8 is-offset-2">
      <div class="box">
        <div class="columns is-mobile">
          <div class="column is-10">
            <h4 class="subtitle has-text-grey">Task List</h4>
          </div>
          <div class="column is-2">
            <input id="includeCompleted" type="checkbox" class="switch is-rounded" v-model="completed">
          </div>
        </div>
      </div>
      <Task v-bind:task="task" v-bind:key="task.uuid" v-for="task in $store.state.pendingTasks" />
      <hr v-if="completed" />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Task from '@/components/Task.vue';

@Component({
  components: {
    Task,
  },
})
export default class TaskList extends Vue {
  private completed: boolean = false;
}
</script>
