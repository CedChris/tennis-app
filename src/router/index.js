import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Results from '../views/Results.vue'
import Login from '../pages/LoginPage.vue'
import AddMatch from '../components/AddMatch.vue'
import EditMatch from '../components/EditMatch.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/results', component: Results },
    { path: '/login', name: 'Login', component: Login },
    { path: '/add-match', component: AddMatch, meta: { requiresAuth: true } }, // 👉 route protégée
    { path: '/edit-match/:documentId', name: 'EditMatch', component: EditMatch, props: true, meta: { requiresAuth: true } } // 👉 route protégée
  ]
})

// 👉 Guard de navigation global
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token') // Vérifie la présence du token

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Redirection vers la page de login si l'utilisateur n'est pas connecté
      next({ name: 'Login' })
    } else {
      // Autorisé
      next()
    }
  } else {
    // Route publique
    next()
  }
})

export default router