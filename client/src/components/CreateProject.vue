<template>
  <form>
    <div class="card col-md-9 mx-auto my-2">
      <div class="card-body">
        <h3 class="card-title">Create Project</h3>
        <div class="form-row">
          <div class="form-group col-md-12">
            <input type="text" class="form-control" placeholder="Title" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-1">
            <img class="mx-auto my-auto" v-bind:src="'https://placehold.it/32/' + color + '/000000?text=+'">
          </div>
          <div class="form-group col-md-5">
            <div class="input-group col-md-12">
              <div class="input-group-prepend">
                <button type="button" class="btn btn-primary" v-on:click="randomize()">
                  <i class="fa fa-random"></i>
                </button>
              </div>
              <input type="text" class="form-control" placeholder="Color" />
            </div>
          </div>
          <div class="form-group col-md-6">
            <button type="button" class="btn btn-success btn-block float-md-right">Create</button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'CreateProject',
  data () {
    return {
      color: 'FF9911',
      imgUrl: 'https://placehold.it/32/FF6090/000000?text=+'
    }
  },
  mounted () {
    this.randomize()
  },
  methods: {
    randomize () {
      this.$data.color = ''
      for (var i = 0; i < 6; i++) {
        this.$data.color += Math.floor(Math.random() * 16).toString(16)
      }
    }
  }
}
</script>
