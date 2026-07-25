<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMsg = ref('')

function submit() {
  const result = auth.login(email.value.trim(), password.value)
  if (!result.ok) {
    errorMsg.value = result.message
    return
  }
  errorMsg.value = ''
  router.push(route.query.redirect || '/account')
}
</script>

<template>
  <div class="container page auth-page">
    <form class="card auth-card reveal" @submit.prevent="submit">
      <p class="eyebrow">Welcome back</p>
      <h1>Log in</h1>
      <div v-if="errorMsg" class="alert-error">{{ errorMsg }}</div>
      <div class="form-group">
        <label for="l-email">Email</label>
        <input id="l-email" v-model="email" type="email" class="form-control" placeholder="you@example.com">
      </div>
      <div class="form-group">
        <label for="l-password">Password</label>
        <input id="l-password" v-model="password" type="password" class="form-control" placeholder="••••••••">
      </div>
      <button type="submit" class="btn btn-primary auth-btn">Log in</button>
      <p class="auth-switch">
        New here? <RouterLink to="/register">Create an account</RouterLink>
      </p>
      <div class="demo-accounts">
        <strong>Demo accounts (for marking):</strong>
        <ul>
          <li>User — user@test.com / user123</li>
          <li>Volunteer — volunteer@test.com / vol123</li>
          <li>Admin — admin@test.com / admin123</li>
        </ul>
      </div>
    </form>
  </div>
</template>

<style scoped>
.auth-page { display: flex; justify-content: center; }
.auth-card { width: 100%; max-width: 460px; border-top: 6px solid var(--teal-700); }
.auth-btn { width: 100%; }
.auth-switch { text-align: center; margin-top: 1rem; }
.demo-accounts {
  margin-top: 1.4rem;
  background: var(--teal-50);
  border: 1px dashed var(--teal-500);
  border-radius: var(--radius);
  padding: 0.9rem 1.1rem;
  font-size: 0.88em;
}
.demo-accounts ul { margin: 0.4em 0 0; padding-left: 1.2em; }
</style>