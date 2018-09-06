<template>
  <div>
    <ToolBar></ToolBar>
    <h1>Settings</h1>
    <p>Count: {{ count }}</p>
  </div>
</template>

<script>
import ToolBar from './ToolBar.vue'
export default {
  name: 'Settings',
  components: {
    ToolBar
  },
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
</script>
