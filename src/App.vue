<template>
  <div id="app" class="container">
    <template v-if="isAuthenticated">
      <Logo />
      <button @click="logout" class="logout-button">Se déconnecter</button>
      <MatchList />
    </template>

    <template v-else>
      <LoginForm @login-success="handleLoginSuccess" />
    </template>
  </div>
</template>

<script>
import MatchList from './components/MatchList.vue'
import Logo from './components/Logo.vue'
import LoginForm from './components/LoginForm.vue'

export default {
  name: 'App',
  components: {
    MatchList,
    Logo,
    LoginForm
  },
  data() {
    return {
      isAuthenticated: false
    }
  },
  mounted() {
    const token = localStorage.getItem('token')
    if (token) {
      this.isAuthenticated = true
    }
  },
  methods: {
    handleLoginSuccess() {
      this.isAuthenticated = true
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.isAuthenticated = false
    }
  }
}
</script>

<style>
.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #fafafa;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  color: #2c3e50;
}

h1 {
  text-align: center;
  font-weight: 700;
  font-size: 2.4rem;
  margin-bottom: 40px;
  color: #34495e;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
}

.match-card {
  background-color: white;
  border-radius: 10px;
  padding: 16px 24px;
  margin-bottom: 20px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  border: 2px solid #ddd;
}

.match-card:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  transform: translateY(-4px);
  border-color: #2980b9;
}

.logout-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin: 20px 0;
}

.logout-button:hover {
  background-color: #c0392b;
}
</style>