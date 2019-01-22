<template>
  <div class="card">
    <div class="card-head">
      <h2 class="card-header-title">Create Task</h2>
    </div>
    <div class="card-content">
      <div class="columns">
        <div class="field column is-10">
          <div class="control is-expanded">
            <input class="input" type="text" placeholder="Title">
          </div>
        </div>
        <div class="field has-addons column is-2">
          <div class="control">
            <button class="button">
              <span class="icon">
                <i class="fas fa-minus"></i>
              </span>
            </button>
          </div>
          <div class="control">
            <input class="input" type="text" placeholder="P">
          </div>
          <div class="control">
            <button class="button">
              <span class="icon">
                <i class="fas fa-plus"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <input class="input" type="text" placeholder="Due Date">
        </div>
      </div>
      <div class="columns">
        <div class="column is-6">
          <div class="field is-grouped is-grouped-multiline">
            <div class="control" v-for="(proj, index) in projects">
              <div class="tags has-addons">
                <span class="tag is-secondary">
                  {{ proj }}
                </span>
                <a class="tag is-delete" v-on:click="projects.splice(index, 1)"></a>
              </div>
            </div>
            <a class="tag is-secondary" v-on:click="newProject=true" v-if="!newProject">
              <span class="icon is-small">
                <i class="fas fa-plus"></i>
              </span>
            </a>
            <div class="field has-addons" v-else>
              <div class="control">
                <input class="input" type="text" placeholder="Project" v-model="newProjectString" v-on:change="appendProject()" autofocus>
              </div>
              <div class="control">
                <button class="button" v-on:click="newProject=false">
                  <span class="icon is-small">
                    <i class="fas fa-times"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-6">
        </div>
      </div>
    </div>
    <div class="card-foot">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Create extends Vue {
  private title: string = '';
  private dueDate: string = '';
  private priority: number = 0;
  private projects: string[] = [];
  private tags: string[] = [];
  private newProject: boolean = false;
  private newProjectString: string = '';
  private appendProject(): void {
    if (this.newProjectString !== '') {
      this.projects.push(this.newProjectString);
      this.newProjectString = '';
    }
    this.newProject = false;
  }
}
</script>
