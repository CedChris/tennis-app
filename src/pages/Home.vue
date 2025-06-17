<template>
  <div class="container">
    <router-link to="/" class="home-link"><Logo /></router-link>
    
    <template v-if="isAuthenticated">
      <button @click="logout" class="logout-button">Se déconnecter</button>
    </template>
    <template v-else>
      <div class="login-container">
        <router-link to="/login" class="login-link">Se connecter</router-link>
        <p class="warning-text">
          ⚠️ Se connecter est utile uniquement pour les organisateurs du tournoi.
        </p>
      </div>
    </template>
    <MatchList :isAuthenticated="isAuthenticated" />
  </div>
</template>

<script>
import MatchList from '../components/MatchList.vue'
import Logo from '../components/Logo.vue'

export default {
  name: 'Home',
  components: {
    MatchList,
    Logo
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
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.isAuthenticated = false
    }
  }
}
</script>

<style>
.login-link {
  display: inline-block;
  padding: 10px 22px;
  background-color: #27ae60; /* vert agréable */
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  user-select: none;
}

.login-link:hover {
  background-color: #219150; /* vert un peu plus foncé au survol */
  box-shadow: 0 4px 8px rgba(33, 145, 80, 0.4);
}

.login-link:active {
  background-color: #1b6f3f; /* vert encore plus foncé quand on clique */
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;   /* centre horizontalement */
  margin-top: 10px;
  width: 100%;
}

.warning-text {
  margin-top: 6px;
  color: #e67e22; /* orange chaleureux */
  font-size: 0.9rem;
  font-weight: 600;
  user-select: none;
  text-align: center;    /* centre le texte */
}
</style>
