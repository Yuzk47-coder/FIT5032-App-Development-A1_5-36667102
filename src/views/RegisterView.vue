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
  if (!form.value.email.trim()) {
    e.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    e.email = 'Please enter a valid email address.'
  }
  if (form.value.password.length < 6) {
    e.password = 'Password must be at least 6 characters.'
  }
  if (form.value.confirm !== form.value.password) {
    e.confirm = 'Passwords do not match.'
  }
  errors.value = e
  return Object.keys(e).length === 0
}

function submit() {
  if (!validate()) return
  const result = auth.register({
    name: form.value.name.trim(),
    email: form.value.email.trim(),
    password: form.value.password
  })
  if (!result.ok) {
    errors.value = { email: result.message }
    return
  }
  router.push('/login')
}
</script>

<template>
  <div class="container page auth-page">
    <form class="card auth-card reveal" @submit.prevent="submit" novalidate>
      <p class="eyebrow">Join our community</p>
      <h1>Create an account</h1>
      <div class="form-group">
        <label for="r-name">Full name <span class="required-mark">*</span></label>
        <input id="r-name" v-model="form.name" type="text" class="form-control"
          :class="{ invalid: errors.name }">
        <p v-if="errors.name" class="error-msg">{{ errors.name }}</p>
      </div>
      <div class="form-group">
        <label for="r-email">Email <span class="required-mark">*</span></label>
        <input id="r-email" v-model="form.email" type="email" class="form-control"
          :class="{ invalid: errors.email }">
        <p v-if="errors.email" class="error-msg">{{ errors.email }}</p>
      </div>
      <div class="form-group">
        <label for="r-password">Password <span class="required-mark">*</span></label>
        <input id="r-password" v-model="form.password" type="password" class="form-control"
          :class="{ invalid: errors.password }" placeholder="At least 6 characters">
        <p v-if="errors.password" class="error-msg">{{ errors.password }}</p>
      </div>
      <div class="form-group">
        <label for="r-confirm">Confirm password <span class="required-mark">*</span></label>
        <input id="r-confirm" v-model="form.confirm" type="password" class="form-control"
          :class="{ invalid: errors.confirm }">
        <p v-if="errors.confirm" class="error-msg">{{ errors.confirm }}</p>
      </div>
      <button type="submit" class="btn btn-gold auth-btn">Register</button>
      <p class="auth-switch">
        Already registered? <RouterLink to="/login">Log in</RouterLink>
      </p>
    </form>
  </div>
</template>

<style scoped>
.auth-page { display: flex; justify-content: center; }
.auth-card { width: 100%; max-width: 460px; border-top: 6px solid var(--gold-500); }
.auth-btn { width: 100%; }
.auth-switch { text-align: center; margin-top: 1rem; }
</style>