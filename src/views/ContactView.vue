<script setup>
import { ref } from 'vue'

const form = ref({ name: '', email: '', message: '' })
const errors = ref({})
const sent = ref(false)

function submit() {
  const e = {}
  if (!form.value.name.trim()) e.name = 'Name is required.'
  if (!form.value.email.trim()) {
    e.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    e.email = 'Please enter a valid email address.'
  }
  if (!form.value.message.trim()) e.message = 'Please write a message.'
  errors.value = e
  if (Object.keys(e).length === 0) {
    sent.value = true
    form.value = { name: '', email: '', message: '' }
  }
}
</script>

<template>
  <div class="container page">
    <p class="eyebrow">We're here to help</p>
    <h1>Contact Us</h1>

    <div class="contact-grid">
      <div class="contact-info reveal">
        <div class="info-item">
          <span class="info-icon">📞</span>
          <div>
            <strong>Free call line</strong>
            <p>1800 745 837 · Mon–Fri, 8am–6pm</p>
          </div>
        </div>
        <div class="info-item">
          <span class="info-icon">✉️</span>
          <div>
            <strong>Email</strong>
            <p>care@silveragewellbeing.org</p>
          </div>
        </div>
        <div class="info-item">
          <span class="info-icon">📍</span>
          <div>
            <strong>Office</strong>
            <p>12 Harmony Street, Melbourne VIC 3000</p>
          </div>
        </div>
        <div class="info-note">
          💡 Need help booking online? Call us and a staff member will book
          over the phone — no computer needed.
        </div>
      </div>

      <form class="card contact-form reveal reveal-delay-1" @submit.prevent="submit" novalidate>
        <h2>Send a message</h2>
        <div v-if="sent" class="success-banner">✅ Message sent! We'll reply within 2 business days.</div>
        <div class="form-group">
          <label for="c-name">Name <span class="required-mark">*</span></label>
          <input id="c-name" v-model="form.name" type="text" class="form-control"
            :class="{ invalid: errors.name }">
          <p v-if="errors.name" class="error-msg">{{ errors.name }}</p>
        </div>
        <div class="form-group">
          <label for="c-email">Email <span class="required-mark">*</span></label>
          <input id="c-email" v-model="form.email" type="email" class="form-control"
            :class="{ invalid: errors.email }">
          <p v-if="errors.email" class="error-msg">{{ errors.email }}</p>
        </div>
        <div class="form-group">
          <label for="c-msg">Message <span class="required-mark">*</span></label>
          <textarea id="c-msg" v-model="form.message" rows="5" class="form-control"
            :class="{ invalid: errors.message }"></textarea>
          <p v-if="errors.message" class="error-msg">{{ errors.message }}</p>
        </div>
        <button type="submit" class="btn btn-primary">Send message</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
  align-items: start;
}
.info-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1rem 1.2rem;
  margin-bottom: 0.9rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.info-item:hover { transform: translateX(4px); box-shadow: var(--shadow-card); }
.info-icon { font-size: 1.5rem; }
.info-item p { margin: 0.15em 0 0; color: #4c5c62; }
.info-note {
  background: var(--gold-100);
  border-radius: var(--radius);
  padding: 1rem 1.2rem;
  font-weight: 600;
}
@media (max-width: 760px) {
  .contact-grid { grid-template-columns: 1fr; }
}
</style>