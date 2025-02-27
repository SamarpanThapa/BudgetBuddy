<template>
  <nav 
    class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-b border-white/10 transition-all duration-300 shadow-lg"
    :class="{ 'shadow-2xl': scrolled }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and Main Nav -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <router-link to="/" class="flex items-center space-x-3 group">
              <div class="relative">
                <div class="absolute inset-0 bg-blue-600 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div class="relative p-2 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <svg class="h-6 w-6 text-white transform transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <span class="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">BudgetBuddy</span>
            </router-link>
          </div>
          
          <!-- Desktop Navigation -->
          <div class="hidden sm:ml-10 sm:flex sm:space-x-4">
            <router-link
              v-for="item in navigationItems"
              :key="item.path"
              :to="item.path"
              class="group flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 relative overflow-hidden"
              :class="[
                $route.path === item.path
                  ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              ]"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <component :is="item.icon" class="h-5 w-5 mr-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
              <span class="relative z-10">{{ item.name }}</span>
              <div v-if="$route.path === item.path" class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </router-link>
          </div>
        </div>

        <!-- User Menu and Logout -->
        <div class="hidden sm:flex sm:items-center sm:space-x-4">
          <!-- Notifications -->
          <div class="relative group">
            <button class="p-2 text-gray-300 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group">
              <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</div>
              <svg class="h-5 w-5 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>

          <!-- Profile -->
          <div class="relative group">
            <button class="flex items-center space-x-3 p-2 text-gray-300 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
              <img src="https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff" class="h-8 w-8 rounded-full border-2 border-indigo-500/50" />
              <span class="text-sm font-medium">John Doe</span>
              <svg class="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <!-- Logout Button -->
          <button
            @click="handleLogout"
            class="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300 group"
          >
            <svg class="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center sm:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="h-6 w-6 transition-transform duration-500"
              :class="{ 'scale-90 rotate-180 opacity-0': mobileMenuOpen, 'scale-100 rotate-0 opacity-100': !mobileMenuOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              class="absolute h-6 w-6 transition-transform duration-500"
              :class="{ 'scale-100 rotate-0 opacity-100': mobileMenuOpen, 'scale-90 -rotate-180 opacity-0': !mobileMenuOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div v-if="mobileMenuOpen" class="sm:hidden bg-slate-800/95 backdrop-blur-xl">
        <div class="pt-2 pb-3 space-y-1 px-4">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 group"
            :class="[
              $route.path === item.path
                ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            ]"
            @click="mobileMenuOpen = false"
          >
            <component :is="item.icon" class="h-5 w-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
            {{ item.name }}
          </router-link>

          <!-- Mobile Profile and Logout -->
          <div class="mt-4 pt-4 border-t border-white/10">
            <div class="flex items-center px-4 py-3 mb-3 rounded-lg bg-white/5">
              <img src="https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff" class="h-10 w-10 rounded-full border-2 border-indigo-500/50 mr-3" />
              <div>
                <div class="text-white font-medium">John Doe</div>
                <div class="text-gray-400 text-sm">john@example.com</div>
              </div>
            </div>
            <button class="flex items-center w-full px-4 py-3 text-base font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300 group">
              <svg class="h-5 w-5 mr-3 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
            <button
              @click="handleLogout"
              class="flex items-center w-full px-4 py-3 text-base font-medium text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-all duration-300 group"
            >
              <svg class="h-5 w-5 mr-3 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)
const scrolled = ref(false)

// Handle scroll events for navbar shadow
const handleScroll = () => {
  scrolled.value = window.scrollY > 0
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Navigation icons components
const DashboardIcon = {
  template: `
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  `
}

const BudgetIcon = {
  template: `
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

const TransactionsIcon = {
  template: `
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  `
}

const ReportsIcon = {
  template: `
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  `
}

const SettingsIcon = {
  template: `
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  `
}

const navigationItems = [
  { name: 'Dashboard', path: '/', icon: DashboardIcon },
  { name: 'Budget', path: '/budget', icon: BudgetIcon },
  { name: 'Transactions', path: '/transactions', icon: TransactionsIcon },
  { name: 'Reports', path: '/reports', icon: ReportsIcon },
  { name: 'Settings', path: '/settings', icon: SettingsIcon }
]
</script>

<style scoped>
/* Smooth scroll behavior for the whole page */
html {
  scroll-behavior: smooth;
}

/* Custom animations */
@keyframes glow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

.glow-effect {
  animation: glow 2s ease-in-out infinite;
}

/* Gradient animation */
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 6s ease infinite;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style> 