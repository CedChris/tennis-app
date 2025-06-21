<template>
  <div class="login-container">
    <h2>Connexion Admin</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="identifier">Email ou Nom d'utilisateur</label>
        <input v-model="identifier" id="identifier" type="text" required />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input v-model="password" id="password" type="password" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginForm',
  data() {
    return {
      identifier: '',
      password: '',
      loading: false,
      errorMessage: ''
    }
  },
  methods: {
    async login() {
      this.loading = true
      this.errorMessage = ''

      try {
        const response = await axios.post('https://ancient-purpose-79e6e65b06.strapiapp.com/api/auth/local', {
          identifier: this.identifier,
          password: this.password
        })

        const token = response.data.jwt
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        this.$emit('login-success', response.data.user)

        // Redirection ou affichage d'un message de succès
      } catch (error) {
        console.error('Erreur de connexion', error)
        this.errorMessage = 'Identifiants incorrects.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #219150;
}

button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  margin-top: 12px;
  text-align: center;
}
.login-container {
  width: 100%;
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  box-sizing: border-box; /* Très important pour éviter les débordements */
}

@media (max-width: 480px) {
  .login-container {
    margin: 20px auto;
    padding: 20px;
  }

  h2 {
    font-size: 1.5rem;
  }

  input {
    padding: 8px;
    font-size: 0.9rem;
  }

  button {
    padding: 10px;
    font-size: 0.9rem;
  }

  label {
    font-size: 0.9rem;
  }

  .error-message {
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .login-container {
    margin: 10px auto;
    padding: 15px;
    box-shadow: none;
    border: 1px solid #ddd;
  }

  h2 {
    font-size: 1.2rem;
  }

  input {
    padding: 6px;
    font-size: 0.8rem;
  }

  button {
    padding: 8px;
    font-size: 0.8rem;
  }

  label {
    font-size: 0.8rem;
  }

  .error-message {
    font-size: 0.8rem;
  }
}
</style>