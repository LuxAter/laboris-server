<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <router-link class="navbar-brand" to="/">Laboris</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
      <span class="navbar-toggler-icon" />
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link active" to="/">Tasks</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/projects">Projects</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/projects">Reports</router-link>
        </li>
      </ul>
    </div>
    <button class="btn btn-success mx-1" type="button" v-on:click="createTask()">New Task</button>
    <button class="btn btn-success mx-1" type="button" v-on:click="createProject()">New Project</button>
  </nav>
</template>

<script>
export default {
  name: 'ToolBar',
  methods: {
    createTask () {
      this.$store.commit('toggleCreateTask')
    },
    createProject () {
      this.$store.commit('toggleCreateProject')
    }
  }
}
</script>
