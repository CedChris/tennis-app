<template>
  <div>
    <h2>Liste des matchs</h2>
    <ul>
      <li v-for="match in matches" :key="match.id" class="match-card">
        <template v-if="match.joueur1 && match.joueur2">
          <div class="players">
            <strong class="joueur1">{{ getNomJoueur(match, 'joueur1') }}</strong>
            <span class="vs">vs</span>
            <strong class="joueur2">{{ getNomJoueur(match, 'joueur2') }}</strong>
          </div>

          <div class="score">
            <span>Score :</span>
            <template v-if="match.scoreSets && match.scoreSets.length">
              <span v-for="(set, index) in match.scoreSets" :key="index" class="set-score">
                [ <span class="score-joueur1">{{ set.joueur1 }}</span> - <span class="score-joueur2">{{ set.joueur2 }}</span> ]
              </span>
            </template>
            <template v-else>
              {{ match.score || 'Pas encore joué' }}
            </template>
          </div>

          <div class="match-info">
            <div class="terrain">Terrain : {{ match.terrain }}</div>
            <div class="date">Date : {{ formatDate(match.date) }}</div>
          </div>

          <!-- Boutons CRUD visibles uniquement si l'utilisateur est authentifié -->
          <div v-if="isAuthenticated" class="crud-buttons">
            <router-link :to="`/edit-match/${match.id}`" class="edit-button">Modifier</router-link>
            <button @click="deleteMatch(match.id)" class="delete-button">Supprimer</button>
          </div>
        </template>

        <template v-else>
          <em>Informations incomplètes</em>
        </template>
      </li>
    </ul>
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
  methods: {
    getNomJoueur(match, joueurKey) {
      return match?.[joueurKey]?.nom || 'Inconnu'
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    async deleteMatch(id) {
      if (confirm('Voulez-vous vraiment supprimer ce match ?')) {
        const token = localStorage.getItem('token')
        try {
          await axios.delete(`https://ancient-purpose-79e6e65b06.strapiapp.com/api/matches/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          this.matches = this.matches.filter(match => match.id !== id)
        } catch (error) {
          console.error('Erreur lors de la suppression du match', error)
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

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f4f4;
  color: #333;
  margin: 0;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

ul {
  list-style: none;
  padding: 0;
  max-width: 700px;
  margin: 0 auto 40px auto;
}
.match-info {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
}

.terrain {
  background-color: #34495e; /* bleu foncé */
  padding: 4px 10px;
  border-radius: 6px;
}

.date {
  background-color: #34495e;; /* orange chaleureux */
  padding: 4px 10px;
  border-radius: 6px;
}
.match-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px 24px;
  margin-bottom: 20px;
  border: 2px solid #ccc; /* bordure visible par défaut */
}
.players {
  font-size: 1.3rem;
  color: #27ae60;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
  font-weight: 700;
}

.joueur1 {
  color: #f1c40f; /* jaune */
  font-weight: 800;
}

.joueur2 {
  color: #2980b9; /* bleu */
  font-weight: 800;
}

.vs {
  color: #555;
  font-weight: 500;
}

.score {
  font-weight: 800;
  margin-top: 8px;
}

.set-score {
  margin-right: 10px;
  font-size: 2rem;
}

.score-joueur1 {
  color: #f1c40f; /* jaune */
  font-weight: 700;
}

.score-joueur2 {
  color: #2980b9; /* bleu */
  font-weight: 700;
}
.infos {
  display: flex;
  justify-content: space-around;
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
}

.infos span {
  background-color: #ecf0f1;
  padding: 6px 12px;
  border-radius: 10px;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}

.match-card em {
  color: #e74c3c;
  font-style: normal;
  display: block;
  text-align: center;
  padding: 10px 0;
}

.player-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  transition: background-color 0.2s ease;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 600;
}

.player-item:hover {
  background-color: #f1f1f1;
}
.crud-buttons {
  margin-top: 10px;
}

.edit-button {
  margin-right: 10px;
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

@media (max-width: 600px) {

  @media (max-width: 600px) {
  .players {
    flex-direction: column;
    text-align: center;
    font-size: 1rem; /* réduit la taille des noms */
    gap: 4px; /* réduit l'espacement */
  }

  .set-score {
    display: inline-block;
    margin-bottom: 6px;
    font-size: 1.2rem; /* réduit encore la taille du score */
  }

  .score {
    font-size: 0.9rem; /* réduit la taille du texte "Score :" */
    text-align: center;
    margin-top: 4px;
  }

  .match-card {
    padding: 12px 16px; /* réduit l'espace intérieur de la carte */
  }

  .match-info {
    flex-direction: column; /* stack les infos terrain/date en colonne */
    gap: 4px; /* réduit l’espacement */
    font-size: 0.8rem; /* réduit la taille du texte terrain/date */
    text-align: center;
  }

  .terrain, .date {
    padding: 3px 8px; /* réduit le padding des badges */
    border-radius: 4px; /* arrondis plus petits */
  }
}
}
</style>