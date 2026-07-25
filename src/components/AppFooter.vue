<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <strong class="footer-brand">Silver Age Wellbeing Foundation</strong>
        <p>
          A health charity improving access to care for older adults in urban
          and rural communities — through free clinics, home visits, health
          education and volunteer coordination.
        </p>
      </div>
      <div>
        <strong>Quick links</strong>
        <ul>
          <li><RouterLink to="/programmes">Our Programmes</RouterLink></li>
          <li><RouterLink to="/reviews">Service Reviews</RouterLink></li>
          <li><RouterLink to="/education">Health Education Hub</RouterLink></li>
          <li><RouterLink to="/contact">Contact Us</RouterLink></li>
        </ul>
      </div>
      <div>
        <strong>Contact</strong>
        <ul class="plain">
          <li>📞 1800 745 837 (free call)</li>
          <li>✉️ care@silveragewellbeing.org</li>
          <li>📍 12 Harmony Street, Melbourne VIC</li>
        </ul>
      </div>
    </div>
    <div class="footer-base">
      <div class="container">
        © 2026 Silver Age Wellbeing Foundation · FIT5032 Assignment · Accessibility: WCAG 2.1 AA
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer { background: var(--teal-900); color: rgba(255, 255, 255, 0.85); margin-top: 3rem; }
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
  padding-top: 2.2rem;
  padding-bottom: 1.6rem;
}
.footer-brand { font-family: var(--font-display); font-size: 1.15em; color: var(--white); }
.site-footer ul { list-style: none; padding: 0; margin: 0.6em 0 0; }
.site-footer li { margin-bottom: 0.4em; }
.site-footer a { color: var(--gold-100); text-decoration: none; }
.site-footer a:hover { text-decoration: underline; }
.footer-base {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 0.85em;
  padding: 0.8rem 0;
  opacity: 0.75;
}
@media (max-width: 760px) {
  .footer-grid { grid-template-columns: 1fr; }
}
</style>