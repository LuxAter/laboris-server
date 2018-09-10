<template>
  <div class="main">
    <Navbar />
    <div class="p-3 container flex-md-center">
      <Login v-if="login"/>
      <CreateTask v-if="createTask"/>
      <CreateProject v-if="this.$store.state.createProject"/>
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import CreateTask from './CreateTask.vue'
import CreateProject from './CreateProject.vue'
import Login from './Login.vue'
export default {
  name: 'Home',
  components: {
    Navbar,
    Footer,
    CreateTask,
    CreateProject,
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
