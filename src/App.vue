<template>
  <div id="app" class="container">
    <Logo />
    <MatchList />
  </div>
</template>

<script>
import MatchList from './components/MatchList.vue'
import Logo from './components/Logo.vue'

export default {
  name: 'App',
  components: {
    MatchList,
    Logo
  }
}
</script>

<style>
.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #fafafa;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  color: #2c3e50;
}

h1 {
  text-align: center;
  font-weight: 700;
  font-size: 2.4rem;
  margin-bottom: 40px;
  color: #34495e;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
}

/* Pour le composant MatchList, on peut imaginer un style ici */
/* Par exemple des cartes blanches, arrondies avec ombre légère, etc. */
.match-card {
  background-color: white;
  border-radius: 10px;
  padding: 16px 24px;
  margin-bottom: 20px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  border: 2px solid #ddd;
}

.match-card:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  transform: translateY(-4px);
  border-color: #2980b9;
}
</style>