<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import programmes from '../data/programmes.json'

const category = ref('all')
const userLocation = ref(null)
const locationStatus = ref('Use your location to calculate distance and find the nearest programme.')
const mapError = ref('')
let map
let markerLayer
let userMarker

const categories = [
  ['all', 'All services'], ['clinic', 'Clinics'], ['home', 'Home visits'], ['education', 'Education'], ['volunteer', 'Volunteering']
]

function distanceKm(a, b) {
  const toRad = (degrees) => degrees * Math.PI / 180
  const earthRadius = 6371
  const dLat = toRad(b.latitude - a.latitude)
  const dLon = toRad(b.longitude - a.longitude)
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return earthRadius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

const visibleProgrammes = computed(() => {
  let list = category.value === 'all' ? [...programmes] : programmes.filter((p) => p.category === category.value)
  if (userLocation.value) {
    list = list.map((p) => ({ ...p, distance: distanceKm(userLocation.value, p) })).sort((a, b) => a.distance - b.distance)
  }
  return list
})

const nearestProgramme = computed(() => userLocation.value && visibleProgrammes.value.length ? visibleProgrammes.value[0] : null)

function routeUrl(programme) {
  if (!userLocation.value) return `https://www.openstreetmap.org/?mlat=${programme.latitude}&mlon=${programme.longitude}#map=16/${programme.latitude}/${programme.longitude}`
  const start = `${userLocation.value.latitude},${userLocation.value.longitude}`
  const end = `${programme.latitude},${programme.longitude}`
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${encodeURIComponent(start + ';' + end)}`
}

function renderMarkers() {
  if (!map || !window.L) return
  if (markerLayer) markerLayer.clearLayers()
  else markerLayer = window.L.layerGroup().addTo(map)

  const bounds = []
  visibleProgrammes.value.forEach((programme) => {
    const marker = window.L.marker([programme.latitude, programme.longitude])
      .bindPopup(`<strong>${programme.name}</strong><br>${programme.location}`)
      .addTo(markerLayer)
    marker.__programmeId = programme.id
    bounds.push([programme.latitude, programme.longitude])
  })
  if (userLocation.value) bounds.push([userLocation.value.latitude, userLocation.value.longitude])
  if (bounds.length) map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 })
}

function focusProgramme(programme) {
  if (!map || !window.L) return
  map.setView([programme.latitude, programme.longitude], 15)
  markerLayer?.eachLayer((layer) => { if (layer.__programmeId === programme.id) layer.openPopup() })
}

function useMyLocation() {
  if (!navigator.geolocation) {
    locationStatus.value = 'Geolocation is not supported by this browser.'
    return
  }
  locationStatus.value = 'Requesting your location…'
  navigator.geolocation.getCurrentPosition((position) => {
    userLocation.value = { latitude: position.coords.latitude, longitude: position.coords.longitude }
    locationStatus.value = 'Location found. Distances are straight-line estimates; use Route for road directions.'
    if (map && window.L) {
      if (userMarker) userMarker.remove()
      userMarker = window.L.circleMarker([userLocation.value.latitude, userLocation.value.longitude], { radius: 9 })
        .bindPopup('Your current location')
        .addTo(map)
    }
    nextTick(renderMarkers)
  }, (error) => {
    locationStatus.value = error.code === 1 ? 'Location permission was denied. You can still browse all programme locations.' : 'Your location could not be determined.'
  }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 })
}

onMounted(() => {
  if (!window.L) { mapError.value = 'The map library could not be loaded. The accessible programme list below still works.'; return }
  map = window.L.map('service-map', { scrollWheelZoom: false }).setView([-37.8136, 144.9631], 13)
  window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map)
  renderMarkers()
})

watch(category, () => nextTick(renderMarkers))
onBeforeUnmount(() => map?.remove())
</script>

<template>
  <div class="container page">
    <p class="eyebrow">A3 E.2 · Geo Location</p>
    <h1>Find Services Near You</h1>
    <p class="intro">Explore programme locations, filter service types, use browser geolocation to calculate the nearest service, and open road directions without creating another account.</p>

    <section class="card controls" aria-labelledby="map-tools-title">
      <div>
        <h2 id="map-tools-title">Map tools</h2>
        <div class="filter-row" role="group" aria-label="Filter map by service type">
          <button v-for="item in categories" :key="item[0]" class="btn btn-outline" :class="{ active: category === item[0] }" :aria-pressed="category === item[0]" @click="category = item[0]">{{ item[1] }}</button>
        </div>
      </div>
      <button class="btn btn-gold" @click="useMyLocation">Use my location</button>
      <p class="location-status" aria-live="polite">{{ locationStatus }}</p>
      <p v-if="nearestProgramme" class="nearest"><strong>Nearest in this filter:</strong> {{ nearestProgramme.name }} — {{ nearestProgramme.distance.toFixed(1) }} km away.</p>
    </section>

    <div v-if="mapError" class="alert-error" role="alert">{{ mapError }}</div>
    <div id="service-map" class="map" role="region" aria-label="Interactive map showing Silver Age programme locations"></div>

    <section class="service-list" aria-labelledby="service-list-title">
      <h2 id="service-list-title">Programme locations</h2>
      <article v-for="programme in visibleProgrammes" :key="programme.id" class="card service-card">
        <div>
          <span class="tag" :class="'tag-' + programme.category">{{ programme.categoryLabel }}</span>
          <h3>{{ programme.name }}</h3>
          <p>{{ programme.location }}</p>
          <p v-if="userLocation"><strong>{{ programme.distance.toFixed(1) }} km</strong> straight-line distance from your location.</p>
        </div>
        <div class="service-actions">
          <button class="btn btn-outline" @click="focusProgramme(programme)">Show on map</button>
          <a class="btn btn-primary" :href="routeUrl(programme)" target="_blank" rel="noopener noreferrer">Route ↗</a>
          <RouterLink class="btn btn-gold" :to="'/programmes/' + programme.id">View programme</RouterLink>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.intro { max-width: 54rem; }
.controls { display: grid; grid-template-columns: 1fr auto; gap: 0.8rem 1rem; align-items: center; }
.controls h2 { margin-bottom: 0.6rem; }
.filter-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.filter-row .active { background: var(--teal-700); color: var(--white); }
.location-status, .nearest { grid-column: 1 / -1; margin: 0; }
.nearest { padding: 0.7rem; background: var(--teal-100); border-radius: var(--radius); }
.map { height: 430px; width: 100%; border: 1px solid var(--line); border-radius: var(--radius); margin: 1rem 0 1.5rem; z-index: 1; }
.service-list { display: grid; gap: 0.8rem; }
.service-card { display: grid; grid-template-columns: 1fr auto; gap: 1rem; align-items: center; }
.service-card h3 { margin: 0.4rem 0 0.2rem; }
.service-card p { margin: 0.2rem 0; }
.service-actions { display: flex; flex-direction: column; gap: 0.5rem; min-width: 150px; }
@media (max-width: 760px) { .controls, .service-card { grid-template-columns: 1fr; } .service-actions { flex-direction: row; flex-wrap: wrap; } .map { height: 350px; } }
</style>
