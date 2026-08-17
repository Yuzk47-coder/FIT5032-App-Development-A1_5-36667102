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

async function submit() {
  errorMsg.value = ''
  const result = await auth.login(email.value.trim(), password.value)
  if (!result.ok) {
    errorMsg.value = result.message
    return
  }
  router.push(route.query.redirect || '/account')
}
</script>

<template>
  <div class="container page auth-page">
    <form class="card auth-card reveal" @submit.prevent="submit" aria-labelledby="login-title">
      <p class="eyebrow">Welcome back</p>
      <h1 id="login-title">Log in</h1>

      <div class="provider-note" :class="{ ready: auth.externalAuthAvailable }">
        <strong>A3 external authentication:</strong>
        <span v-if="auth.externalAuthAvailable">Firebase Authentication is configured for member accounts.</span>
        <span v-else>Local demo mode. Add your existing Firebase Web config in <code>.env</code> before marking D.1.</span>
      </div>

      <div v-if="errorMsg" class="alert-error" role="alert">{{ errorMsg }}</div>
      <div class="form-group">
        <label for="l-email">Email</label>
        <input id="l-email" v-model="email" type="email" class="form-control" autocomplete="email" required>
      </div>
      <div class="form-group">
        <label for="l-password">Password</label>
        <input id="l-password" v-model="password" type="password" class="form-control" autocomplete="current-password" required>
      </div>
      <button type="submit" class="btn btn-primary auth-btn" :disabled="auth.authBusy">
        {{ auth.authBusy ? 'Signing in…' : 'Log in' }}
      </button>
      <p class="auth-switch">
        New here? <RouterLink to="/register">Create an account</RouterLink>
      </p>
      <div class="demo-accounts">
        <strong>Local staff/demo accounts (for marking):</strong>
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
.auth-card { width: 100%; max-width: 500px; border-top: 6px solid var(--teal-700); }
.auth-btn { width: 100%; }
.auth-switch { text-align: center; margin-top: 1rem; }
.provider-note { margin: 0.9rem 0 1.2rem; padding: 0.8rem; border-radius: var(--radius); background: #fffaf0; border: 1px solid #d69e2e; font-size: 0.9em; }
.provider-note.ready { background: #f0fff4; border-color: #38a169; }
.provider-note strong { display: block; }
.demo-accounts { margin-top: 1.4rem; background: var(--teal-50); border: 1px dashed var(--teal-500); border-radius: var(--radius); padding: 0.9rem 1.1rem; font-size: 0.88em; }
.demo-accounts ul { margin: 0.4em 0 0; padding-left: 1.2em; }
</style>
