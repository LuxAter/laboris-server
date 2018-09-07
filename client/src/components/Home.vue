<template>
  <div class="main">
    <Navbar />
    <div class="p-3 container flex-md-center">
      <Login v-if="login"/>
      <CreateTask v-if="createTask"/>
    </div>
  </div>
</template>

<script>
import Navbar from './Navbar.vue'
import CreateTask from './CreateTask.vue'
import Login from './Login.vue'
export default {
  name: 'Home',
  components: {
    Navbar,
    CreateTask,
    Login
  },
  computed: {
    email () {
      return this.$store.state.email
    },
    login () {
      return (this.$store.state.email === null)
    },
    createTask () {
      return this.$store.state.createTask
    }
  }
}
</script>
