<template>
  <div class="date-filter"> 
    <label for="date">
      Filtrer par date :
      <span class="tooltip">❔
        <span class="tooltiptext">Choisissez une date pour filtrer les matches</span>
      </span>
    </label>
    <input
      type="date"
      id="date"
      v-model="selectedDate"
    />
    <button @click="selectedDate = null">
      Voir tous les matches
    </button>
  </div>

  <div class="match-list-container">
    <h2>Liste des matchs</h2>
    <ul>
      <li v-for="match in filteredMatches" :key="match.id" class="match-card">
        <template v-if="match.joueur1 && match.joueur2">
          <div class="players">
            <strong
              class="joueur1"
              :class="{ winner: getVainqueurSets(match) === 'joueur1' }"
            >
              {{ getNomJoueur(match, 'joueur1') }}
              <span v-if="getClassement(match, 'joueur1')" class="classement">
                ({{ getClassement(match, 'joueur1') }})
              </span>
            </strong>

            <span class="vs">vs</span>

            <strong
              class="joueur2"
              :class="{ winner: getVainqueurSets(match) === 'joueur2' }"
            >
              {{ getNomJoueur(match, 'joueur2') }}
              <span v-if="getClassement(match, 'joueur2')" class="classement">
                ({{ getClassement(match, 'joueur2') }})
              </span>
            </strong>
          </div>

          <div class="score">
            <template v-if="match.scoreSets && match.scoreSets.length">
              <span
                v-for="(set, index) in match.scoreSets"
                :key="index"
                class="set-score"
              >
                <div class="score-controls">
                  <span class="score-joueur1">
                    {{ set.joueur1 }}
                  </span>
                  <div v-if="isAuthenticated" class="score-buttons">
                    <button @click="updateScore(match, index, 'joueur1', 1)">+</button>
                    <button @click="updateScore(match, index, 'joueur1', -1)">–</button>
                  </div>
                </div>

                <div class="score-controls">
                  <span class="score-joueur2">
                    {{ set.joueur2 }}
                  </span>
                  <div v-if="isAuthenticated" class="score-buttons">
                    <button @click="updateScore(match, index, 'joueur2', 1)">+</button>
                    <button @click="updateScore(match, index, 'joueur2', -1)">–</button>
                  </div>
                </div>
              </span>
            </template>
            <template v-else>
              {{ match.score || 'Pas encore joué' }}
            </template>
          </div>

          <div class="match-info">
            <div class="terrain">Terrain : {{ match.terrain }}</div>
            <div class="time">Heure : {{ formatTime(match.date) }}</div>
            <div class="categorie">Catégorie : {{ match.categorie }}</div>
          </div>

          <div class="crud-buttons" v-if="isAuthenticated">
          <router-link class="edit-button" :to="{ name: 'EditMatch', params: { documentId: match.documentId } }">✏️</router-link>
    <button @click="deleteMatch(match.documentId)" class="delete-button">🗑️</button>
    <button @click="ajouterSet(match)" class="add-set-button">➕ Set</button>
    <button @click="supprimerDernierSet(match)" class="remove-set-button">➖ Set</button>
    <button @click="mettreWO(match, 'joueur1')" class="wo-button">WO J1</button>
    <button @click="mettreWO(match, 'joueur2')" class="wo-button">WO J2</button>
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
      matches: [],
      selectedDate: new Date().toISOString().split('T')[0],
    }
  },
  computed: {
    filteredMatches() {
      if (this.selectedDate) {
        const selected = new Date(this.selectedDate).toISOString().split("T")[0];
        return this.matches.filter(match => {
          const matchDate = new Date(match.date).toISOString().split("T")[0];
          return matchDate === selected;
        });
      }
      return this.matches;
    }
  },
  methods: {
    async loadMatches() {
      try {
        const res = await axios.get('https://ancient-purpose-79e6e65b06.strapiapp.com/api/matches?populate[joueur1]=true&populate[joueur2]=true')
        this.matches = res.data.data
          .filter(match => match.joueur1 && match.joueur2)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
      } catch (error) {
        console.error('Erreur lors de la récupération des matchs', error)
      }
    },
getVainqueurSets(match) {
  let joueur1Sets = 0;
  let joueur2Sets = 0;

  if (!match.scoreSets) return null;

  for (const set of match.scoreSets) {
    // Cas de WO : joueur1 a WO → joueur2 gagne 2 sets automatiquement
    if (set.joueur1 === 'WO') return 'joueur2';
    if (set.joueur2 === 'WO') return 'joueur1';

    const s1 = Number(set.joueur1);
    const s2 = Number(set.joueur2);

    if ((s1 >= 6 || s1 === 7) && s1 > s2) {
      joueur1Sets++;
    } else if ((s2 >= 6 || s2 === 7) && s2 > s1) {
      joueur2Sets++;
    }
  }

  if (joueur1Sets >= 2 && joueur1Sets > joueur2Sets) return 'joueur1';
  if (joueur2Sets >= 2 && joueur2Sets > joueur1Sets) return 'joueur2';
  return null;
},
async ajouterSet(match) {
  const token = localStorage.getItem('token');
  match.scoreSets.push({ joueur1: 0, joueur2: 0 });
  const API_URL = 'https://ancient-purpose-79e6e65b06.strapiapp.com/api/matches';

  try {
    await axios.put(`${API_URL}/${match.documentId}`, {
      data: {
        scoreSets: match.scoreSets
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`, // à remplacer si nécessaire
      }
    });

    console.log('Set ajouté et mis à jour dans Strapi');
  } catch (error) {
    console.error('Erreur lors de l’ajout du set :', error);
  }
},
async supprimerDernierSet(match) {
  if (match.scoreSets.length === 0) return;
  const API_URL = 'https://ancient-purpose-79e6e65b06.strapiapp.com/api/matches';
  const token = localStorage.getItem('token');

  match.scoreSets.pop();

  try {
    await axios.put(`${API_URL}/${match.documentId}`, {
      data: {
        scoreSets: match.scoreSets
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    console.log('Dernier set supprimé et mis à jour');
  } catch (error) {
    console.error('Erreur lors de la suppression du set :', error);
  }
},

async mettreWO(match, joueur) {
  const token = localStorage.getItem('token');

  // Vérifie qu'il y a au moins un set
  if (!match.scoreSets || match.scoreSets.length === 0) {
    console.warn("Aucun set à modifier.");
    return;
  }

  // Récupère le dernier set
  const dernierSetIndex = match.scoreSets.length - 1;
  const dernierSet = match.scoreSets[dernierSetIndex];

  // Applique le WO au bon joueur
  if (joueur === 'joueur1') {
    dernierSet.joueur1 = 'WO';
    dernierSet.joueur2 = 0;
  } else {
    dernierSet.joueur1 = 0;
    dernierSet.joueur2 = 'WO';
  }

  try {
    await axios.put(
      `https://ancient-purpose-79e6e65b06.strapiapp.com/api/matches/${match.documentId}`,
      {
        data: {
          scoreSets: match.scoreSets
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    this.$forceUpdate(); // force le rafraîchissement de la vue si nécessaire
  } catch (error) {
    console.error('Erreur lors de la mise à jour du WO :', error);
  }
},
    async updateScore(match, setIndex, joueurKey, increment) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté pour modifier le score.');
        return;
      }
      const newScoreSets = JSON.parse(JSON.stringify(match.scoreSets));
      const currentScore = newScoreSets[setIndex][joueurKey];
      const updatedScore = Math.max(0, currentScore + increment);
      newScoreSets[setIndex][joueurKey] = updatedScore;

      try {
        await axios.put(
          `https://ancient-purpose-79e6e65b06.strapiapp.com/api/matches/${match.documentId}`,
          {
            data: {
              scoreSets: newScoreSets
            }
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        match.scoreSets = newScoreSets;
        await this.loadMatches(); // recharge les données sans trier à nouveau
      } catch (error) {
        console.error('Erreur lors de la mise à jour du score', error.response);
        alert('Erreur lors de la mise à jour : ' + (error.response?.data?.error?.message || 'Erreur inconnue'));
      }
    },

    getNomJoueur(match, joueurKey) {
      return match?.[joueurKey]?.nom || 'Inconnu';
    },

    getClassement(match, joueurKey) {
      return match?.[joueurKey]?.classement || null;
    },

    formatTime(dateStr) {
      const date = new Date(dateStr);
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },

    async deleteMatch(documentId) {
      if (confirm('Voulez-vous vraiment supprimer ce match ?')) {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Vous devez être connecté pour supprimer un match.');
          return;
        }
        try {
          await axios.delete(`https://ancient-purpose-79e6e65b06.strapiapp.com/api/matches/${documentId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.matches = this.matches.filter(match => match.documentId !== documentId);
          alert('Match supprimé avec succès.');
        } catch (error) {
          console.error('Erreur lors de la suppression du match', error.response);
          alert('Erreur lors de la suppression : ' + (error.response?.data?.error?.message || 'Erreur inconnue'));
        }
      }
    }
  },
  mounted() {
    this.loadMatches();
    this.pollingInterval = setInterval(() => {
      this.loadMatches(); // recharge sans casser l'ordre initial
    }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.pollingInterval);
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
/* CONTAINER PRINCIPAL */
.match-list-container {
  width: 100%;              /* Pleine largeur */
  max-width: 1400px;        /* Largeur max */
  margin: 0 auto;           /* Centré horizontalement */
  padding: 20px 10px;
  box-sizing: border-box;
}
.tooltip {
  position: relative;
  cursor: help;
  margin-left: 5px;
}
.tooltiptext {
  visibility: hidden;
  width: 200px;
  background-color: #333;
  color: #fff;
  text-align: left;
  border-radius: 6px;
  padding: 6px;
  position: absolute;
  z-index: 1;
  bottom: 125%; /* au-dessus */
  left: 50%;
  margin-left: -100px;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 12px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
.winner {
  border: 2px solid green;
  border-radius: 4px;
  padding: 2px 6px;
  font-weight: bold;
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Max 4 par ligne si l’espace le permet */
  gap: 20px;
  justify-items: center;
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
  max-width: 320px;               /* Taille max par carte */
  min-height: 400px;              /* Hauteur uniforme */
  box-sizing: border-box;
  transition: transform 0.3s ease;
}

.match-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
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
  text-shadow:
    -1px -1px 0 #000,
     1px -1px 0 #000,
    -1px  1px 0 #000,
     1px  1px 0 #000;
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
.score-controls{
 display: flex;
}
.score-buttons {
  display: inline-flex;
  flex-direction: column;
  border-radius: 8px;
  align-items: center;
  gap: 4px;
  margin-left: 6px;
  background-color: #18abc5f1;
}
.score-buttons button {
  background: none;
  border: none;
  border-radius: 4px;
  padding: 2px 6px;
  font-weight: 900;
  cursor: pointer;
  transition: background 0.2s;
  color: white;
}
.score-buttons button:hover {
  background: #bee5eb;
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

/* ────────────── CONTENEUR CRUD ────────────── */
.crud-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-top: 1em;
}

/* ────────────── BOUTONS GÉNÉRIQUES ────────────── */
.crud-buttons a,
.crud-buttons button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5em 0.6em;
  font-size: 1.2em;
  border: none;
  border-radius: 4px;
  background: #eee;
  color: #333;
  cursor: pointer;
  text-decoration: none; /* utile pour les <a> */
  transition: background 0.2s ease;
}

/* Hover générique */
.crud-buttons a:hover,
.crud-buttons button:hover {
  background: #ddd;
}

/* ────────────── STYLES SPÉCIFIQUES PAR ACTION ────────────── */

/* Édition */
.crud-buttons .edit-button {
  background: #d1ecf1;
  color: #0c5460;
}
.crud-buttons .edit-button:hover {
  background: #bee5eb;
}

/* Suppression */
.crud-buttons .delete-button {
  background: #f8d7da;
  color: #721c24;
}
.crud-buttons .delete-button:hover {
  background: #f5c6cb;
}

/* Ajout de set */
.crud-buttons .add-set-button {
  background: #d4edda;
  color: #155724;
}
.crud-buttons .add-set-button:hover {
  background: #c3e6cb;
}

/* Suppression de set */
.crud-buttons .remove-set-button {
  background: #fff3cd;
  color: #856404;
}
.crud-buttons .remove-set-button:hover {
  background: #ffeeba;
}

/* WO joueur */
.crud-buttons .wo-button {
  background: #e2e3e5;
  color: #383d41;
}
.crud-buttons .wo-button:hover {
  background: #d6d8db;
}
.date-filter {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background-color: #fff;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
}

.date-filter label {
  font-weight: 600;
  color: #333;
}

.date-filter input[type="date"] {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.date-filter button {
  padding: 0.5rem 1rem;
  background-color: #e67e22;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.date-filter button:hover {
  background-color: #cf711c;
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
  text-shadow: none;
}
.match-list-horizontal {
  max-width: 100%;
  overflow-x: auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #222;
  font-size: 1.1rem; /* agrandi globalement */
}

.match-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px; /* un peu plus large */
  box-shadow: 0 3px 12px rgb(0 0 0 / 0.15);
  border-radius: 10px;
  overflow: hidden;
}

.match-table thead {
  background: linear-gradient(90deg, #1e3a8a, #2563eb);
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 1.1rem;
  letter-spacing: 1.2px;
}

.match-table th,
.match-table td {
  padding: 16px 20px;
  border-bottom: 1.5px solid #d1d5db;
  text-align: center;
  vertical-align: middle;
  font-size: 1.1rem;
}

.match-table tbody tr:hover {
  background-color: #e0e7ff; /* un bleu clair très doux */
  cursor: pointer;
}

.players-cell {
  display: flex;
  justify-content: center;
  gap: 18px;
  align-items: center;
  font-weight: 700;
  color: #111827; /* presque noir */
}

.players-cell span.player-name {
  white-space: nowrap;
}

.players-cell span.player-name span {
  font-weight: 500;
  color: #6b7280; /* gris-500 */
  font-size: 0.95rem;
  margin-left: 6px;
}

.score-cell {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 14px;
  flex-wrap: wrap;
  font-weight: 700;
  font-size: 1.25rem; /* un peu plus grand */
}

.set-score-horizontal {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #dbeafe; /* bleu très clair */
  padding: 8px 14px;
  border-radius: 8px;
  box-shadow: inset 0 0 6px #93c5fd;
  user-select: none;
}

.score-joueur1 button,
.score-joueur2 button {
  background: transparent;
  border: none;
  color: #555;
  padding: 2px 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
}

.score-joueur1 button:hover,
.score-joueur2 button:hover {
  text-decoration: underline;
}
.score-buttons-horizontal button:hover {
  background-color: #1e40af;
}

.crud-buttons-horizontal {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 1.5rem;
}

.edit-button, .delete-button {
  cursor: pointer;
  background: none;
  border: none;
  padding: 6px 8px;
  border-radius: 6px;
  transition: color 0.3s ease, background-color 0.3s ease;
  user-select: none;
}

.edit-button {
  color: #2563eb;
}

.edit-button:hover {
  color: #1e40af;
  background-color: #dbeafe;
}

.delete-button {
  color: #dc2626;
}

.delete-button:hover {
  color: #b91c1c;
  background-color: #fee2e2;
}
/* RESPONSIVE DESIGN */
@media (max-width: 768px) {
.players-cell {
    flex-direction: column;
    gap: 4px;
  }

  .score-cell {
    justify-content: flex-start;
  }

  .crud-buttons-horizontal {
    justify-content: flex-start;
  }
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
