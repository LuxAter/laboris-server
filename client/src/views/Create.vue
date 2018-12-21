<template>
  <div class="create">
    <Header />
      <main class="container">
        <div class="column is-8 is-offset-2">
          <div class="box">
            <h3 class="title has-text-grey">Create New Task</h3>
            <form class="has-text-left">
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <label class="label">Title</label>
                    <div class="control">
                      <input class="input" type="text" placeholder="Title" v-model="title" v-bind:class="{'is-danger': titleVal()}">
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-9">
                  <div class="field">
                    <label class="label">Due Date</label>
                    <div class="control">
                      <input class="input" type="text" placeholder="dd/mm/yyyy HH:MM" v-model="dueDate" v-bind:class="{'is-danger': dueDateVal(dueDate)}">
                    </div>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="field">
                    <label class="label">Priority</label>
                    <div class="control">
                      <input class="input" type="number" placeholder="0" v-model="priority" v-bind:class="{'is-danger': priorityVal()}">
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <label class="label">Projects</label>
                    <div class="control">
                      <input class="input" type="text" placeholder="projects" v-model="projects">
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="field">
                    <label class="label">Tags</label>
                    <div class="control">
                      <input class="input" type="text" placeholder="tags" v-model="tags">
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <router-link class="button is-block is-danger is-outlined is-fullwidth" to='/'>Cancel</router-link>
                </div>
                <div class="column">
                  <button class="button is-block is-success is-fullwidth" v-bind:disabled="val()" v-on:click="submit()">Submit</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { DateValidator, ParseDate } from '@/scripts/date.ts';
import Header from '@/components/Header.vue';

@Component({
  components: {
    Header,
  },
})
export default class Home extends Vue {
  private title: string = '';
  private projects: string = '';
  private tags: string = '';
  private priority: number = 0;
  private dueDate: string = '';
  private titleVal() {
    return this.title.length === 0;
  }
  private dueDateVal(s: string) {
    return (DateValidator(s) === 0);
  }
  private priorityVal() {
    return (-1 > this.priority);
  }
  private val() {
    return !(!this.titleVal() && !this.dueDateVal(this.dueDate) && !this.priorityVal());
  }
  private submit() {
    this.$store.dispatch('submit', {title: this.title,
      projects: this.projects.split(','),
      tags: this.tags.split(','),
      priority: this.priority,
      dueDate: ParseDate(this.dueDate)},
    );
    this.$router.push('/');
  }
}
</script>
