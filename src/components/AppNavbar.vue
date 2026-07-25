<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

defineProps({ largeFont: Boolean })
const emit = defineEmits(['toggle-font'])

const auth = useAuthStore()
const route = useRoute()

const links = computed(() => {
  const base = [
    { to: '/', label: 'Home' },
    { to: '/programmes', label: 'Programmes' },
    { to: '/reviews', label: 'Reviews' },
    { to: '/education', label: 'Health Education' },
    { to: '/contact', label: 'Contact' }
  ]
  if (auth.isLoggedIn) base.push({ to: '/account', label: 'My Account' })
  if (auth.isAdmin) base.push({ to: '/admin', label: 'Admin' })
  return base
})
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink to="/" class="brand" aria-label="Silver Age Wellbeing Foundation home">
        <span class="brand-mark" aria-hidden="true">🤝</span>
        <span class="brand-text">
          <strong>Silver Age</strong>
          <small>Wellbeing Foundation</small>
        </span>
      </RouterLink>

      <nav class="main-nav" aria-label="Main navigation">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ active: route.path === link.to }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="header-actions">
        <button
          class="font-toggle"
          :aria-pressed="largeFont"
          :title="largeFont ? 'Switch to standard text size' : 'Switch to large text size'"
          @click="emit('toggle-font')"
        >
          <span :class="{ on: largeFont }">A</span><span>A</span>
        </button>

        <template v-if="auth.isLoggedIn">
          <span class="hello">Hi, {{ auth.currentUser.name }}</span>
          <button class="btn btn-outline btn-sm" @click="auth.logout()">Log out</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn btn-outline btn-sm">Log in</RouterLink>
          <RouterLink to="/register" class="btn btn-gold btn-sm">Register</RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  background: var(--teal-900);
  color: var(--white);
}
.header-inner {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
  flex-wrap: wrap;
}
.brand { display: flex; align-items: center; gap: 0.55rem; text-decoration: none; color: var(--white); }
.brand-mark { font-size: 1.5rem; }
.brand-text { display: flex; flex-direction: column; line-height: 1.15; }
.brand-text strong { font-size: 1.1em; }
.brand-text small { opacity: 0.8; font-size: 0.7em; text-transform: uppercase; }

.main-nav { display: flex; gap: 0.25rem; flex-wrap: wrap; }
.nav-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-weight: 600;
  padding: 0.4em 0.75em;
  border-radius: var(--radius);
}
.nav-link:hover { background: rgba(255, 255, 255, 0.15); color: var(--white); }
.nav-link.active { background: var(--gold-500); color: var(--teal-900); }

.header-actions { display: flex; align-items: center; gap: 0.7rem; margin-left: auto; }
.hello { font-weight: 600; font-size: 0.9em; }

.font-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: var(--white);
  border-radius: var(--radius);
  padding: 0.2em 0.6em;
  cursor: pointer;
  font-weight: 700;
  display: flex;
  align-items: baseline;
  gap: 2px;
}
.font-toggle span:first-child { font-size: 1.1em; }
.font-toggle span:last-child { font-size: 0.8em; }
.font-toggle .on { color: var(--gold-500); }

.btn-sm { padding: 0.3em 0.8em; font-size: 0.9em; }
.btn-outline { border-color: rgba(255, 255, 255, 0.6); color: var(--white); }
.btn-outline:hover { background: var(--white); color: var(--teal-900); }
</style>