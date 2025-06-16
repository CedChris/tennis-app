<template>
  <div class='p-8'>
    <h1 class='text-3xl font-bold mb-6'>Résultats du tournoi</h1>
    <div v-if='matches.length === 0'>Chargement…</div>
    <div v-for='m in matches' :key='m.id' class='p-4 border mb-4 rounded-lg'>
      <p><strong>{{ m.attributes.tour }}</strong> – {{ formatDate(m.attributes.date) }}</p>
      <p>{{ m.attributes.joueur1.data.attributes.nom }} vs {{ m.attributes.joueur2.data.attributes.nom }}</p>
      <p>Score : {{ m.attributes.score }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getMatches } from '../services/api';

const matches = ref([]);

function formatDate(date) {
  return new Date(date).toLocaleString();
}

onMounted(async () => {
  matches.value = await getMatches();
});
</script>