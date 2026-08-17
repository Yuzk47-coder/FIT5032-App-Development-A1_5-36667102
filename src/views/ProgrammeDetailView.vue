<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import programmes from '../data/programmes.json'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/bookings'
import { useReviewStore } from '../stores/reviews'
import StarRating from '../components/StarRating.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const bookingStore = useBookingStore()
const reviewStore = useReviewStore()

const programme = computed(() => programmes.find((p) => p.id === Number(route.params.id)))
const agg = computed(() => reviewStore.aggregateForProgramme(Number(route.params.id)))
const programmeReviews = computed(() => reviewStore.reviewsForProgramme(Number(route.params.id)))

// Form validation
const form = ref({ name: '', email: '', phone: '', sessionIndex: '', notes: '' })
const errors = ref({})
const bookingSuccess = ref(false)

function validate() {
  const e = {}
  if (!form.value.name.trim()) e.name = 'Full name is required.'
  if (!form.value.email.trim()) {
    e.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    e.email = 'Please enter a valid email address.'
  }
  if (!form.value.phone.trim()) {
    e.phone = 'Phone number is required.'
  } else if (!/^04\d{8}$/.test(form.value.phone.trim())) {
    e.phone = 'Please enter a valid Australian mobile number (04XXXXXXXX).'
  }
  if (form.value.sessionIndex === '') {
    e.sessionIndex = 'Please choose a session.'
  }
  errors.value = e
  return Object.keys(e).length === 0
}

function sessionRemaining(session) {
  return bookingStore.remainingCapacity(programme.value.id, session)
}

function sessionUnavailable(session) {
  return sessionRemaining(session) <= 0
}

function submitBooking() {
  bookingSuccess.value = false
  if (!validate()) return
  const session = programme.value.sessions[Number(form.value.sessionIndex)]
  const result = bookingStore.addBooking({
    programmeId: programme.value.id,
    programmeName: programme.value.name,
    sessionDate: session.date,
    sessionTime: session.time,
    userName: form.value.name.trim(),
    userEmail: form.value.email.trim(),
    phone: form.value.phone.trim(),
    notes: form.value.notes.trim()
  }, session.capacity)
  if (!result.ok) {
    errors.value = { sessionIndex: result.message }
    return
  }
  bookingSuccess.value = true
  form.value = { name: '', email: '', phone: '', sessionIndex: '', notes: '' }
  errors.value = {}
}

// Review form
const review = ref({ overall: 0, attitude: 0, professionalism: 0, timeliness: 0, comment: '' })
const reviewError = ref('')
const reviewSuccess = ref(false)

function submitReview() {
  reviewSuccess.value = false
  if (!auth.isLoggedIn) {
    reviewError.value = 'Please log in to leave a review.'
    return
  }
  if (review.value.overall === 0 || review.value.attitude === 0 ||
      review.value.professionalism === 0 || review.value.timeliness === 0) {
    reviewError.value = 'Please rate all four categories before submitting.'
    return
  }
  reviewError.value = ''
  reviewStore.addReview({
    programmeId: programme.value.id,
    author: auth.currentUser.name,
    ...review.value
  })
  review.value = { overall: 0, attitude: 0, professionalism: 0, timeliness: 0, comment: '' }
  reviewSuccess.value = true
}

function prefillForUser() {
  if (auth.isLoggedIn) {
    form.value.name = auth.currentUser.name
    form.value.email = auth.currentUser.email
  }
}
</script>

<template>
  <div v-if="!programme" class="container page">
    <h1>Programme not found</h1>
    <RouterLink to="/programmes" class="btn btn-primary">Back to programmes</RouterLink>
  </div>

  <div v-else class="container page">
    <RouterLink to="/programmes" class="back-link">← All programmes</RouterLink>

    <header class="detail-header reveal">
      <span class="tag" :class="'tag-' + programme.category">{{ programme.categoryLabel }}</span>
      <h1>{{ programme.name }}</h1>
      <p class="detail-meta">📍 {{ programme.location }}</p>
      <div class="detail-rating">
        <StarRating :model-value="agg.overall" readonly />
        <strong>{{ agg.overall ? agg.overall.toFixed(1) : '—' }}</strong>
        <span>({{ agg.count }} review{{ agg.count === 1 ? '' : 's' }})</span>
      </div>
    </header>

    <div class="detail-grid">
      <div class="detail-main">
        <section class="card reveal">
          <h2>About this programme</h2>
          <p>{{ programme.description }}</p>
        </section>

        <section class="card reveal">
          <h2>Upcoming sessions</h2>
          <ul class="session-list">
            <li v-for="(s, i) in programme.sessions" :key="i">
              <span class="session-date">📅 {{ s.date }}</span>
              <span class="session-time">🕘 {{ s.time }}</span>
              <span class="session-cap">{{ sessionRemaining(s) }} of {{ s.capacity }} places left</span>
            </li>
          </ul>
        </section>

        <section class="card reveal">
          <h2>Ratings &amp; reviews</h2>
          <div v-if="agg.count > 0" class="stats-panel">
            <div class="stat-row">
              <span>Overall</span>
              <StarRating :model-value="agg.overall" readonly size="1.1em" />
              <strong>{{ agg.overall.toFixed(1) }}</strong>
            </div>
            <div class="stat-row">
              <span>Staff attitude</span>
              <StarRating :model-value="agg.attitude" readonly size="1.1em" />
              <strong>{{ agg.attitude.toFixed(1) }}</strong>
            </div>
            <div class="stat-row">
              <span>Professionalism</span>
              <StarRating :model-value="agg.professionalism" readonly size="1.1em" />
              <strong>{{ agg.professionalism.toFixed(1) }}</strong>
            </div>
            <div class="stat-row">
              <span>Timeliness</span>
              <StarRating :model-value="agg.timeliness" readonly size="1.1em" />
              <strong>{{ agg.timeliness.toFixed(1) }}</strong>
            </div>
          </div>
          <p v-else>No reviews yet — be the first to share your experience.</p>

          <ul class="review-list">
            <li v-for="r in programmeReviews" :key="r.id" class="review-item">
              <div class="review-head">
                <strong>{{ r.author }}</strong>
                <span class="review-date">{{ r.date }}</span>
              </div>
              <StarRating :model-value="r.overall" readonly size="1em" />
              <p>{{ r.comment }}</p>
            </li>
          </ul>

          <div class="review-form">
            <h3>Share your experience</h3>
            <div v-if="!auth.isLoggedIn" class="alert-error">
              You need to <RouterLink to="/login">log in</RouterLink> to leave a review.
            </div>
            <template v-else>
              <div v-if="reviewSuccess" class="success-banner">Thank you! Your review has been submitted.</div>
              <div v-if="reviewError" class="alert-error">{{ reviewError }}</div>
              <div class="rate-grid">
                <div class="rate-row"><span>Overall</span><StarRating v-model="review.overall" /></div>
                <div class="rate-row"><span>Staff attitude</span><StarRating v-model="review.attitude" /></div>
                <div class="rate-row"><span>Professionalism</span><StarRating v-model="review.professionalism" /></div>
                <div class="rate-row"><span>Timeliness</span><StarRating v-model="review.timeliness" /></div>
              </div>
              <div class="form-group">
                <label for="comment">Your comment</label>
                <textarea id="comment" v-model="review.comment" class="form-control" rows="3"
                  placeholder="Tell others about your experience (optional)"></textarea>
              </div>
              <button class="btn btn-primary" @click="submitReview">Submit review</button>
            </template>
          </div>
        </section>
      </div>

      <aside class="detail-side">
        <section class="card booking-card reveal">
          <p class="eyebrow">A3 F.1 · constrained appointment booking</p>
          <h2>Book this service</h2>
          <p class="booking-note">Availability updates from confirmed bookings. Duplicate and same-time bookings are blocked.</p>
          <div v-if="bookingSuccess" class="success-banner" role="status">
            ✅ Booking confirmed! We look forward to seeing you.
          </div>
          <form @submit.prevent="submitBooking" novalidate>
            <div class="form-group">
              <label for="b-name">Full name <span class="required-mark">*</span></label>
              <input id="b-name" v-model="form.name" type="text" class="form-control"
                :class="{ invalid: errors.name }" placeholder="e.g. Margaret Thompson">
              <p v-if="errors.name" class="error-msg">{{ errors.name }}</p>
            </div>
            <div class="form-group">
              <label for="b-email">Email <span class="required-mark">*</span></label>
              <input id="b-email" v-model="form.email" type="email" class="form-control"
                :class="{ invalid: errors.email }" placeholder="you@example.com">
              <p v-if="errors.email" class="error-msg">{{ errors.email }}</p>
            </div>
            <div class="form-group">
              <label for="b-phone">Mobile number <span class="required-mark">*</span></label>
              <input id="b-phone" v-model="form.phone" type="tel" class="form-control"
                :class="{ invalid: errors.phone }" placeholder="04XXXXXXXX">
              <p v-if="errors.phone" class="error-msg">{{ errors.phone }}</p>
            </div>
            <div class="form-group">
              <label for="b-session">Choose a session <span class="required-mark">*</span></label>
              <select id="b-session" v-model="form.sessionIndex" class="form-control"
                :class="{ invalid: errors.sessionIndex }">
                <option value="" disabled>Select a date…</option>
                <option v-for="(s, i) in programme.sessions" :key="i" :value="i" :disabled="sessionUnavailable(s)">
                  {{ s.date }} · {{ s.time }} · {{ sessionRemaining(s) }} places left{{ sessionUnavailable(s) ? ' (FULL)' : '' }}
                </option>
              </select>
              <p v-if="errors.sessionIndex" class="error-msg">{{ errors.sessionIndex }}</p>
            </div>
            <div class="form-group">
              <label for="b-notes">Notes for our team</label>
              <textarea id="b-notes" v-model="form.notes" class="form-control" rows="2"
                placeholder="Mobility needs, interpreter, etc. (optional)"></textarea>
            </div>
            <button type="submit" class="btn btn-gold booking-btn">Confirm booking</button>
            <button v-if="auth.isLoggedIn" type="button" class="link-btn" @click="prefillForUser">
              Fill in my details
            </button>
          </form>
        </section>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.back-link { font-weight: 600; text-decoration: none; }
.detail-header { margin: 1rem 0 1.5rem; }
.detail-meta { color: #718096; margin: 0.3em 0; }
.detail-rating { display: flex; align-items: center; gap: 0.5em; margin-top: 0.5em; }

.detail-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 1.5rem;
  align-items: start;
}
.detail-main { display: flex; flex-direction: column; gap: 1rem; }

.session-list { list-style: none; padding: 0; margin: 0.5rem 0 0; display: flex; flex-direction: column; gap: 0.5rem; }
.session-list li {
  display: flex;
  gap: 1rem;
  background: var(--teal-50);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 0.6em 0.8em;
  font-weight: 600;
}
.session-cap { color: #718096; font-weight: 500; margin-left: auto; }

.stats-panel { border-bottom: 1px solid var(--line); padding-bottom: 1rem; margin-bottom: 1rem; }
.stat-row { display: flex; align-items: center; gap: 0.8em; margin-bottom: 0.4em; }
.stat-row span { width: 9em; color: #4a5568; }
.stat-row strong { margin-left: auto; }

.review-list { list-style: none; padding: 0; margin: 0 0 1.5rem; }
.review-item { border-bottom: 1px solid var(--line); padding: 0.8em 0; }
.review-head { display: flex; justify-content: space-between; margin-bottom: 0.2em; }
.review-date { color: #718096; font-size: 0.85em; }
.review-item p { margin: 0.4em 0 0; }

.review-form { background: var(--teal-50); border: 1px solid var(--line); border-radius: var(--radius); padding: 1rem; }
.rate-grid { margin-bottom: 1rem; }
.rate-row { display: flex; align-items: center; justify-content: space-between; gap: 1em; padding: 0.3em 0; }

.booking-card { border-top: 4px solid var(--gold-500); }
.booking-btn { width: 100%; }
.link-btn {
  display: block;
  margin: 0.8rem auto 0;
  background: none;
  border: none;
  color: var(--teal-700);
  font-weight: 600;
  font-size: 0.9em;
  cursor: pointer;
  text-decoration: underline;
}

@media (max-width: 900px) {
  .detail-grid { grid-template-columns: 1fr; }
}
</style>