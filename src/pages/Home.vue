<template>
  <div class="container">
    <router-link to="/" class="home-link"><Logo /></router-link>

    <template v-if="isAuthenticated">
      <button @click="logout" class="logout-button">Se déconnecter</button>
      <router-link to="/add-match" class="add-match-button">Gestion des matches/joueurs</router-link>
      <button @click="updateDate">Changer la date</button>
    </template>
    <template v-else>
      <div class="login-container">
        <router-link to="/login" class="login-link">Se connecter</router-link>
        <p class="warning-text">
          ⚠️ Se connecter est utile uniquement pour les organisateurs du tournoi.
        </p>
      </div>
    </template>
<div class="date-container">
      Date : {{ currentDate }}
    </div>
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
      isAuthenticated: false,
      currentDate: ''  // Ajout de la date ici
    }
  },
  mounted() {
    const token = localStorage.getItem('token')
    if (token) {
      this.isAuthenticated = true
    }

    // Charger la date depuis localStorage ou définir la date du jour
    const savedDate = localStorage.getItem('currentDate')
    if (savedDate) {
      this.currentDate = savedDate
    } else {
      this.updateDate()
    }
  },
  methods: {
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
      localStorage.setItem('currentDate', this.currentDate)  // Sauvegarde dans localStorage
    }
  }
}
</script>

<style>
.container {
  width: 90vw;          /* largeur à 90% de la largeur de la fenêtre */
  max-width: 1400px;    /* limite max pour ne pas trop étirer */
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
.home-link {
  align-self: center;
  margin-bottom: 25px;
  display: inline-flex;
  transition: transform 0.25s ease;
}
.date-container {
  margin-top: 20px;
  font-size: 1.2rem;
  font-weight: 800;
  color: #333;
  text-align: center;
}
/* Bouton déconnexion */
.logout-button {
  background-color: #e74c3c;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 15px;
  align-self: flex-end;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}
.logout-button:hover {
  background-color: #c0392b;
  box-shadow: 0 4px 12px rgba(192,57,43,0.5);
}

/* Bouton ajouter un match */
.add-match-button {
  display: inline-block;
  background-color: #27ae60;
  color: white;
  padding: 12px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  margin: 10px 0 30px;
  align-self: center;
  box-shadow: 0 4px 14px rgba(39,174,96,0.3);
}
.add-match-button:hover {
  background-color: #219150;
  transform: scale(1.05);
  box-shadow: 0 6px 18px rgba(33,145,80,0.5);
}

/* Container connexion */
.login-container {
  width: 100%;
  max-width: 400px;
  text-align: center;
  margin-bottom: 40px;
}

.login-link {
  display: inline-block;
  background-color: #27ae60;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 12px 28px;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}
.login-link:hover {
  background-color: #219150;
  box-shadow: 0 4px 12px rgba(33,145,80,0.4);
}
.login-link:active {
  background-color: #1b6f3f;
}

/* Texte avertissement */
.warning-text {
  margin-top: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #e67e22;
  user-select: none;
  font-style: italic;
}

/* Responsive */
@media (max-width: 480px) {
  .container {
    padding: 0 15px 30px;
    margin: 15px auto;
  }
  .logout-button,
  .add-match-button,
  .login-link {
    width: 100%;
    padding: 14px 0;
    font-size: 1rem;
  }
  .home-link {
  align-self: center; /* Centrer dans le flex parent */
  margin-bottom: 25px;
  display: inline-flex;
  transition: transform 0.25s ease;
}
  .add-match-button {
    display: block; /* Pour que le bouton prenne toute la largeur */
    width: 100%;
    padding: 16px 0; /* Plus de hauteur, pas de padding horizontal */
    font-size: 1.3rem; /* Texte plus grand */
    text-align: center;
    margin: 20px auto; /* Centré verticalement */
    border-radius: 12px; /* Coins plus arrondis sur mobile */
  }
}

</style>
