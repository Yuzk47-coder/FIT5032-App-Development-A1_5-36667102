<script setup>
import { computed } from 'vue'
import programmes from '../data/programmes.json'
import { useReviewStore } from '../stores/reviews'
import StarRating from '../components/StarRating.vue'

const reviewStore = useReviewStore()

const rows = computed(() =>
  programmes.map((p) => ({
    programme: p,
    agg: reviewStore.aggregateForProgramme(p.id)
  }))
)

const best = computed(() => {
  const rated = rows.value.filter((r) => r.agg.count > 0)
  if (rated.length === 0) return null
  return rated.reduce((a, b) => (b.agg.overall > a.agg.overall ? b : a))
})
</script>

<template>
  <div class="container page">
    <p class="eyebrow">Transparent feedback, published openly</p>
    <h1>Service Reviews</h1>
    <p class="page-intro">
      Every rating below comes from real service users. Aggregated scores are
      recalculated live across four dimensions: overall, staff attitude,
      professionalism and timeliness.
    </p>

    <div v-if="best" class="highlight-card reveal">
      <span class="highlight-badge">🏆 Highest rated</span>
      <div>
        <strong>{{ best.programme.name }}</strong>
        <div class="highlight-rating">
          <StarRating :model-value="best.agg.overall" readonly />
          <span>{{ best.agg.overall.toFixed(1) }} from {{ best.agg.count }} reviews</span>
        </div>
      </div>
      <RouterLink :to="'/programmes/' + best.programme.id" class="btn btn-primary">View programme</RouterLink>
    </div>

    <div class="review-rows">
      <article
        v-for="(row, i) in rows"
        :key="row.programme.id"
        class="card review-row reveal"
        :class="'reveal-delay-' + (i % 4)"
      >
        <div class="row-main">
          <span class="tag" :class="'tag-' + row.programme.category">{{ row.programme.categoryLabel }}</span>
          <h2>{{ row.programme.name }}</h2>
          <div class="row-rating">
            <StarRating :model-value="row.agg.overall" readonly />
            <strong>{{ row.agg.overall ? row.agg.overall.toFixed(1) : '—' }}</strong>
            <span>({{ row.agg.count }})</span>
          </div>
        </div>
        <div class="row-stats">
          <div><span>Attitude</span><strong>{{ row.agg.count ? row.agg.attitude.toFixed(1) : '—' }}</strong></div>
          <div><span>Professionalism</span><strong>{{ row.agg.count ? row.agg.professionalism.toFixed(1) : '—' }}</strong></div>
          <div><span>Timeliness</span><strong>{{ row.agg.count ? row.agg.timeliness.toFixed(1) : '—' }}</strong></div>
          <RouterLink :to="'/programmes/' + row.programme.id" class="row-link">Details &amp; reviews →</RouterLink>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.page-intro { max-width: 42em; }
.highlight-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: var(--gold-100);
  border: 1px solid var(--gold-500);
  border-radius: var(--radius);
  padding: 1rem 1.2rem;
  margin: 1.2rem 0;
}
.highlight-badge { font-weight: 700; white-space: nowrap; }
.highlight-card > div { flex: 1; }
.highlight-card strong { font-size: 1.1em; color: var(--teal-900); }
.highlight-rating { display: flex; align-items: center; gap: 0.6em; }
.highlight-rating span { color: #718096; font-size: 0.9em; }

.review-rows { display: flex; flex-direction: column; gap: 1rem; }
.review-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.5rem;
  align-items: center;
}
.review-row h2 { margin: 0.3em 0; font-size: calc(var(--fs-base) * 1.2); }
.row-rating { display: flex; align-items: center; gap: 0.5em; }
.row-rating strong { font-size: 1.1em; color: var(--teal-900); }
.row-rating span { color: #718096; font-size: 0.85em; }

.row-stats {
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 1rem;
  align-items: center;
  justify-content: end;
}
.row-stats div { display: flex; flex-direction: column; text-align: center; }
.row-stats span { font-size: 0.75em; color: #718096; }
.row-stats strong { font-size: 1.2em; color: var(--teal-700); }
.row-link { grid-column: 1 / -1; justify-self: end; font-weight: 600; text-decoration: none; }

@media (max-width: 760px) {
  .review-row { grid-template-columns: 1fr; }
  .row-stats { justify-content: start; }
  .highlight-card { flex-direction: column; align-items: flex-start; }
}
</style>