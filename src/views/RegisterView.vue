<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const form = ref({ name: '', email: '', password: '', confirm: '' })
const errors = ref({})

function validate() {
  const e = {}
  if (!form.value.name.trim()) e.name = 'Full name is required.'
  if (!form.value.email.trim()) e.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) e.email = 'Please enter a valid email address.'
  if (form.value.password.length < 6) e.password = 'Password must be at least 6 characters.'
  if (form.value.confirm !== form.value.password) e.confirm = 'Passwords do not match.'
  errors.value = e
  return Object.keys(e).length === 0
}

async function submit() {
  if (!validate()) return
  const result = await auth.register({
    name: form.value.name.trim(),
    email: form.value.email.trim(),
    password: form.value.password
  })
  if (!result.ok) {
    errors.value = { email: result.message }
    return
  }
  // Firebase registration signs the user in immediately; local fallback does not.
  router.push(auth.isLoggedIn ? '/account' : '/login')
}
</script>

<template>
  <div class="container page auth-page">
    <form class="card auth-card reveal" @submit.prevent="submit" novalidate aria-labelledby="register-title">
      <p class="eyebrow">Join our community</p>
      <h1 id="register-title">Create an account</h1>
      <p class="provider-copy">
        <template v-if="auth.externalAuthAvailable">This member account will be created with Firebase Authentication (A3 D.1).</template>
        <template v-else>Firebase is not configured yet, so this runs in local demo mode.</template>
      </p>
      <div class="form-group">
        <label for="r-name">Full name <span class="required-mark">*</span></label>
        <input id="r-name" v-model="form.name" type="text" class="form-control" :class="{ invalid: errors.name }" :aria-invalid="Boolean(errors.name)" :aria-describedby="errors.name ? 'r-name-error' : undefined" autocomplete="name">
        <p v-if="errors.name" id="r-name-error" class="error-msg">{{ errors.name }}</p>
      </div>
      <div class="form-group">
        <label for="r-email">Email <span class="required-mark">*</span></label>
        <input id="r-email" v-model="form.email" type="email" class="form-control" :class="{ invalid: errors.email }" :aria-invalid="Boolean(errors.email)" :aria-describedby="errors.email ? 'r-email-error' : undefined" autocomplete="email">
        <p v-if="errors.email" id="r-email-error" class="error-msg" role="alert">{{ errors.email }}</p>
      </div>
      <div class="form-group">
        <label for="r-password">Password <span class="required-mark">*</span></label>
        <input id="r-password" v-model="form.password" type="password" class="form-control" :class="{ invalid: errors.password }" :aria-invalid="Boolean(errors.password)" :aria-describedby="errors.password ? 'r-password-error' : undefined" autocomplete="new-password" placeholder="At least 6 characters">
        <p v-if="errors.password" id="r-password-error" class="error-msg">{{ errors.password }}</p>
      </div>
      <div class="form-group">
        <label for="r-confirm">Confirm password <span class="required-mark">*</span></label>
        <input id="r-confirm" v-model="form.confirm" type="password" class="form-control" :class="{ invalid: errors.confirm }" :aria-invalid="Boolean(errors.confirm)" :aria-describedby="errors.confirm ? 'r-confirm-error' : undefined" autocomplete="new-password">
        <p v-if="errors.confirm" id="r-confirm-error" class="error-msg">{{ errors.confirm }}</p>
      </div>
      <button type="submit" class="btn btn-gold auth-btn" :disabled="auth.authBusy">{{ auth.authBusy ? 'Creating…' : 'Register' }}</button>
      <p class="auth-switch">Already registered? <RouterLink to="/login">Log in</RouterLink></p>
    </form>
  </div>
</template>

<style scoped>
.auth-page { display: flex; justify-content: center; }
.auth-card { width: 100%; max-width: 500px; border-top: 6px solid var(--gold-500); }
.auth-btn { width: 100%; }
.auth-switch { text-align: center; margin-top: 1rem; }
.provider-copy { color: #4a5568; margin-bottom: 1.2rem; }
</style>
