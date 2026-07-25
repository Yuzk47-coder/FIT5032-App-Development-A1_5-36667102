<script setup>
import { ref } from 'vue'
import articles from '../data/education.json'

const openId = ref(null)

function toggle(id) {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <div class="container page">
    <p class="eyebrow">Health Education Hub</p>
    <h1>Learn at your own pace</h1>
    <p class="page-intro">
      Practical, plain-language guides on chronic disease management,
      prevention and home care — written for older adults and their families.
      Click any guide to read it.
    </p>

    <div class="article-list">
      <article
        v-for="(a, i) in articles"
        :key="a.id"
        class="card article-card reveal"
        :class="'reveal-delay-' + (i % 4)"
      >
        <button class="article-head" :aria-expanded="openId === a.id" @click="toggle(a.id)">
          <div>
            <span class="article-topic">{{ a.topic }} · {{ a.readMinutes }} min read</span>
            <h2>{{ a.title }}</h2>
            <p>{{ a.summary }}</p>
          </div>
          <span class="chevron" :class="{ open: openId === a.id }" aria-hidden="true">▾</span>
        </button>
        <transition name="expand">
          <ul v-if="openId === a.id" class="article-body">
            <li v-for="(point, j) in a.content" :key="j">{{ point }}</li>
          </ul>
        </transition>
      </article>
    </div>

    <div class="cta-strip card">
      <div>
        <h2>Prefer to learn in person?</h2>
        <p>Join our Cardio-Cerebral Health Workshop — free, with large-print take-home guides.</p>
      </div>
      <RouterLink to="/programmes/3" class="btn btn-gold">Book the workshop</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.page-intro { max-width: 42em; }
.article-list { display: flex; flex-direction: column; gap: 0.8rem; margin-top: 1.2rem; }
.article-card { padding: 0; overflow: hidden; }
.article-head {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  background: none;
  border: none;
  text-align: left;
  padding: 1.1rem;
  cursor: pointer;
  font-family: var(--font-family);
  color: var(--ink);
}
.article-head:hover { background: var(--teal-50); }
.article-topic {
  font-size: 0.78em;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--coral-600);
}
.article-head h2 { margin: 0.2em 0 0.2em; font-size: calc(var(--fs-base) * 1.2); }
.article-head p { margin: 0; color: #4a5568; }
.chevron { font-size: 1.2em; color: var(--teal-700); }
.chevron.open { transform: rotate(180deg); }

.article-body {
  list-style: none;
  margin: 0;
  padding: 0 1.1rem 1.1rem 2.2rem;
}
.article-body li {
  position: relative;
  padding: 0.4em 0;
  border-top: 1px solid var(--line);
}
.article-body li::before {
  content: '✓';
  position: absolute;
  left: -1.2em;
  color: var(--teal-500);
  font-weight: 700;
}

.cta-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-top: 1.8rem;
  border-left: 4px solid var(--gold-500);
}
.cta-strip p { margin: 0.2em 0 0; color: #4a5568; }

@media (max-width: 760px) {
  .cta-strip { flex-direction: column; align-items: flex-start; }
}
</style>