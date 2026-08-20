import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import HomeView from '../views/HomeView.vue'
import ProgrammesView from '../views/ProgrammesView.vue'
import ProgrammeDetailView from '../views/ProgrammeDetailView.vue'
import ReviewsView from '../views/ReviewsView.vue'
import EducationView from '../views/EducationView.vue'
import ContactView from '../views/ContactView.vue'
import ServiceMapView from '../views/ServiceMapView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AccountView from '../views/AccountView.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
  // Hash history keeps SPA routes portable when the app is served from static hosting or a subdirectory.
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/programmes', name: 'programmes', component: ProgrammesView },
    { path: '/programmes/:id', name: 'programme-detail', component: ProgrammeDetailView, props: true },
    { path: '/service-map', name: 'service-map', component: ServiceMapView },
    { path: '/reviews', name: 'reviews', component: ReviewsView },
    { path: '/education', name: 'education', component: EducationView },
    { path: '/contact', name: 'contact', component: ContactView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/account', name: 'account', component: AccountView, meta: { requiresAuth: true } },
    { path: '/admin', name: 'admin', component: AdminView, meta: { requiresAdmin: true } }
  ],
  scrollBehavior() { return { top: 0 } }
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.meta.requiresAdmin && !auth.isAdmin) return { name: 'home' }
})

export default router
