import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')

  const setUser = (userData) => {
    user.value = userData
    isAuthenticated.value = true
    localStorage.setItem('isAuthenticated', 'true')
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('isAuthenticated')
  }

  return {
    user,
    isAuthenticated,
    setUser,
    logout
  }
}) 