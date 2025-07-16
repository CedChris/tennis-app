<template>
  <div class="add-match-container">
    <router-link to="/" class="home-link"><Logo /></router-link>

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
<div class="add-players-section">
  <h2 class="add-players-title">Ajouter plusieurs joueurs</h2>
  <textarea
    v-model="bulkPlayersInput"
    class="add-players-textarea"
    placeholder="Ex: Roger Federer - 10"
  ></textarea>
  <button class="add-players-button" @click="addPlayersInBulk">
    Ajouter les joueurs
  </button>
</div>
    <!-- Liste des joueurs -->
    <div class="player-list" @click.outside="dropdownOpen = false">
      <h3>Liste des joueurs</h3>

      <!-- Barre de recherche -->
      <input
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        placeholder="Rechercher un joueur..."
        class="search-bar"
      />

      <!-- Dropdown personnalisé -->
      <div class="dropdown" v-if="dropdownOpen && filteredPlayers.length">
        <ul>
          <li 
            v-for="joueur in filteredPlayers" 
            :key="joueur.id" 
            @click="selectPlayer(joueur)"
            class="dropdown-item"
          >
            {{ joueur.nom }} ({{ joueur.classement }})
          </li>
        </ul>
      </div>

      <!-- Bouton suppression -->
      <button 
        @click="removeSelectedPlayer" 
        :disabled="!selectedPlayer" 
        class="delete-button"
      >
        Supprimer le joueur sélectionné
      </button>
    </div>

    <!-- Formulaire pour ajouter un match -->
    <h2>Ajouter un match</h2>
    <form @submit.prevent="addMatch">
      <div class="form-group">
        <label for="joueur1">Joueur 1 :</label>
        <select v-model="match.joueur1DocumentId" required>
          <option disabled value="">Sélectionnez le joueur 1</option>
          <option 
            v-for="joueur in joueurs" 
            :key="joueur.id" 
            :value="joueur.documentId"
          >
            {{ joueur.nom }} ({{ joueur.classement }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="joueur2">Joueur 2 :</label>
        <select v-model="match.joueur2DocumentId" required>
          <option disabled value="">Sélectionnez le joueur 2</option>
          <option 
            v-for="joueur in joueurs" 
            :key="joueur.id" 
            :value="joueur.documentId"
          >
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

      <!-- Champ score par set -->
      <div class="form-group">
        <label>Score Sets :</label>
        <div class="score-info">
          Entrez un score numérique ou "WO" en cas de forfait.
        </div>

        <div 
          v-for="(set, index) in scoreSetsInputs" 
          :key="index" 
          class="set-input"
        >
          <h4>Set {{ index + 1 }}</h4>
          <div class="input-group">
            <label :for="'joueur1-set-' + index">Score Joueur 1 :</label>
            <input
              :id="'joueur1-set-' + index"
              type="text"
              v-model="set.joueur1"
              required
            />
          </div>
          <div class="input-group">
            <label :for="'joueur2-set-' + index">Score Joueur 2 :</label>
            <input
              :id="'joueur2-set-' + index"
              type="text"
              v-model="set.joueur2"
              required
            />
          </div>

          <button 
            type="button" 
            class="delete-set-button" 
            @click="supprimerSet(index)"
          >
            Supprimer ce set
          </button>
        </div>

        <button 
          type="button" 
          class="add-set-button" 
          @click="ajouterSet"
        >
          Ajouter un Set
        </button>
      </div>

      <button type="submit" class="submit-button">Ajouter le match</button>
    </form>

    <!-- Popup message -->
    <div v-if="popup.visible" class="popup-overlay">
      <div class="popup">
        <p>{{ popup.message }}</p>
        <button @click="popup.visible = false">Fermer</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Logo from './Logo.vue'

export default {
  components: {
    Logo
  },
  data() {
    return {
      joueurs: [],
      selectedPlayer: null,
      dropdownOpen: false,
      searchQuery: '',      // ID du joueur sélectionné
      newPlayer: {
        nom: '',
        classement: ''
      },
      popup: {
  visible: false,
  message: '',
},
      match: {
        joueur1: '',
        joueur2: '',
        terrain: '',
        date: this.getCurrentDateTimeLocal(),
        categorie: '' // Ajout de la catégorie
      },
      bulkPlayersInput: '',
      scoreSetsInputs: [
        { joueur1: 0, joueur2: 0 },
        { joueur1: 0, joueur2: 0 }
      ]
    }
  },
  computed: {
    filteredPlayers() {
      if (!this.searchQuery) return [];
      return this.joueurs.filter(joueur =>
        joueur.nom.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  async mounted() {
    await this.fetchPlayers()
  },
  methods: {
     getCurrentDateTimeLocal() {
  const now = new Date();
  now.setSeconds(0, 0);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  // Format YYYY-MM-DDTHH:MM (heure locale)
  return `${year}-${month}-${day}T${hours}:${minutes}`;
},async addMultiplePlayers() {
  if (!this.bulkPlayersInput.trim()) {
    this.showPopup('Le champ est vide.');
    return;
  }

  // Parse input : un joueur par ligne, format "Nom;Classement"
  const lines = this.bulkPlayersInput.trim().split('\n');
  const playersToAdd = [];

  for (let line of lines) {
    const parts = line.split(';');
    if (parts.length !== 2) {
      this.showPopup(`Format incorrect dans la ligne : "${line}". Utilisez "Nom;Classement".`);
      return;
    }
    const nom = parts[0].trim();
    const classement = parts[1].trim();

    if (!nom || !classement) {
      this.showPopup(`Nom ou classement manquant dans la ligne : "${line}".`);
      return;
    }

    playersToAdd.push({ nom, classement });
  }

  try {
    const token = localStorage.getItem('token');
    
    // Boucle d’envoi séquentiel (si Strapi n’a pas d’endpoint batch)
    for (const player of playersToAdd) {
      const payload = { data: player };
      await axios.post('https://ancient-purpose-79e6e65b06.strapiapp.com/api/joueurs', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    this.showPopup(`${playersToAdd.length} joueurs ajoutés avec succès !`);
    this.bulkPlayersInput = '';
    await this.fetchPlayers();

  } catch (error) {
    console.error('Erreur lors de l\'ajout multiple des joueurs', error);
    this.showPopup('Erreur lors de l\'ajout des joueurs.');
  }
},
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
        this.showPopup('Le nom et le classement du joueur ne peuvent pas être vides.')
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

        this.showPopup('Joueur ajouté avec succès !')
        this.newPlayer.nom = ''
        this.newPlayer.classement = ''
        await this.fetchPlayers()
      } catch (error) {
        console.error('Erreur lors de l\'ajout du joueur', error)
        this.showPopup('Erreur lors de l\'ajout du joueur.')
      }
    },
    handleInput() {
      if (this.searchQuery.trim()) {
        this.dropdownOpen = true;
      } else {
        this.dropdownOpen = false;
      }
    },
    selectPlayer(joueur) {
      this.selectedPlayer = joueur;
      this.searchQuery = joueur.nom;
      this.dropdownOpen = false;
    },
    async removeSelectedPlayer() {
      if (!this.selectedPlayer) return;
      await this.removeByDocumentId(this.selectedPlayer.documentId);
      this.selectedPlayer = null;
      this.searchQuery = '';
    },
    showPopup(message) {
  this.popup.message = message
  this.popup.visible = true
},
async removeByDocumentId(docId) {
  console.log('Tentative de suppression du joueur avec documentId :', docId);

  if (!confirm('Voulez-vous vraiment supprimer cet élément ?')) {
    console.log('Suppression annulée par l’utilisateur.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    console.log('Token récupéré :', token);

    if (!token) {
      this.showPopup('Veuillez vous reconnecter.');
      console.log('Token non trouvé, opération annulée.');
      return;
    }

    // 1. Récupérer l'entrée
    console.log('Recherche du joueur avec documentId...');
    const res = await axios.get(
      `https://ancient-purpose-79e6e65b06.strapiapp.com/api/joueurs`,
      {
        params: { filters: { documentId: docId } },
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log('Résultat de la recherche :', res.data);

    const data = res.data.data;

    if (!data.length) {
      this.showPopup('Élément non trouvé.');
      console.log('Aucun joueur trouvé avec ce documentId.');
      return;
    }

    const internalId = data[0].documentId;
    console.log('ID interne récupéré :', internalId);

    // 2. Supprimer via l'id interne
    console.log(`Suppression du joueur avec ID interne : ${internalId}...`);
    const del = await axios.delete(
      `https://ancient-purpose-79e6e65b06.strapiapp.com/api/joueurs/${internalId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('Statut de la suppression :', del.status);

    if ([200, 204].includes(del.status)) {
      this.showPopup('Suppression réussie !');
      console.log('Joueur supprimé avec succès.');
      await this.fetchPlayers(); // rafraîchir la liste
    } else {
      this.showPopup('Erreur lors de la suppression.');
      console.log('Erreur : Suppression échouée, statut inattendu.');
    }
  } catch (e) {
    console.error('Erreur pendant la suppression :', e);
    this.showPopup('Erreur bloquante pendant la suppression.');
  }
},
  validateScores() {
  for (let set of this.scoreSetsInputs) {
    const isJoueur1Valid = !isNaN(set.joueur1) || set.joueur1.toUpperCase() === 'WO';
    const isJoueur2Valid = !isNaN(set.joueur2) || set.joueur2.toUpperCase() === 'WO';
    if (!isJoueur1Valid || !isJoueur2Valid) {
      return false;
    }
  }
  return true;
},
    ajouterSet() {
      this.scoreSetsInputs.push({ joueur1: '', joueur2: '' })
    },
    supprimerSet(index) {
  if (this.scoreSetsInputs.length > 1) {
    this.scoreSetsInputs.splice(index, 1);
  } else {
    this.showPopup('Il doit rester au moins un set.');
  }
},
    async addMatch() {
  if (!this.validateScores()) {
    this.showPopup('Veuillez entrer des scores valides. Un score doit être un nombre ou "WO".');
    return;
  }

  try {
    const token = localStorage.getItem('token')
    const payload = {
      data: {
    joueur1: {
      connect: {
        documentId: this.match.joueur1DocumentId
      }
    },
    joueur2: {
      connect: {
        documentId: this.match.joueur2DocumentId
      }
    },
        terrain: this.match.terrain,
        date: this.match.date,
        categorie: this.match.categorie,
        scoreSets: this.scoreSetsInputs.map(set => ({
          joueur1: set.joueur1.toString().toUpperCase(),
          joueur2: set.joueur2.toString().toUpperCase()
        }))
      }
    }

    console.log('Payload envoyé :', JSON.stringify(payload, null, 2))

    await axios.post('https://ancient-purpose-79e6e65b06.strapiapp.com/api/matches', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    this.showPopup('Match ajouté avec succès !')
    this.$router.push('/')
  } catch (error) {
    console.error('Erreur lors de l\'ajout du match', error)
    console.error('Détails de l\'erreur :', error.response?.data)
    this.showPopup('Erreur lors de l\'ajout du match.')
  }
}
  }
}
</script>


<style scoped>
.add-match-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.home-link {
  display: inline-block;
  margin-bottom: 2rem;
}

h2,
h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

form {
  margin-bottom: 2rem;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 6px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: bold;
}

input[type="text"],
input[type="number"],
input[type="datetime-local"],
select,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

button {
  cursor: pointer;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.submit-button {
  background-color: #3498db;
  color: white;
}

.submit-button:hover {
  background-color: #2980b9;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
  margin-top: 1rem;
}

.delete-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.add-set-button {
  background-color: #2ecc71;
  color: white;
  margin-top: 1rem;
}

.delete-set-button {
  background-color: #e67e22;
  color: white;
  margin-top: 0.5rem;
}

.add-players-section {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.add-players-title {
  margin-bottom: 1rem;
}

.add-players-textarea {
  width: 100%;
  padding: 0.6rem;
  font-family: inherit;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-players-button {
  margin-top: 0.8rem;
  background-color: #16a085;
  color: white;
}

.player-list {
  margin-bottom: 2rem;
  position: relative;
}

.search-bar {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: white;
  border: 1px solid #ccc;
  max-height: 150px;
  overflow-y: auto;
  border-radius: 4px;
}

.dropdown-item {
  padding: 0.5rem;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.set-input {
  margin-bottom: 1.2rem;
  padding: 1rem;
  background-color: #eef2f3;
  border-radius: 6px;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
}

.input-group label {
  font-weight: 500;
  margin-bottom: 0.3rem;
}

.score-info {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.popup {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.popup button {
  background-color: #3498db;
  color: white;
  margin-top: 1rem;
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
