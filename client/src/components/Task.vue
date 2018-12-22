<template>
  <div class="box" v-on:click="toggle" v-bind:style="{ 'background-color': bgcolor }">
    <div>
      <h5 class="subtitle" v-bind:style="{ 'color': color }">{{ task.title }}</h5>
    </div>
    <div class="columns">
      <div class="column is-6" v-if="task.dueDate !== null">
        <div class="columns is-mobile">
          <div class="column is-3">
            <h6 class="label">Due:</h6>
          </div>
          <div class="column is-7 is-hidden-mobile">
            {{ dueDate("%d-%m-%Y %H:%M [%D]") }}
          </div>
          <div class="column is-7 is-hidden-desktop">
            {{ dueDate("%D") }}
          </div>
        </div>
      </div>
      <div class="column is-6" v-if="task.urg !== 0">
        <div class="columns is-mobile">
          <div class="column is-3">
            <h6 class="label">Urg:</h6>
          </div>
          <div class="column is-7">
            {{ task.urg.toFixed(3) }}
          </div>
        </div>
      </div>
    </div>
    <div class="tags are-small" v-if="task.projects.length !== 0 || task.tags.length !== 0">
      <span class="tag is-primary" v-for="proj in task.projects">{{ proj }}</span>
      <span class="tag is-info" v-for="tag in task.tags">{{ tag }}</span>
    </div>

    <!-- <div class="columns"> -->
    <!--   <div class="column is&#45;6"> -->
    <!--     <button class="button is&#45;fullwidth is&#45;success">Complete</button> -->
    <!--   </div> -->
    <!--   <div class="column is&#45;6"> -->
    <!--     <button class="button is&#45;fullwidth is&#45;info">Info</button> -->
    <!--   </div> -->
    <!-- </div> -->
    <!-- {{task}} -->
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { DateFmt } from '@/scripts/date.ts';
import { UrgColor } from '@/scripts/task.ts';

@Component
export default class Task extends Vue {
  @Prop() private task!: any;
  private bgcolor: string = '#fff';
  private color: string = '#f44336';
  private active: boolean = false;
  private constructor() {
    super();
    this.color = UrgColor(this.task.urg);
  }
  private toggle() {
    this.active = !this.active;
    if (this.active) {
      this.bgcolor = "#4caf50";
    } else {
      this.bgcolor = "#fff";
    }
  }
  private dueDate(fmt: string) {
    return DateFmt(fmt, this.task.dueDate);
  }
}
</script>
