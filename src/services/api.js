import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export async function getMatches() {
  const res = await axios.get(`${API_URL}/matchs?populate=joueur1,joueur2`);
  return res.data.data;
}

export async function getPlayers() {
  const res = await axios.get(`${API_URL}/joueurs`);
  return res.data.data;
}