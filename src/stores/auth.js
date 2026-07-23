import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)

  const isLoggedIn = computed(() => currentUser.value !== null)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  function init() {
    const saved = localStorage.getItem('currentUser')
    if (saved) {
      currentUser.value = JSON.parse(saved)
    }
  }

  function getUsers() {
    const users = localStorage.getItem('users')
    return users ? JSON.parse(users) : []
  }

  function register(username, email, password, role = 'user') {
    const users = getUsers()
    const exists = users.find(u => u.email === email)
    if (exists) {
      return { success: false, message: 'Email already registered' }
    }
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: btoa(password),
      role,
      createdAt: new Date().toISOString()
    }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    return { success: true, message: 'Registration successful' }
  }

  function login(email, password) {
    const users = getUsers()
    const user = users.find(u => u.email === email && u.password === btoa(password))
    if (!user) {
      return { success: false, message: 'Invalid email or password' }
    }
    currentUser.value = { id: user.id, username: user.username, email: user.email, role: user.role }
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
    return { success: true, message: 'Login successful' }
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }

  function getAllUsers() {
    return getUsers().map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt
    }))
  }

  init()

  return { currentUser, isLoggedIn, isAdmin, register, login, logout, getAllUsers }
})