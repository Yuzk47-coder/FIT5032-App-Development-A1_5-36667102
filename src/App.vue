<script setup>
import { ref, watchEffect } from 'vue'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'

const largeFont = ref(localStorage.getItem('seniorMode') === 'true')
watchEffect(() => {
  document.documentElement.classList.toggle('font-large', largeFont.value)
  localStorage.setItem('seniorMode', largeFont.value)
})
function toggleFont() { largeFont.value = !largeFont.value }
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <AppNavbar :large-font="largeFont" @toggle-font="toggleFont" />
    <main id="main-content" tabindex="-1"><RouterView /></main>
    <AppFooter />
  </div>
</template>

<style scoped>
.app-shell { min-height: 100vh; display: flex; flex-direction: column; }
main { flex: 1; }
</style>
