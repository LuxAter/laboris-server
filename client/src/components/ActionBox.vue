<template>
  <div class="column is-8 is-offset-2">
    <div class="box">
      <h3 class="title has-text-grey">Search</h3>
      <div class="field">
        <div class="control has-icons-right">
          <input class="input" type="text" v-model="searchString" v-bind:class="{'is-success': searchString !== ''}"/>
          <span class="icon is-small is-right">
            <i class="fas fa-search" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ActionBox extends Vue {
  private searchString: string = '';
  private mode: number = 0;
}

</script>
