<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useReviewStore } from '../stores/reviews'
import { useBookingStore } from '../stores/bookings'
import programmes from '../data/programmes.json'

const auth = useAuthStore()
const reviewStore = useReviewStore()
const bookingStore = useBookingStore()

const today = new Date().toLocaleDateString('en-AU', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
})

const upcomingSessions = computed(() => {
  const rows = []
  programmes.forEach((p) => {
    p.sessions.forEach((s) => rows.push({ ...s, programme: p.name, category: p.category, programmeId: p.id }))
  })
  return rows.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4)
})

const serviceAreas = [
  { icon: '🩺', title: 'Community Free Clinics', text: 'Free check-ups and doctor consultations for adults aged 60+.' },
  { icon: '🏠', title: 'In-Home Wellness Visits', text: 'Trained volunteers visit seniors at home for companionship and wellbeing checks.' },
  { icon: '❤️', title: 'Cardio-Cerebral Health Education', text: 'Practical guidance on chronic disease management and prevention.' },
  { icon: '🙋', title: 'Volunteer Coordination', text: 'Join our volunteer team and support seniors in your community.' }
]
</script>

<template>
  <section class="home-opening">
    <div class="container opening-grid">
      <div class="opening-text reveal">
        <p class="eyebrow-light">Silver Age Wellbeing Foundation · {{ today }}</p>
        <h1>Care that reaches every doorstep.</h1>
        <p class="lead">
          We remove barriers to health services for older adults in urban and
          rural communities — with free clinics, home visits, health education
          and a dedicated volunteer network.
        </p>
        <div class="opening-actions">
          <RouterLink to="/programmes" class="btn btn-gold">Book a service</RouterLink>
          <RouterLink v-if="!auth.isLoggedIn" to="/register" class="btn btn-outline-light">Create an account</RouterLink>
          <RouterLink v-else to="/account" class="btn btn-outline-light">My account</RouterLink>
        </div>
      </div>

      <aside class="noticeboard reveal" aria-label="Upcoming sessions">
        <p class="board-title">📌 What's on this month</p>
        <ul>
          <li v-for="s in upcomingSessions" :key="s.programme + s.date">
            <RouterLink :to="'/programmes/' + s.programmeId">
              <span class="board-date">{{ s.date }}</span>
              <span class="board-name">{{ s.programme }}</span>
              <span class="board-time">{{ s.time }}</span>
            </RouterLink>
          </li>
        </ul>
        <div class="board-stats">
          <span><strong>12,400+</strong> seniors served</span>
          <span><strong>340</strong> volunteers</span>
        </div>
      </aside>
    </div>
  </section>

  <section class="container section">
    <h2>Our four service areas</h2>
    <ol class="area-list">
      <li
        v-for="(area, i) in serviceAreas"
        :key="area.title"
        class="area-row reveal"
        :class="'reveal-delay-' + (i % 4)"
      >
        <span class="area-num">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="area-icon" aria-hidden="true">{{ area.icon }}</span>
        <div>
          <h3>{{ area.title }}</h3>
          <p>{{ area.text }}</p>
        </div>
        <RouterLink to="/programmes" class="area-link">Explore →</RouterLink>
      </li>
    </ol>
  </section>

  <section class="how-section">
    <div class="container">
      <h2>How it works</h2>
      <ol class="steps">
        <li class="reveal"><strong>1 · Register</strong><span>Simple sign-up in a few steps — or ask a family member to help.</span></li>
        <li class="reveal"><strong>2 · Book</strong><span>Choose a clinic session or request a home visit online.</span></li>
        <li class="reveal"><strong>3 · Receive care</strong><span>Attend your appointment or welcome your volunteer.</span></li>
        <li class="reveal"><strong>4 · Rate</strong><span>Share feedback to help us improve every service.</span></li>
      </ol>
    </div>
  </section>

  <section class="container section trust-strip">
    <div class="trust-item">
      <strong>{{ reviewStore.globalStats.overall.toFixed(1) }}★</strong>
      <span>average rating across {{ reviewStore.globalStats.count }} reviews</span>
    </div>
    <div class="trust-item">
      <strong>{{ bookingStore.bookings.length }}</strong>
      <span>bookings currently managed</span>
    </div>
    <div class="trust-item">
      <strong>{{ programmes.length }}</strong>
      <span>active programmes open for booking</span>
    </div>
  </section>
</template>

<style scoped>
.home-opening {
  background: #1a365d;
  color: var(--white);
  padding: 2.5rem 0;
}
.opening-grid {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 2rem;
  align-items: center;
}
.eyebrow-light {
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.8em;
  color: var(--gold-100);
  margin: 0 0 0.5em;
}
.home-opening h1 { color: var(--white); margin-bottom: 0.4em; }
.lead { font-size: 1.1em; opacity: 0.9; }
.opening-actions { display: flex; gap: 0.8rem; margin-top: 1.2rem; flex-wrap: wrap; }
.btn-outline-light {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.8);
  color: var(--white);
  font-weight: 600;
  padding: 0.5em 1.2em;
  border-radius: var(--radius);
  text-decoration: none;
}
.btn-outline-light:hover { background: var(--white); color: var(--teal-900); }

.noticeboard {
  background: var(--white);
  color: var(--ink);
  border-radius: var(--radius);
  padding: 1.2rem;
  border: 1px solid var(--line);
}
.board-title { font-weight: 700; margin: 0 0 0.5em; color: var(--teal-900); }
.noticeboard ul { list-style: none; margin: 0; padding: 0; }
.noticeboard li { border-bottom: 1px solid var(--line); }
.noticeboard li:last-child { border-bottom: none; }
.noticeboard li a {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.15em 0.8em;
  padding: 0.5em 0.2em;
  text-decoration: none;
  color: inherit;
}
.noticeboard li a:hover { background: var(--teal-50); }
.board-date { font-weight: 700; color: var(--coral-600); font-size: 0.85em; }
.board-name { font-weight: 600; font-size: 0.9em; }
.board-time { grid-column: 2; font-size: 0.8em; color: #718096; }
.board-stats {
  display: flex;
  gap: 1.2rem;
  margin-top: 0.8rem;
  padding-top: 0.8rem;
  border-top: 1px solid var(--line);
  font-size: 0.85em;
  color: #718096;
}
.board-stats strong { color: var(--teal-900); }

.section { padding-top: 2rem; }
.area-list { list-style: none; margin: 1rem 0 0; padding: 0; }
.area-row {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  gap: 1.2rem;
  align-items: center;
  padding: 1rem 0.5rem;
  border-bottom: 1px solid var(--line);
}
.area-num { font-size: 1.5rem; font-weight: 700; color: var(--gold-500); }
.area-icon { font-size: 1.5rem; }
.area-row h3 { margin: 0 0 0.15em; }
.area-row p { margin: 0; color: #4a5568; }
.area-link { font-weight: 600; text-decoration: none; }

.how-section {
  margin-top: 2rem;
  background: var(--teal-50);
  padding: 2rem 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.steps {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.steps li {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3em;
}

.trust-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.trust-item {
  background: var(--white);
  border: 1px solid var(--line);
  border-left: 4px solid var(--gold-500);
  border-radius: var(--radius);
  padding: 1rem;
}
.trust-item strong { display: block; font-size: 1.5em; color: var(--teal-900); }
.trust-item span { font-size: 0.85em; color: #718096; }

@media (max-width: 760px) {
  .opening-grid { grid-template-columns: 1fr; }
  .area-row { grid-template-columns: auto 1fr; }
  .area-icon, .area-link { display: none; }
  .steps { grid-template-columns: 1fr 1fr; }
  .trust-strip { grid-template-columns: 1fr; }
}
</style>