<template>
  <div class="container">
    <div class="header-container">
  <router-link to="/" class="home-link">
    <Logo />
  </router-link>
  <div class="menu-toggle" @click="toggleMenu">☰</div>
  <nav :class="['nav-links', { open: showMenu }]">
    <div>
      <router-link to="/inscription" class="nav-link">Inscription Tennis</router-link>
    </div>
    <template v-if="isAuthenticated">
      <router-link to="/add-match" class="nav-link">Administrateur</router-link>
      <a href="#" class="nav-link" @click.prevent="logout">Se déconnecter</a>
    </template>

    <template v-else>
      <router-link to="/login" class="nav-link">Se connecter</router-link>
    </template>
    
  </nav>
</div>
    <MatchList :isAuthenticated="isAuthenticated" />
  </div>
</template>
<script>
import MatchList from '../components/MatchList.vue'
import Logo from '../components/Logo.vue'
import Inscription from '../components/Inscription.vue'

export default {
  name: 'Home',
  components: {
    MatchList,
    Logo,
    Inscription
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
  width: 100%; /* largeur entière de la fenêtre */
  max-width: none; /* enlever max-width */
  margin: 0; /* enlever la marge auto */
  padding: 20px 30px 40px; /* garder le padding si besoin */
  min-height: 100vh; /* au moins toute la hauteur de la fenêtre */
  background-color: #fafafa;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
  border-radius: 0; /* ou garder à 12px si tu veux */
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
}
.header-container {
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  color: white;
  padding: 20px 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* ombre légère */
  font-family: 'Roboto', sans-serif;
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
.menu-toggle {
  display: none;
  font-size: 2rem;
  cursor: pointer;
  color: #2c3e50;
}
@media (max-width: 950px) {
  .header-container {
    flex-direction: column;
    align-items: flex-start;
  }
  @media (max-width: 950px) {
  .header-container {
    flex-direction: column;
    align-items: flex-start;
  }
  .home-link {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
  .menu-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }

  .nav-links.open {
    display: flex;
  }

  .nav-link {
    width: 100%;
    text-align: left;
    padding: 12px 20px;
    border-radius: 0;
    border-bottom: 1px solid #ccc;
  }
}
  .menu-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }

  .nav-links.open {
    display: flex;
  }

  .nav-link {
    width: 100%;
    text-align: left;
    padding: 12px 20px;
    border-radius: 0;
    border-bottom: 1px solid #ccc;
  }
}
</style>
