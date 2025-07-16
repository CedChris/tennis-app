<template>
  <div class="container">
    <div class="header-container">
      <router-link to="/" class="home-link">
        <Logo />
      </router-link>

      <nav class="nav-links">
        <template v-if="isAuthenticated">
          <router-link to="/add-match" class="nav-link">Administrateur</router-link>
          <a href="#" class="nav-link" @click.prevent="logout">Se déconnecter</a>
        </template>

        <template v-else>
          <router-link to="/login" class="nav-link">Se connecter</router-link>
        </template>

        <div>
          <router-link to="/inscription" class="nav-link">Inscription Tennis</router-link>
        </div>
      </nav>
    </div>

    <div class="helloasso-container">
      <h2>Inscription au club de tennis</h2>
      <p>Les inscriptions sont ouvertes via notre plateforme HelloAsso.</p>
      <button @click="redirectToHelloAsso" class="helloasso-button">
        S'inscrire maintenant
      </button>
    </div>
  </div>
</template>

<script>
import Logo from './Logo.vue'

export default {
  name: 'HelloAssoRedirect',
  components: {
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
    },
    redirectToHelloAsso() {
      window.open('https://www.helloasso.com/associations/ton-club/adhesions/inscription-2025', '_blank')
    }
  }
}
</script>

<style scoped>
.container {
  width: 100vw;
  max-width: none;
  margin: 0;
  padding: 20px 30px 40px;
  min-height: 100vh;
  background-color: #fafafa;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
  border-radius: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  width: 90%;
  color: white;
  padding: 20px 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  margin-bottom: 30px;
}

.home-link {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-links {
  display: flex;
  gap: 12px;
}

.nav-link {
  display: inline-block;
  color: #2c3e50;
  font-weight: 700;
  font-size: 1.4rem;
  padding: 10px 16px;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.nav-link:hover {
  background-color: #219150;
  box-shadow: 0 4px 12px rgba(33,145,80,0.4);
}

.helloasso-container {
  text-align: center;
  padding: 3rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  width: 100%;
}

.helloasso-button {
  padding: 1rem 2rem;
  background-color: #14b866;
  color: white;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.helloasso-button:hover {
  background-color: #119e57;
}

@media (max-width: 800px) {
  .header-container {
    flex-direction: column;
    align-items: center;
  }
  .nav-links {
    flex-direction: column;
    align-items: center;
  }
}
</style>