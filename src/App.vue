<script setup>
import { ref, watchEffect } from 'vue'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'

// Senior mode toggle — persisted in localStorage (WCAG 2.1 AA)
const largeFont = ref(localStorage.getItem('seniorMode') === 'true')

watchEffect(() => {
  document.documentElement.classList.toggle('font-large', largeFont.value)
  localStorage.setItem('seniorMode', largeFont.value)
})

function toggleFont() {
  largeFont.value = !largeFont.value
}
</script>

<template>
  <div class="app-shell">
    <AppNavbar :large-font="largeFont" @toggle-font="toggleFont" />
    <main>
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.app-shell { min-height: 100vh; display: flex; flex-direction: column; }
main { flex: 1; }
</style>