<template>
  <div class="container">
    <div class="header-container">
  <router-link to="/" class="home-link">
    <Logo />
  </router-link>

  <nav class="nav-links">
    <template v-if="isAuthenticated">
      <router-link to="/add-match" class="nav-link">Matches/Joueurs</router-link>
      <a href="#" class="nav-link" @click.prevent="logout">Se déconnecter</a>
    </template>

    <template v-else>
      <router-link to="/login" class="nav-link">Se connecter</router-link>
    </template>
  </nav>
</div>
<Blog/>
    <MatchList :isAuthenticated="isAuthenticated" />
  </div>
</template>
<script>
import MatchList from '../components/MatchList.vue'
import Logo from '../components/Logo.vue'
import Blog from '../components/Blog.vue'

export default {
  name: 'Home',
  components: {
    MatchList,
    Logo,
    Blog
  },
  data() {
    return {
      isAuthenticated: false,
      events: [],
      selectedEvent: '',
      showMenu: false,
    }
  },
  mounted() {
    const token = localStorage.getItem('token')
    if (token) {
      this.isAuthenticated = true
    }
  },
  methods: {
    toggleMenu() {
  this.showMenu = !this.showMenu;
},
goToManage() {
  this.$router.push('/add-match');
},
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.isAuthenticated = false
    },
    updateDate() {
      const today = new Date()
      const day = String(today.getDate()).padStart(2, '0')
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const year = today.getFullYear()
      this.currentDate = `${day}/${month}/${year}`
      localStorage.setItem('currentDate', this.currentDate)
    }
  }
}
</script>
<style>
.container {
  width: 90vw;
  max-width: 1400px;
  margin: 30px auto;
  padding: 20px 30px 40px;
  background-color: #fafafa;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
}

.header-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #f9f9f9;
}

.home-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 15px;
  border-bottom: 2px solid #ddd;
  margin-bottom: 20px;
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

@media (max-width: 600px) {
  .header-container {
    flex-direction: column;
    align-items: center;
  }
  .nav-links{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
