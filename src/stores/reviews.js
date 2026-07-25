import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import seedReviews from '../data/reviews.json'

export const useReviewStore = defineStore('reviews', () => {
  const reviews = ref([...seedReviews])

  function addReview(review) {
    reviews.value.push({
      id: reviews.value.length + 1,
      date: new Date().toISOString().slice(0, 10),
      ...review
    })
  }

  function reviewsForProgramme(programmeId) {
    return reviews.value.filter((r) => r.programmeId === programmeId)
  }

  // BR C.3 — aggregated rating statistics
  function aggregateForProgramme(programmeId) {
    const list = reviewsForProgramme(programmeId)
    if (list.length === 0) {
      return { count: 0, overall: 0, attitude: 0, professionalism: 0, timeliness: 0, distribution: [0, 0, 0, 0, 0] }
    }
    const avg = (key) => list.reduce((sum, r) => sum + r[key], 0) / list.length
    const distribution = [0, 0, 0, 0, 0]
    list.forEach((r) => { distribution[r.overall - 1]++ })
    return {
      count: list.length,
      overall: avg('overall'),
      attitude: avg('attitude'),
      professionalism: avg('professionalism'),
      timeliness: avg('timeliness'),
      distribution
    }
  }

  const globalStats = computed(() => {
    const list = reviews.value
    if (list.length === 0) return { count: 0, overall: 0 }
    return {
      count: list.length,
      overall: list.reduce((s, r) => s + r.overall, 0) / list.length
    }
  })

  return { reviews, addReview, reviewsForProgramme, aggregateForProgramme, globalStats }
})