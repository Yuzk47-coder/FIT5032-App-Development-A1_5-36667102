import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Three access tiers per A1 report: general user / volunteer / admin
  const users = ref([
    { id: 1, name: 'Chen Xue', email: 'user@test.com', password: 'user123', role: 'user' },
    { id: 2, name: 'Amy Wong', email: 'volunteer@test.com', password: 'vol123', role: 'volunteer' },
    { id: 3, name: 'Lin Hao', email: 'admin@test.com', password: 'admin123', role: 'admin' }
  ])

  const currentUser = ref(JSON.parse(localStorage.getItem('currentUser') || 'null'))

  const isLoggedIn = computed(() => currentUser.value !== null)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')
  const isVolunteer = computed(() => currentUser.value?.role === 'volunteer')

  function register({ name, email, password }) {
    if (users.value.some((u) => u.email === email)) {
      return { ok: false, message: 'An account with this email already exists.' }
    }
    users.value.push({ id: users.value.length + 1, name, email, password, role: 'user' })
    return { ok: true }
  }

  function login(email, password) {
    const found = users.value.find((u) => u.email === email && u.password === password)
    if (!found) return { ok: false, message: 'Incorrect email or password.' }
    const { password: _pw, ...safeUser } = found
    currentUser.value = safeUser
    localStorage.setItem('currentUser', JSON.stringify(safeUser))
    return { ok: true, user: safeUser }
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }

  return { users, currentUser, isLoggedIn, isAdmin, isVolunteer, register, login, logout }
})