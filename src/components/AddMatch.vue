<template>
  <div class="add-match-container">

    <!-- Formulaire pour ajouter un joueur -->
    <div class="add-player-container">
      <h2>Ajouter un joueur</h2>
      <form @submit.prevent="addPlayer">
        <div class="form-group">
          <label for="nom">Nom/Prénom du joueur :</label>
          <input type="text" v-model="newPlayer.nom" required />
        </div>

        <div class="form-group">
          <label for="classement">Classement :</label>
          <input type="text" v-model="newPlayer.classement" required />
        </div>

        <button type="submit" class="submit-button">Ajouter le joueur</button>
      </form>
    </div>

    <!-- Formulaire pour ajouter un match -->
    <h2>Ajouter un match</h2>
    <form @submit.prevent="addMatch">
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

      <!-- Champ catégorie -->
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
    <button type="button" @click="supprimerSet(index)">Supprimer ce set</button>
  </div>


      <button type="submit" class="submit-button">Ajouter le match</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      joueurs: [],
      newPlayer: {
        nom: '',
        classement: ''
      },
      match: {
        joueur1: '',
        joueur2: '',
        terrain: '',
        date: '',
        categorie: '' // Ajout de la catégorie
      },
      scoreSetsInputs: [
        { joueur1: 0, joueur2: 0 },
        { joueur1: 0, joueur2: 0 }
      ]
    }
  },
  async mounted() {
    await this.fetchPlayers()
  },
  methods: {
    async fetchPlayers() {
      try {
        const res = await axios.get('https://ancient-purpose-79e6e65b06.strapiapp.com/api/joueurs')
        this.joueurs = res.data.data
      } catch (error) {
        console.error('Erreur lors de la récupération des joueurs', error)
      }
    },
    async addPlayer() {
      if (!this.newPlayer.nom.trim() || !this.newPlayer.classement.trim()) {
        alert('Le nom et le classement du joueur ne peuvent pas être vides.')
        return
      }

      try {
        const token = localStorage.getItem('token')
        const payload = {
          data: {
            nom: this.newPlayer.nom.trim(),
            classement: this.newPlayer.classement.trim()
          }
        }

        await axios.post('https://ancient-purpose-79e6e65b06.strapiapp.com/api/joueurs', payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        alert('Joueur ajouté avec succès !')
        this.newPlayer.nom = ''
        this.newPlayer.classement = ''
        await this.fetchPlayers()
      } catch (error) {
        console.error('Erreur lors de l\'ajout du joueur', error)
        alert('Erreur lors de l\'ajout du joueur.')
      }
    },
    ajouterSet() {
      this.scoreSetsInputs.push({ joueur1: '', joueur2: '' })
    },
    supprimerSet(index) {
  if (this.scoreSetsInputs.length > 1) {
    this.scoreSetsInputs.splice(index, 1);
  } else {
    alert('Il doit rester au moins un set.');
  }
},
    async addMatch() {
      try {
        const token = localStorage.getItem('token')
        const payload = {
          data: {
            joueur1: { id: this.match.joueur1 },
            joueur2: { id: this.match.joueur2 },
            terrain: this.match.terrain,
            date: this.match.date,
            categorie: this.match.categorie, // Envoi de la catégorie
            scoreSets: this.scoreSetsInputs
          }
        }

        console.log('Payload envoyé :', JSON.stringify(payload, null, 2))

        await axios.post('https://ancient-purpose-79e6e65b06.strapiapp.com/api/matches', payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        alert('Match ajouté avec succès !')
        this.$router.push('/')
      } catch (error) {
        console.error('Erreur lors de l\'ajout du match', error)
        console.error('Détails de l\'erreur :', error.response?.data)
        alert('Erreur lors de l\'ajout du match.')
      }
    }
  }
}
</script>


<style>
.add-match-container {
  max-width: 700px;
  margin: 40px auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.add-player-container {
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 8px;
}

.add-player-container h3 {
  margin-bottom: 15px;
  font-size: 1.5rem;
  color: #16a085;
}

.add-match-container h2 {
  text-align: center;
  margin-bottom: 25px;
  font-size: 2rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #34495e;
}

input, select {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #dcdcdc;
  outline: none;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus, select:focus {
  border-color: #27ae60;
  box-shadow: 0 0 5px rgba(39, 174, 96, 0.5);
}

.set-input {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;
}

.set-input h4 {
  grid-column: span 2;
  margin: 10px 0 5px 0;
  color: #2c3e50;
}

button {
  background-color: #27ae60;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #219150;
  transform: scale(1.05);
}

button[type="button"] {
  background-color: #2980b9;
  margin-top: 10px;
}

button[type="button"]:hover {
  background-color: #2471a3;
}

@media (max-width: 600px) {
  .set-input {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 400px) {
  .add-match-container {
    max-width: 100%;
    margin: 20px 10px;
    padding: 20px 15px;
    box-shadow: none;
    border-radius: 8px;
  }

  .add-match-container h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    font-size: 0.9rem;
    margin-bottom: 5px;
  }

  input, select {
    padding: 8px;
    font-size: 0.9rem;
  }

  .set-input {
    display: block;
    margin-bottom: 12px;
  }

  .set-input h4 {
    margin: 8px 0 4px;
    font-size: 1.1rem;
  }

  .set-input input {
    width: 100%;
    margin-bottom: 8px;
  }

  button {
    padding: 10px;
    font-size: 0.95rem;
  }

  button[type="button"] {
    margin-top: 8px;
  }
}
</style>
