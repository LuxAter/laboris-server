<template>
  <div>
    <Header />
    <main class="container">
      <Login v-if="$store.userEmail === undefined" />
    </main>
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Login from '@/components/Login.vue';
import TaskList from '@/components/TaskList.vue';

@Component({
  components: {
    Header,
    Footer,
    Login,
    TaskList,
  },
})
export default class Home extends Vue {
  constructor() {
    super();
    this.axios.get('/api/user/current').then((response) => {
      if(!('error' in response.data)){
        this.$store.commit('setEmail', response.data.email);
        this.$store.dispatch('loadTasks');
      }
    });
  }
}
</script>
