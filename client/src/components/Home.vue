<template>
  <div class="main">
    <Navbar />
    <div class="p-3 container flex-md-center">
      <CreateTask v-if="createTask"/>
    </div>
  </div>
</template>

<script>
import Navbar from './Navbar.vue'
import CreateTask from './CreateTask.vue'
export default {
  name: 'Home',
  components: {
    Navbar,
    CreateTask
  },
  computed: {
    email () {
      return this.$store.state.email
    },
    createTask () {
      return this.$store.state.createTask
    }
  }
}
</script>
