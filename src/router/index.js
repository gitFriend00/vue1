import { createRouter, createWebHistory } from 'vue-router'
import FoodStore from '../component/FoodStore.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: {
        template: '<div><h2>Home</h2><p>Welcome to the Vue Router demo.</p></div>',
      },
    },
    {
      path: '/food-store',
      name: 'FoodStore',
      component: FoodStore,
    },
  ],
})

export default router
