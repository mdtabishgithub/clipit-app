// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      // This is the dynamic route for each board
      // The ":id" part will be the unique ID
      path: '/b/:id',
      name: 'board',
      // We will create this BoardView.vue file next
      component: () => import('../views/BoardView.vue')
    }
  ]
})

export default router