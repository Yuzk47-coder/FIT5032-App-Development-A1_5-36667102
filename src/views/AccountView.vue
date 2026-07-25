<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/bookings'
import { useReviewStore } from '../stores/reviews'
import StarRating from '../components/StarRating.vue'

const auth = useAuthStore()
const bookingStore = useBookingStore()
const reviewStore = useReviewStore()

const myBookings = computed(() => bookingStore.bookingsForUser(auth.currentUser.email))
const myReviews = computed(() =>
  reviewStore.reviews.filter((r) => r.author === auth.currentUser.name)
)

const roleLabel = { user: 'General user', volunteer: 'Volunteer', admin: 'Administrator' }
</script>

<template>
  <div class="container page">
    <p class="eyebrow">My Account</p>
    <h1>Hello, {{ auth.currentUser.name }} 👋</h1>
    <p>
      <span class="role-badge">{{ roleLabel[auth.currentUser.role] }}</span>
      {{ auth.currentUser.email }}
    </p>

    <div class="account-grid">
      <section class="card reveal">
        <h2>My bookings ({{ myBookings.length }})</h2>
        <p v-if="myBookings.length === 0">
          No bookings yet. <RouterLink to="/programmes">Browse programmes</RouterLink> to book a service.
        </p>
        <ul v-else class="booking-list">
          <li v-for="b in myBookings" :key="b.id">
            <div class="booking-main">
              <strong>{{ b.programmeName }}</strong>
              <span>📅 {{ b.sessionDate }} · 🕘 {{ b.sessionTime }}</span>
            </div>
            <span class="status" :class="'status-' + b.status">{{ b.status }}</span>
          </li>
        </ul>
      </section>

      <section class="card reveal">
        <h2>My reviews ({{ myReviews.length }})</h2>
        <p v-if="myReviews.length === 0">
          You haven't left any reviews yet. Your feedback helps us improve.
        </p>
        <ul v-else class="my-review-list">
          <li v-for="r in myReviews" :key="r.id">
            <div class="review-head">
              <StarRating :model-value="r.overall" readonly size="1em" />
              <span class="review-date">{{ r.date }}</span>
            </div>
            <p v-if="r.comment">{{ r.comment }}</p>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.role-badge {
  display: inline-block;
  background: var(--teal-100);
  color: var(--teal-900);
  font-weight: 700;
  font-size: 0.8em;
  padding: 0.2em 0.6em;
  border-radius: 4px;
  margin-right: 0.5em;
}
.account-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  margin-top: 1.2rem;
  align-items: start;
}
.booking-list, .my-review-list { list-style: none; padding: 0; margin: 0.5rem 0 0; }
.booking-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.7em 0;
  border-bottom: 1px solid var(--line);
}
.booking-main { display: flex; flex-direction: column; }
.booking-main span { font-size: 0.85em; color: #718096; }
.status {
  font-weight: 700;
  font-size: 0.75em;
  text-transform: uppercase;
  padding: 0.2em 0.6em;
  border-radius: 4px;
}
.status-confirmed { background: var(--teal-100); color: var(--teal-900); }
.status-cancelled { background: var(--coral-100); color: var(--coral-600); }
.my-review-list li { padding: 0.7em 0; border-bottom: 1px solid var(--line); }
.my-review-list p { margin: 0.3em 0 0; }
.review-head { display: flex; justify-content: space-between; align-items: center; }
.review-date { color: #718096; font-size: 0.85em; }

@media (max-width: 760px) {
  .account-grid { grid-template-columns: 1fr; }
}
</style>