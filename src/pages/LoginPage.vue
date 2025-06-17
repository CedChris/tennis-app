<template>
  <div class="container">
    <router-link to="/" class="home-link"><Logo /></router-link>
    <LoginForm @login-success="handleLoginSuccess" />
  </div>
</template>

<script>
import LoginForm from '../components/Login.vue'
import Logo from '../components/Logo.vue'

export default {
  name: 'Login',
  components: {
    LoginForm,
    Logo
  },
  methods: {
    handleLoginSuccess() {
      this.$router.push('/')
    }
  }
}
</script>