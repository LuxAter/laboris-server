<template>
  <div class="taskList">
    <div class="card col-md-12 mx-auto my-1" v-for="task in this.$store.state.tasks" v-bind:key="task.uuid">
      <div class="container">
        <div class="row">
          <div class="col-md-2">
            <button type="button" class="m-3 btn btn-success btn-circle btn-xl" v-if="!task.active">
              <i class="fa fa-play"></i>
            </button>
            <button type="button" class="m-3 btn btn-warning btn-circle btn-xl" v-else>
              <i class="fa fa-stop"></i>
            </button>
          </div>
          <div class="col-md-10">
            <div class="card-body">
              <h4 class="card-title">{{ task.title }}</h4>
              <div class="entryDate">{{ task.entryDate }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskList'
}
</script>
