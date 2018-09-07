<template>
  <form>
    <div class="card col-md-9 mx-auto">
      <div class="card-body">
        <h3 class="card-title">Login</h3>
        <div class="form-row">
          <div class="form-group col-md-12">
            <input type="email" class="form-control" placeholder="Email" v-model="email"/>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-12">
            <input type="password" class="form-control" placeholder="Password" v-model="password"/>
          </div>
        </div>
        <div class="form-row" v-if="register">
          <div class="form-group col-md-12">
            <input type="password" class="form-control" placeholder="Verify Password" v-model="password_2"/>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <button type="button" class="btn btn-link bnt-block float-md-left" v-on:click="register=!register" v-if="!register">Register</button>
            <button type="button" class="btn btn-link bnt-block float-md-left" v-on:click="register=!register" v-if="register">Login</button>
          </div>
          <div class="form-group col-md-6">
            <button type="button" class="btn btn-success bnt-block float-md-right" v-if="!register" v-on:click="login()">Login</button>
            <button type="button" class="btn btn-success bnt-block float-md-right" v-if="register">Register</button>
          </div>
          {{ this.$store.error }}
        </div>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      register: false,
      email: '',
      password: '',
      password_2: ''
    }
  },
  methods: {
    login () {
      this.$store.dispatch('login', this.$data.email, this.$data.password)
    }
  }
}
</script>
