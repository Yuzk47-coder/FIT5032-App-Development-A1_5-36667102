<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/bookings'
import { useReviewStore } from '../stores/reviews'
import programmes from '../data/programmes.json'
import StarRating from '../components/StarRating.vue'
import InteractiveTable from '../components/InteractiveTable.vue'
import DashboardChart from '../components/DashboardChart.vue'
import { downloadCsv, downloadPdf } from '../utils/exporters'

const auth = useAuthStore()
const bookingStore = useBookingStore()
const reviewStore = useReviewStore()

const programmeStats = computed(() => programmes.map((p) => ({ id: p.id, programme: p, agg: reviewStore.aggregateForProgramme(p.id) })))

const bookingColumns = [
  { key: 'id', label: 'ID' },
  { key: 'programmeName', label: 'Programme' },
  { key: 'session', label: 'Session', value: (b) => `${b.sessionDate} ${b.sessionTime}` },
  { key: 'person', label: 'Name / Email', value: (b) => `${b.userName} ${b.userEmail}` },
  { key: 'phone', label: 'Phone' },
  { key: 'status', label: 'Status' },
  { key: 'action', label: 'Action', sortable: false, searchable: false }
]

const userColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' }
]

const ratingColumns = [
  { key: 'programme', label: 'Programme', value: (row) => row.programme.name },
  { key: 'reviews', label: 'Reviews', value: (row) => row.agg.count },
  { key: 'overall', label: 'Overall', value: (row) => row.agg.overall },
  { key: 'attitude', label: 'Attitude', value: (row) => row.agg.attitude },
  { key: 'professionalism', label: 'Professionalism', value: (row) => row.agg.professionalism },
  { key: 'timeliness', label: 'Timeliness', value: (row) => row.agg.timeliness }
]

const userExportColumns = [
  { label: 'ID', value: (u) => u.id },
  { label: 'Name', value: (u) => u.name },
  { label: 'Email', value: (u) => u.email },
  { label: 'Role', value: (u) => u.role }
]

function exportUsersCsv() { downloadCsv('users.csv', userExportColumns, auth.users) }
function exportUsersPdf() { downloadPdf('users.pdf', 'Silver Age - Registered Users', userExportColumns, auth.users) }
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

    <DashboardChart :bookings="bookingStore.bookings" :programme-stats="programmeStats" />

    <section class="card reveal">
      <div class="section-head">
        <div><p class="eyebrow">A3 D.3 + E.4</p><h2>Booking management</h2></div>
        <div class="export-actions">
          <button class="btn btn-outline" @click="bookingStore.exportCsv()">Export CSV</button>
          <button class="btn btn-outline" @click="bookingStore.exportPdf()">Export PDF</button>
        </div>
      </div>
      <InteractiveTable :columns="bookingColumns" :rows="bookingStore.bookings" caption="Booking management table" search-placeholder="Search bookings">
        <template #cell-session="{ row }">{{ row.sessionDate }}<br><small>{{ row.sessionTime }}</small></template>
        <template #cell-person="{ row }">{{ row.userName }}<br><small>{{ row.userEmail }}</small></template>
        <template #cell-status="{ row }"><span class="status" :class="'status-' + row.status">{{ row.status }}</span></template>
        <template #cell-action="{ row }">
          <button v-if="row.status === 'confirmed'" class="action-btn cancel" @click="bookingStore.updateStatus(row.id, 'cancelled')">Cancel</button>
          <button v-else class="action-btn restore" @click="bookingStore.updateStatus(row.id, 'confirmed')">Restore</button>
        </template>
      </InteractiveTable>
    </section>

    <section class="card reveal">
      <div class="section-head"><div><p class="eyebrow">A3 D.3</p><h2>Rating statistics by programme</h2></div></div>
      <InteractiveTable :columns="ratingColumns" :rows="programmeStats" caption="Programme rating statistics">
        <template #cell-overall="{ row }">
          <StarRating :model-value="row.agg.overall" readonly size="0.95em" />
          {{ row.agg.count ? row.agg.overall.toFixed(1) : '—' }}
        </template>
        <template #cell-attitude="{ row }">{{ row.agg.count ? row.agg.attitude.toFixed(1) : '—' }}</template>
        <template #cell-professionalism="{ row }">{{ row.agg.count ? row.agg.professionalism.toFixed(1) : '—' }}</template>
        <template #cell-timeliness="{ row }">{{ row.agg.count ? row.agg.timeliness.toFixed(1) : '—' }}</template>
      </InteractiveTable>
    </section>

    <section class="card reveal">
      <div class="section-head">
        <div><p class="eyebrow">A3 D.3 + E.4</p><h2>Registered users</h2></div>
        <div class="export-actions"><button class="btn btn-outline" @click="exportUsersCsv">Export CSV</button><button class="btn btn-outline" @click="exportUsersPdf">Export PDF</button></div>
      </div>
      <InteractiveTable :columns="userColumns" :rows="auth.users" caption="Registered users table" search-placeholder="Search users">
        <template #cell-role="{ row }"><span class="role-pill" :class="'role-' + row.role">{{ row.role }}</span></template>
      </InteractiveTable>
    </section>
  </div>
</template>

<style scoped>
.kpi-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 1.2rem 0; }
.kpi { background: var(--white); border: 1px solid var(--line); border-left: 4px solid var(--teal-500); border-radius: var(--radius); padding: 1rem; }
.kpi strong { display: block; font-size: 1.6em; color: var(--teal-900); }
.kpi span { font-size: 0.85em; color: #718096; }
.section-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.8rem; }
.section-head h2 { margin-bottom: 0; }
.export-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.status, .role-pill { font-weight: 700; font-size: 0.75em; text-transform: uppercase; padding: 0.2em 0.6em; border-radius: 4px; }
.status-confirmed { background: var(--teal-100); color: var(--teal-900); }
.status-cancelled { background: var(--coral-100); color: var(--coral-600); }
.action-btn { font-family: var(--font-family); font-weight: 600; font-size: 0.8em; padding: 0.3em 0.7em; border-radius: 4px; border: 1px solid; cursor: pointer; background: transparent; }
.action-btn.cancel { border-color: var(--coral-600); color: var(--coral-600); }
.action-btn.restore { border-color: var(--teal-500); color: var(--teal-700); }
.role-user { background: var(--teal-100); color: var(--teal-900); }
.role-volunteer { background: #e9d8fd; color: #44337a; }
.role-admin { background: var(--gold-100); color: #744210; }
@media (max-width: 760px) { .kpi-strip { grid-template-columns: 1fr 1fr; } }
</style>
