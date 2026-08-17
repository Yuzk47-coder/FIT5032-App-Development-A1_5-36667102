<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  bookings: { type: Array, required: true },
  programmeStats: { type: Array, required: true }
})

const mode = ref('bookings')

const chartRows = computed(() => {
  if (mode.value === 'ratings') {
    return props.programmeStats.map((row) => ({
      label: row.programme.name,
      value: Number(row.agg.overall.toFixed(1)),
      max: 5,
      suffix: '/5'
    }))
  }
  const confirmed = props.bookings.filter((b) => b.status === 'confirmed').length
  const cancelled = props.bookings.filter((b) => b.status === 'cancelled').length
  const max = Math.max(1, confirmed, cancelled)
  return [
    { label: 'Confirmed bookings', value: confirmed, max, suffix: '' },
    { label: 'Cancelled bookings', value: cancelled, max, suffix: '' }
  ]
})
</script>

<template>
  <section class="card reveal analytics" aria-labelledby="analytics-title">
    <div class="section-head">
      <div>
        <p class="eyebrow">A3 F.1 · Interactive analytics</p>
        <h2 id="analytics-title">Dashboard chart</h2>
      </div>
      <div class="chart-switch" role="group" aria-label="Select chart dataset">
        <button class="btn btn-outline" :class="{ selected: mode === 'bookings' }" :aria-pressed="mode === 'bookings'" @click="mode = 'bookings'">Booking status</button>
        <button class="btn btn-outline" :class="{ selected: mode === 'ratings' }" :aria-pressed="mode === 'ratings'" @click="mode = 'ratings'">Programme ratings</button>
      </div>
    </div>

    <div class="bar-chart" role="img" :aria-label="mode === 'bookings' ? 'Bar chart of booking status counts' : 'Bar chart of average programme ratings'">
      <div v-for="row in chartRows" :key="row.label" class="bar-row">
        <span class="bar-label">{{ row.label }}</span>
        <div class="bar-track" aria-hidden="true"><span class="bar-fill" :style="{ width: `${(row.value / row.max) * 100}%` }"></span></div>
        <strong>{{ row.value }}{{ row.suffix }}</strong>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.chart-switch { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.chart-switch .selected { background: var(--teal-700); color: var(--white); }
.bar-chart { display: grid; gap: 0.9rem; margin-top: 1rem; }
.bar-row { display: grid; grid-template-columns: minmax(180px, 1.2fr) minmax(160px, 3fr) 60px; align-items: center; gap: 0.8rem; }
.bar-label { font-weight: 600; }
.bar-track { min-height: 1.25rem; background: var(--teal-100); border: 1px solid var(--line); border-radius: 999px; overflow: hidden; }
.bar-fill { display: block; height: 1.25rem; background: var(--teal-500); border-radius: inherit; transition: width 0.25s ease; }
@media (max-width: 700px) { .bar-row { grid-template-columns: 1fr 55px; } .bar-track { grid-column: 1 / -1; grid-row: 2; } }
</style>
