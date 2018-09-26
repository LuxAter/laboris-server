<template>
  <div>
    <Header />
    <main class="container">
      <Login v-if="$store.state.userEmail === undefined" />
      <div v-if="$store.state.userEmail !== undefined">
        <ActionBox />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Login from '@/components/Login.vue';
import ActionBox from '@/components/ActionBox.vue';
import TaskList from '@/components/TaskList.vue';

@Component({
  components: {
    Header,
    Footer,
    Login,
    ActionBox,
  },
})
export default class Home extends Vue {}
</script>
