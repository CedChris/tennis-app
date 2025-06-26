<template>
  <div class="match-list-container">
    <h2>Liste des matchs</h2>
    <ul>
      <li v-for="match in matches" :key="match.id" class="match-card">
        <template v-if="match.joueur1 && match.joueur2">
          <div class="players">
            <strong class="joueur1">
              {{ getNomJoueur(match, 'joueur1') }}
              <span v-if="getClassement(match, 'joueur1')" class="classement">
                ({{ getClassement(match, 'joueur1') }})
              </span>
            </strong>
            
            <span class="vs">vs</span>
            <strong class="joueur2">
              {{ getNomJoueur(match, 'joueur2') }}
              <span v-if="getClassement(match, 'joueur2')" class="classement">
                ({{ getClassement(match, 'joueur2') }})
              </span>
            </strong>
          </div>

          <div class="score">
            <template v-if="match.scoreSets && match.scoreSets.length">
              <span v-for="(set, index) in match.scoreSets" :key="index" class="set-score">
                <span class="score-joueur1">{{ set.joueur1 }}</span> - <span class="score-joueur2">{{ set.joueur2 }}</span> 
              </span>
            </template>
            <template v-else>
              {{ match.score || 'Pas encore joué' }}
            </template>
          </div>

          <div class="match-info">
            <div class="terrain">Terrain : {{ match.terrain }}</div>
            <div class="time">Heure : {{ formatTime(match.date) }}</div>
            <div class="categorie">Catégorie : {{ match.categorie }}</div> <!-- Ajout ici -->
          </div>

          <div v-if="isAuthenticated" class="crud-buttons">
            <router-link class="edit-button":to="{ name: 'EditMatch', params: { documentId: match.documentId } }">✏️</router-link>
            <button @click="deleteMatch(match.documentId)" class="delete-button">🗑️</button>
          </div>
        </template>

        <template v-else>
          <em>Informations incomplètes</em>
        </template>
      </li>
    </ul>
  </div>
  <div v-if="popup.visible" class="popup-overlay">
  <div class="popup">
    <p>{{ popup.message }}</p>
    <button @click="popup.visible = false">Fermer</button>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['isAuthenticated'],
  data() {
    return {
      matches: []
    }
  },
  popup: {
  visible: false,
  message: ''
}
  methods: {
  showPopup(message) {
  this.popup.message = message
  this.popup.visible = true
},
    getNomJoueur(match, joueurKey) {
      return match?.[joueurKey]?.nom || 'Inconnu'
    },
    getClassement(match, joueurKey) {
      return match?.[joueurKey]?.classement || null
    },
    formatTime(dateStr) {
      return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    },
    async deleteMatch(documentId) {
  if (confirm('Voulez-vous vraiment supprimer ce match ?')) {
    const token = localStorage.getItem('token')
    if (!token) {
      this.showPopup('Vous devez être connecté pour supprimer un match.')
      return
    }
    try {
      await axios.delete(`https://ancient-purpose-79e6e65b06.strapiapp.com/api/matches/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Mise à jour locale, on supprime par id (unique dans la liste)
      this.matches = this.matches.filter(match => match.documentId !== documentId)
      this.showPopup('Match supprimé avec succès.')
    } catch (error) {
      console.error('Erreur lors de la suppression du match', error.response)
      this.showPopup('Erreur lors de la suppression : ' + (error.response?.data?.error?.message || 'Erreur inconnue'))
    }
  }
}
  },
  async mounted() {
    try {
      const matchesRes = await axios.get('https://ancient-purpose-79e6e65b06.strapiapp.com/api/matches?populate[joueur1]=true&populate[joueur2]=true')
      this.matches = matchesRes.data.data.filter(match => match.joueur1 && match.joueur2)
    } catch (error) {
      console.error('Erreur lors de la récupération des matchs', error)
    }
  }
}
</script>

<style scoped>
/* GLOBAL */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f4f4;
  color: #333;
  margin: 0;
  padding: 20px;
  overflow-x: hidden; /* Empêche le débordement horizontal */
}
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup {
  background: white;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.25);
  text-align: center;
}

.popup button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.popup button:hover {
  background-color: #2980b9;
}
/* CONTAINER PRINCIPAL */
.match-list-container {
  width: 100%;              /* Pleine largeur */
  max-width: 1400px;        /* Largeur max */
  margin: 0 auto;           /* Centré horizontalement */
  padding: 20px 10px;
  box-sizing: border-box;
}

/* TITRE */
h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

/* LISTE DE MATCHS */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Min 280px pour éviter débordement */
  gap: 20px;
}

/* CARTE MATCH */
.match-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #e8f5e9;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px 24px;
  border: 2px solid #ccc;
  width: 100%;
  box-sizing: border-box;
  transition: transform 0.3s ease;
}

.match-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

/* JOUEURS */
.players {
  font-size: 1.5rem;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;    /* Centre les éléments sur chaque ligne */
  gap: 10px;                  /* Espace entre les joueurs */
  flex-wrap: wrap;            /* Autorise le retour à la ligne */
  text-align: center;
  max-width: 100%;
}

.joueur1, .joueur2 {
  display: flex;
  flex-direction: column; /* Aligne les enfants verticalement */
  align-items: center; /* Aligne à gauche (tu peux mettre "center" si tu préfères centré) */
  gap: 4px; /* Espacement entre les éléments */
  font-weight: 1000;
  white-space: normal;
  word-break: break-word;
}

.joueur1 {
  color: #f1c40f;
}

.joueur2 {
  color: #2980b9;
}
.vs {
  color: #555;
  font-weight: 500;
}

/* SCORE */
.score {
  font-weight: 800;
  margin-top: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.set-score {
  font-size: 2rem;
  margin: 10px;
  display: flex;
  flex-direction: column; /* Affichage vertical */
  align-items: center;    /* Centrage horizontal */
  gap: 10px;              /* Espace entre les scores */
}

.score-joueur1 {
  color: #f1c40f;
  font-weight: 700;
}

.score-joueur2 {
  color: #2980b9;
  font-weight: 700;
}
/* INFOS MATCH */
.match-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  justify-content: center;
}

.terrain, .date, .time {
  background-color: #34495e;
  padding: 6px 12px;
  border-radius: 6px;
}
.categorie {
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: bold;
  margin-top: 6px;
}

.match-card em {
  color: #e74c3c;
  font-style: normal;
  display: block;
  text-align: center;
  padding: 10px 0;
}

/* BOUTONS EDITION & SUPPRESSION */
.crud-buttons {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.edit-button {
  background-color: #3498db;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  text-decoration: none;
}

.edit-button:hover {
  background-color: #2980b9;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c0392b;
}

/* CLASSEMENT */
.classement {
  font-size: 1rem;
  font-weight: 600;
  color: #34495e;         /* Bleu-gris foncé, doux et lisible */
  margin-left: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f1c40f; /* Fond léger, discret */
  display: inline-block;
}

/* RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .match-list-container {
    width: 100%;
    max-width: 100%;
    padding: 10px 5px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  ul {
    display: grid;
    grid-template-columns: 1fr !important;
    width: 100%;
    max-width: 100%;
    padding: 0;
    margin: 0 auto;
  }

  .match-card {
    width: 100% !important;
    max-width: 100% !important;
    min-width: auto !important;
    margin-bottom: 20px;
    box-sizing: border-box;
  }

  .players {
    flex-direction: column;
    font-size: 1.4rem;
    gap: 8px;
  }

  .set-score {
    font-size: 1.6rem;
  }

  .score {
    font-size: 1rem;
    text-align: center;
    margin-top: 6px;
  }

  .match-info {
    flex-direction: column;
    gap: 6px;
    font-size: 0.9rem;
    text-align: center;
  }

  .terrain, .date, .time {
    padding: 4px 8px;
    border-radius: 4px;
  }
}

@media (max-width: 480px) {
  .players {
    font-size: 1.2rem;
  }

  .set-score {
    font-size: 1.4rem;
  }

  .score {
    font-size: 0.9rem;
  }

  .match-info {
    font-size: 0.8rem;
  }
}
</style>
