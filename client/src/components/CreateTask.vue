<template>
  <form>
    <div class="card col-md-9 mx-auto my-2">
      <div class="card-body">
        <h3 class="card-title">Create Task</h3>
        <div class="form-row">
          <div class="form-group col-md-12">
            <input type="text" class="form-control" placeholder="Title" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <input type="text" class="form-control" placeholder="Projects" />
          </div>
          <div class="form-group col-md-6">
            <input type="text" class="form-control" placeholder="Tags" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-4">
            <input type="text" class="form-control" placeholder="Due Date" />
          </div>
          <div class="form-group col-md-4">
            <input type="number" class="form-control" min="0" max="10" placeholder="0">
          </div>
          <div class="form-group col-md-4">
            <button type="button" class="btn btn-success btn-block float-md-right">Create</button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'CreateTask'
}
</script>
