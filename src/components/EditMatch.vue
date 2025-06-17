<template>
  <div class="add-match-container">
    <h2>Ajouter un match</h2>
    <form @submit.prevent="addMatch">
      <input v-model="player1" type="text" placeholder="Joueur 1" required />
      <input v-model="player2" type="text" placeholder="Joueur 2" required />
      <input v-model="score" type="text" placeholder="Score" required />
      <button type="submit" class="submit-button">Ajouter</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      player1: '',
      player2: '',
      score: ''
    }
  },
  methods: {
    async addMatch() {
      const token = localStorage.getItem('token')
      try {
        await fetch('http://localhost:1337/api/matches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            data: {
              player1: this.player1,
              player2: this.player2,
              score: this.score
            }
          })
        })
        this.$router.push('/')
      } catch (error) {
        console.error('Erreur lors de l’ajout du match:', error)
      }
    }
  }
}
</script>

<style>
.add-match-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.submit-button {
  background-color: #27ae60;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #219150;
}
</style>