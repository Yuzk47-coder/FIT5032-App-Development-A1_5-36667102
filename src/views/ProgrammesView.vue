<script setup>
import { ref, computed } from 'vue'
import programmes from '../data/programmes.json'
import { useReviewStore } from '../stores/reviews'
import StarRating from '../components/StarRating.vue'

const reviewStore = useReviewStore()
const activeFilter = ref('all')

const filters = [
  { value: 'all', label: 'All' },
  { value: 'clinic', label: 'Free Clinics' },
  { value: 'home', label: 'Home Visits' },
  { value: 'education', label: 'Education' },
  { value: 'volunteer', label: 'Volunteering' }
]

const filtered = computed(() =>
  activeFilter.value === 'all'
    ? programmes
    : programmes.filter((p) => p.category === activeFilter.value)
)
</script>

<template>
  <div class="container page">
    <p class="eyebrow">Official programme directory</p>
    <h1>Our Programmes</h1>
    <p class="page-intro">
      Browse all charitable services offered by the foundation. Select a
      programme to see full details and book a session.
    </p>

    <div class="filter-bar" role="group" aria-label="Filter programmes by category">
      <button
        v-for="f in filters"
        :key="f.value"
        class="filter-btn"
        :class="{ active: activeFilter === f.value }"
        @click="activeFilter = f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <div class="programme-list">
      <article
        v-for="(p, i) in filtered"
        :key="p.id"
        class="card programme-card reveal"
        :class="'reveal-delay-' + (i % 4)"
      >
        <div class="programme-main">
          <span class="tag" :class="'tag-' + p.category">{{ p.categoryLabel }}</span>
          <h2 class="programme-title">{{ p.name }}</h2>
          <p>{{ p.summary }}</p>
          <p class="meta">📍 {{ p.location }} · {{ p.sessions.length }} upcoming session{{ p.sessions.length > 1 ? 's' : '' }}</p>
        </div>
        <div class="programme-side">
          <div class="rating-line">
            <StarRating :model-value="reviewStore.aggregateForProgramme(p.id).overall" readonly size="1.15em" />
            <span class="rating-count">
              {{ reviewStore.aggregateForProgramme(p.id).count }} review{{ reviewStore.aggregateForProgramme(p.id).count === 1 ? '' : 's' }}
            </span>
          </div>
          <RouterLink :to="'/programmes/' + p.id" class="btn btn-primary">View &amp; Book</RouterLink>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.page-intro { max-width: 40em; }
.filter-bar { display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 1.2rem 0; }
.filter-btn {
  font-family: var(--font-family);
  font-size: 0.9em;
  font-weight: 600;
  padding: 0.3em 0.9em;
  border-radius: 4px;
  border: 1px solid var(--line);
  background: var(--white);
  color: var(--ink);
  cursor: pointer;
}
.filter-btn.active { background: var(--teal-700); border-color: var(--teal-700); color: var(--white); }

.programme-list { display: flex; flex-direction: column; gap: 1rem; }
.programme-card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  align-items: center;
}
.programme-title { margin: 0.35em 0 0.3em; }
.meta { color: #718096; font-size: 0.9em; margin: 0.4em 0 0; }
.programme-side { display: flex; flex-direction: column; gap: 0.8rem; align-items: flex-end; }
.rating-line { display: flex; align-items: center; gap: 0.5em; }
.rating-count { font-size: 0.85em; color: #718096; }

@media (max-width: 760px) {
  .programme-card { grid-template-columns: 1fr; }
  .programme-side { align-items: flex-start; }
}
</style>