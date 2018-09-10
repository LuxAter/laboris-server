<template>
  <footer class="footer p-3 bg-dark" style="position: absolute;left: 0;bottom: 0;width:100%;overflow:hidden;">
    <div class="container">
      <ul class="list-group list-group-flush">
        <button class="list-group-item list-group-item-action" v-if="!login" v-on:click="logout()">Logout</button>
      </ul>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  methods: {
    logout () {
      this.$store.dispatch('logout')
    }
  },
  computed: {
    login () {
      return (this.$store.state.email === null)
    }
  }
}
</script>
