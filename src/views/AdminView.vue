<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/bookings'
import { useReviewStore } from '../stores/reviews'
import programmes from '../data/programmes.json'
import StarRating from '../components/StarRating.vue'

const auth = useAuthStore()
const bookingStore = useBookingStore()
const reviewStore = useReviewStore()

const programmeStats = computed(() =>
  programmes.map((p) => ({ programme: p, agg: reviewStore.aggregateForProgramme(p.id) }))
)
</script>

<template>
  <div class="container page">
    <p class="eyebrow">Staff only · Administrator</p>
    <h1>Admin Dashboard</h1>
    <p>Logged in as {{ auth.currentUser.name }}.</p>

    <div class="kpi-strip">
      <div class="kpi reveal"><strong>{{ bookingStore.bookings.length }}</strong><span>Total bookings</span></div>
      <div class="kpi reveal"><strong>{{ reviewStore.globalStats.count }}</strong><span>Total reviews</span></div>
      <div class="kpi reveal"><strong>{{ reviewStore.globalStats.overall.toFixed(1) }}★</strong><span>Average rating</span></div>
      <div class="kpi reveal"><strong>{{ auth.users.length }}</strong><span>Registered users</span></div>
    </div>

    <section class="card reveal">
      <div class="section-head">
        <h2>Booking management</h2>
        <button class="btn btn-outline" @click="bookingStore.exportCsv()">⬇ Export CSV</button>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th><th>Programme</th><th>Session</th><th>Name</th><th>Phone</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in bookingStore.bookings" :key="b.id">
            <td>{{ b.id }}</td>
            <td>{{ b.programmeName }}</td>
            <td>{{ b.sessionDate }}<br>{{ b.sessionTime }}</td>
            <td>{{ b.userName }}<br><small>{{ b.userEmail }}</small></td>
            <td>{{ b.phone }}</td>
            <td>
              <span class="status" :class="'status-' + b.status">{{ b.status }}</span>
            </td>
            <td>
              <button
                v-if="b.status === 'confirmed'"
                class="action-btn cancel"
                @click="bookingStore.updateStatus(b.id, 'cancelled')"
              >Cancel</button>
              <button
                v-else
                class="action-btn restore"
                @click="bookingStore.updateStatus(b.id, 'confirmed')"
              >Restore</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card reveal">
      <h2>Rating statistics by programme</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Programme</th><th>Reviews</th><th>Overall</th><th>Attitude</th><th>Professionalism</th><th>Timeliness</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in programmeStats" :key="row.programme.id">
            <td>{{ row.programme.name }}</td>
            <td>{{ row.agg.count }}</td>
            <td>
              <StarRating :model-value="row.agg.overall" readonly size="0.95em" />
              {{ row.agg.count ? row.agg.overall.toFixed(1) : '—' }}
            </td>
            <td>{{ row.agg.count ? row.agg.attitude.toFixed(1) : '—' }}</td>
            <td>{{ row.agg.count ? row.agg.professionalism.toFixed(1) : '—' }}</td>
            <td>{{ row.agg.count ? row.agg.timeliness.toFixed(1) : '—' }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card reveal">
      <h2>Registered users</h2>
      <table class="data-table">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th></tr>
        </thead>
        <tbody>
          <tr v-for="u in auth.users" :key="u.id">
            <td>{{ u.id }}</td>
            <td>{{ u.name }}</td>
            <td>{{ u.email }}</td>
            <td><span class="role-pill" :class="'role-' + u.role">{{ u.role }}</span></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.kpi-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 1.2rem 0;
}
.kpi {
  background: var(--white);
  border: 1px solid var(--line);
  border-left: 4px solid var(--teal-500);
  border-radius: var(--radius);
  padding: 1rem;
}
.kpi strong { display: block; font-size: 1.6em; color: var(--teal-900); }
.kpi span { font-size: 0.85em; color: #718096; }

.section-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.8rem; }

.status {
  font-weight: 700;
  font-size: 0.75em;
  text-transform: uppercase;
  padding: 0.2em 0.6em;
  border-radius: 4px;
}
.status-confirmed { background: var(--teal-100); color: var(--teal-900); }
.status-cancelled { background: var(--coral-100); color: var(--coral-600); }

.action-btn {
  font-family: var(--font-family);
  font-weight: 600;
  font-size: 0.8em;
  padding: 0.3em 0.7em;
  border-radius: 4px;
  border: 1px solid;
  cursor: pointer;
  background: transparent;
}
.action-btn.cancel { border-color: var(--coral-600); color: var(--coral-600); }
.action-btn.cancel:hover { background: var(--coral-600); color: var(--white); }
.action-btn.restore { border-color: var(--teal-500); color: var(--teal-700); }
.action-btn.restore:hover { background: var(--teal-500); color: var(--white); }

.role-pill {
  font-size: 0.75em;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.2em 0.6em;
  border-radius: 4px;
}
.role-user { background: var(--teal-100); color: var(--teal-900); }
.role-volunteer { background: #e9d8fd; color: #44337a; }
.role-admin { background: var(--gold-100); color: #744210; }

@media (max-width: 760px) {
  .kpi-strip { grid-template-columns: 1fr 1fr; }
}
</style>