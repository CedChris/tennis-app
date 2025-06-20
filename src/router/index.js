import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Results from '../views/Results.vue';
import Login from '../pages/LoginPage.vue';
import AddMatch from '../components/AddMatch.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home' , component: Home },
    { path: '/results', component: Results },
    { path: '/login', name: 'Login', component: Login },
    { path: '/add-match', component: AddMatch }
  ]
});