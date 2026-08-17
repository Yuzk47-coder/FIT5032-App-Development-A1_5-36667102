import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { firebaseConfigured, firebaseLogin, firebaseLogout, firebaseRegister } from '../services/firebaseAuth'

const demoUsers = [
  { id: 1, name: 'Chen Xue', email: 'user@test.com', password: 'user123', role: 'user' },
  { id: 2, name: 'Amy Wong', email: 'volunteer@test.com', password: 'vol123', role: 'volunteer' },
  { id: 3, name: 'Lin Hao', email: 'admin@test.com', password: 'admin123', role: 'admin' },
  { id: 4, name: 'Margaret Lee', email: 'margaret@example.com', password: 'demo123', role: 'user' },
  { id: 5, name: 'Peter Chan', email: 'peter@example.com', password: 'demo123', role: 'user' },
  { id: 6, name: 'June Taylor', email: 'june@example.com', password: 'demo123', role: 'user' },
  { id: 7, name: 'Samir Patel', email: 'samir@example.com', password: 'demo123', role: 'volunteer' },
  { id: 8, name: 'Helen Wu', email: 'helen@example.com', password: 'demo123', role: 'user' },
  { id: 9, name: 'George Brown', email: 'george@example.com', password: 'demo123', role: 'user' },
  { id: 10, name: 'Nora Lim', email: 'nora@example.com', password: 'demo123', role: 'volunteer' },
  { id: 11, name: 'David Kim', email: 'david@example.com', password: 'demo123', role: 'user' },
  { id: 12, name: 'Grace Young', email: 'grace@example.com', password: 'demo123', role: 'user' }
]

export const useAuthStore = defineStore('auth', () => {
  // A2 roles are retained. A3 adds Firebase as the external authentication provider.
  const users = ref([...demoUsers])
  const currentUser = ref(JSON.parse(localStorage.getItem('currentUser') || 'null'))
  const authBusy = ref(false)

  const isLoggedIn = computed(() => currentUser.value !== null)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')
  const isVolunteer = computed(() => currentUser.value?.role === 'volunteer')
  const externalAuthAvailable = computed(() => firebaseConfigured)

  function saveSession(user) {
    currentUser.value = user
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  async function register({ name, email, password }) {
    authBusy.value = true
    try {
      if (firebaseConfigured) {
        const result = await firebaseRegister(email, password, name)
        if (result.ok) {
          saveSession(result.user)
          if (!users.value.some((u) => u.email === result.user.email)) {
            users.value.push({ ...result.user })
          }
        }
        return result
      }

      if (users.value.some((u) => u.email === email)) {
        return { ok: false, message: 'An account with this email already exists.' }
      }
      const user = { id: users.value.length + 1, name, email, password, role: 'user', provider: 'local' }
      users.value.push(user)
      return { ok: true, user }
    } finally {
      authBusy.value = false
    }
  }

  async function login(email, password) {
    authBusy.value = true
    try {
      // Staff marker accounts remain local so role-based A2/A3 marking is reliable.
      const local = users.value.find((u) => u.email === email && u.password === password)
      if (local) {
        const { password: _pw, ...safeUser } = local
        saveSession({ ...safeUser, provider: 'local' })
        return { ok: true, user: safeUser }
      }

      if (firebaseConfigured) {
        const result = await firebaseLogin(email, password)
        if (result.ok) saveSession(result.user)
        return result
      }

      return { ok: false, message: 'Incorrect email or password.' }
    } finally {
      authBusy.value = false
    }
  }

  async function logout() {
    if (currentUser.value?.provider === 'firebase') await firebaseLogout()
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }

  return {
    users, currentUser, isLoggedIn, isAdmin, isVolunteer,
    externalAuthAvailable, authBusy, register, login, logout
  }
})
