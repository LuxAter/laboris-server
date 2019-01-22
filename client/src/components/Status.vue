<template>
  <article class="message" v-bind:class="{'is-danger': $store.state.responseStatus.status === 'error', 'is-info': $store.state.responseStatus.status === 'info', 'is-success': $store.state.responseStatus.status === 'success'}">
    <div class="message-header">
      <p v-if="$store.state.responseStatus.status === 'error'">Error</p>
      <p v-else-if="$store.state.responseStatus.status === 'success'">Success</p>
      <p v-else-if="$store.state.responseStatus.status === 'info'">Info</p>
      <button class="delete" v-on:click="$store.commit('setStatus', null)"></button>
    </div>
    <div class="message-body">
      {{ $store.state.responseStatus.message }}
    </div>
  </article>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Status extends Vue {}
</script>
