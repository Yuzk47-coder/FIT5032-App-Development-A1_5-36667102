import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRatingsStore = defineStore('ratings', () => {
  const ratings = ref({})

  function init() {
    const saved = localStorage.getItem('ratings')
    if (saved) {
      ratings.value = JSON.parse(saved)
    }
  }

  function rate(resourceId, userId, score) {
    if (!ratings.value[resourceId]) {
      ratings.value[resourceId] = []
    }
    const existingIndex = ratings.value[resourceId].findIndex(r => r.userId === userId)
    if (existingIndex !== -1) {
      ratings.value[resourceId][existingIndex].score = score
    } else {
      ratings.value[resourceId].push({ userId, score, timestamp: new Date().toISOString() })
    }
    localStorage.setItem('ratings', JSON.stringify(ratings.value))
  }

  function getAverage(resourceId) {
    const resourceRatings = ratings.value[resourceId]
    if (!resourceRatings || resourceRatings.length === 0) return 0
    const sum = resourceRatings.reduce((acc, r) => acc + r.score, 0)
    return (sum / resourceRatings.length).toFixed(1)
  }

  function getCount(resourceId) {
    const resourceRatings = ratings.value[resourceId]
    return resourceRatings ? resourceRatings.length : 0
  }

  function getUserRating(resourceId, userId) {
    const resourceRatings = ratings.value[resourceId]
    if (!resourceRatings) return 0
    const userRating = resourceRatings.find(r => r.userId === userId)
    return userRating ? userRating.score : 0
  }

  init()

  return { ratings, rate, getAverage, getCount, getUserRating }
})