<template>
  <div>
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
                      <input class="input" type="text" placeholder="Task" v-model="title" v-bind:class="{'is-danger': title.length === 0}">
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-9">
                  <div class="field">
                    <label class="label">Due Date</label>
                    <div class="control">
                      <input class="input" type="text" placeholder="dd/mm/yyyy HH:MM" v-model="dueDate" v-bind:class="{'is-danger': !DateValidate(dueDate) }">
                    </div>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="field">
                    <label class="label">Priority</label>
                    <div class="control">
                      <input class="input" type="text" placeholder="0" v-model="priority">
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
                  <button class="button is-block is-danger is-outlined is-fullwidth">Cancel</button>
                </div>
                <div class="column">
                  <button class="button is-block is-success is-fullwidth">Submit</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { DateValidator } from '@/scripts/validators.ts';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

@Component({
  components: {
    Header,
    Footer,
  },
})
export default class Create extends Vue {
  private title: string = '';
  private priority: string = '';
  private projects: string = '';
  private tags: string = '';
  private dueDate: string = '';
  private DateValidate(s: string) {
    return DateValidator(s);
  }
}
</script>
