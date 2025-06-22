<template>
  
  <div class="edit-match-container">
    <router-link to="/" class="home-link"><Logo /></router-link>
    <h2>Modifier un match</h2>
    <form @submit.prevent="updateMatch">

      <div class="form-group">
        <label for="joueur1">Joueur 1 :</label>
        <select v-model="match.joueur1" required>
          <option disabled value="">Sélectionnez le joueur 1</option>
          <option v-for="joueur in joueurs" :key="joueur.id" :value="joueur.id">
            {{ joueur.nom }} ({{ joueur.classement }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="joueur2">Joueur 2 :</label>
        <select v-model="match.joueur2" required>
          <option disabled value="">Sélectionnez le joueur 2</option>
          <option v-for="joueur in joueurs" :key="joueur.id" :value="joueur.id">
            {{ joueur.nom }} ({{ joueur.classement }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="terrain">Terrain :</label>
        <input type="number" v-model="match.terrain" required />
      </div>

      <div class="form-group">
        <label for="date">Date :</label>
        <input type="datetime-local" v-model="match.date" required />
      </div>

      <div class="form-group">
        <label for="categorie">Catégorie :</label>
        <select v-model="match.categorie" required>
          <option disabled value="">Sélectionnez une catégorie</option>
          <option value="SM">SM</option>
          <option value="SM 35">SM 35</option>
          <option value="SM 45">SM 45</option>
          <option value="SM 55">SM 55</option>
          <option value="DM">DM</option>
          <option value="SD">SD</option>
        </select>
      </div>

      <div class="form-group">
        <label>Score Sets :</label>
        <div v-for="(set, index) in scoreSetsInputs" :key="index" class="set-input">
          <h4>Set {{ index + 1 }}</h4>
          <input type="number" v-model.number="set.joueur1" placeholder="Score Joueur 1" required />
          <input type="number" v-model.number="set.joueur2" placeholder="Score Joueur 2" required />
        </div>
        <button type="button" @click="ajouterSet">Ajouter un Set</button>
      </div>

      <button type="submit" class="submit-button">Modifier le match</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import Logo from './Logo.vue'

export default {
  name: 'EditMatch',
  components: {
    Logo
  },

  data() {
    return {
      joueurs: [],

      match: {
        joueur1: '',
        joueur2: '',
        terrain: null,
        date: '',
        categorie: '',
        scoreSets: []
      },

      scoreSetsInputs: [
        { joueur1: 0, joueur2: 0 },
        { joueur1: 0, joueur2: 0 }
      ]
    }
  },

  mounted() {
    const documentId = this.$route.params.documentId
    console.log('documentId reçu depuis params:', documentId)
    this.fetchJoueurs()

    if (documentId) {
      this.fetchMatch(documentId)
    } else {
      console.error('documentId non défini dans les params de la route')
    }
  },

  methods: {
    async fetchJoueurs() {
      try {
        const res = await axios.get('https://ancient-purpose-79e6e65b06.strapiapp.com/api/joueurs')
        console.log('Réponse joueurs:', res.data)
        this.joueurs = res.data.data.map(j => ({
          id: j.id,
          documentId: j.documentId,
          nom: j.nom,
          classement: j.classement
        }))
      } catch (error) {
        console.error('Erreur lors du chargement des joueurs', error)
      }
    },

  async fetchMatch(documentId) {
  if (!documentId) {
    console.error('documentId non défini, impossible de récupérer le match')
    return
  }

  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(
      `https://ancient-purpose-79e6e65b06.strapiapp.com/api/matches/${documentId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    const matchData = response.data.data

    // Stocker l'id Strapi pour la mise à jour
    this.matchStrapiId = matchData.id

    this.match = {
      joueur1: matchData.joueur1 || '',  // Assure-toi que la relation joueur1 existe
      joueur2: matchData.joueur2 || '',  // Assure-toi que la relation joueur2 existe
      terrain: matchData.terrain,
      date: matchData.date,
      categorie: matchData.categorie,
      scoreSets: matchData.scoreSets || []
    }

    if (this.match.scoreSets.length > 0) {
      this.scoreSetsInputs = this.match.scoreSets
    } else {
      this.scoreSetsInputs = [
        { joueur1: 0, joueur2: 0 },
        { joueur1: 0, joueur2: 0 }
      ]
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du match:', error)
  }
},

    ajouterSet() {
      this.scoreSetsInputs.push({ joueur1: 0, joueur2: 0 })
    },

    async updateMatch() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          alert('Vous devez être connecté pour modifier un match.')
          return
        }

        const documentId = this.$route.params.documentId

        this.match.scoreSets = this.scoreSetsInputs

        await axios.put(
          `https://ancient-purpose-79e6e65b06.strapiapp.com/api/matches/${documentId}`,
          { data: this.match },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        alert('Match modifié avec succès !')
        this.$router.push('/')
      } catch (error) {
        console.error('Erreur lors de la mise à jour du match:', error)
        alert('Une erreur est survenue lors de la mise à jour.')
      }
    }
  }
}
</script>
<style scoped>
.edit-match-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

.home-link {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
  transition: transform 0.25s ease;
}

.home-link:hover {
  transform: scale(1.1);
}

form {
  width: 100%;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

input,
select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

.set-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.set-input input {
  flex: 1;
}

button[type="button"] {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #2980b9;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="button"]:hover {
  background-color: #216a94;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #27ae60;
  color: white;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
}

.submit-button:hover {
  background-color: #219150;
}

/* Responsive */
@media (max-width: 500px) {
  h2 {
    font-size: 1.5rem;
  }

  .set-input {
    flex-direction: column;
  }
}
</style>