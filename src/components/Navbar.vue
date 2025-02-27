<template>
  <nav 
    class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-white/10 transition-all duration-500"
    :class="{ 'shadow-2xl shadow-blue-500/5': scrolled }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and Main Nav -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <router-link to="/" class="flex items-center space-x-3 group">
              <div class="relative">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-xl opacity-40 group-hover:opacity-60 transition-all duration-500"></div>
                <div class="relative p-2 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <svg class="h-6 w-6 text-white transform transition-transform duration-500 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <span class="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-500">BudgetBuddy</span>
            </router-link>
          </div>
          
          <!-- Desktop Navigation -->
          <div class="hidden sm:ml-10 sm:flex sm:space-x-1">
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
              <component 
                :is="item.icon" 
                class="h-5 w-5 mr-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                :class="{ 'text-blue-400': $route.path === item.path }"
              />
              <span class="relative z-10">{{ item.name }}</span>
              <div 
                v-if="$route.path === item.path" 
                class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
              ></div>
            </router-link>
          </div>
        </div>

        <!-- User Menu and Notifications -->
        <div class="hidden sm:flex sm:items-center sm:space-x-2">
          <!-- Notifications -->
          <div class="relative group">
            <button 
              @click="toggleNotifications"
              class="notification-button p-2.5 text-gray-300 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group relative"
              :class="{ 'bg-white/10': isNotificationsOpen }"
            >
              <div 
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium animate-pulse"
              >
                {{ unreadCount }}
              </div>
              <svg 
                class="h-6 w-6 transform transition-transform duration-300 group-hover:scale-110" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            <!-- Notification Panel -->
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="isNotificationsOpen"
                class="notification-panel absolute right-0 mt-3 w-[320px] bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700/50 z-50 overflow-hidden transform origin-top"
              >
                <div v-if="!hasNotifications" class="p-4 text-center">
                  <p class="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                </div>

                <div v-else class="max-h-[400px] overflow-y-auto">
                  <div
                    v-for="notification in sortedNotifications"
                    :key="notification.id"
                    class="group relative border-b border-gray-200 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                    :class="{ 
                      'bg-blue-50/50 dark:bg-blue-900/10': !notification.read
                    }"
                  >
                    <div class="p-3">
                      <div class="flex items-start space-x-3">
                        <div 
                          class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                          :class="{
                            'bg-red-100 dark:bg-red-500/20': notification.severity === 'high',
                            'bg-amber-100 dark:bg-amber-500/20': notification.severity === 'medium',
                            'bg-blue-100 dark:bg-blue-500/20': notification.severity === 'low'
                          }"
                        >
                          <span 
                            class="material-icons-outlined text-base"
                            :class="{
                              'text-red-600 dark:text-red-400': notification.severity === 'high',
                              'text-amber-600 dark:text-amber-400': notification.severity === 'medium',
                              'text-blue-600 dark:text-blue-400': notification.severity === 'low'
                            }"
                          >
                            {{ getNotificationIcon(notification.type) }}
                          </span>
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="flex items-start justify-between">
                            <p class="text-sm font-medium text-gray-900 dark:text-white">
                              {{ notification.title }}
                              <span 
                                v-if="!notification.read"
                                class="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              >
                                New
                              </span>
                            </p>
                            <button
                              @click="removeNotification(notification.id)"
                              class="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                            >
                              <span class="material-icons-outlined text-sm text-gray-400 dark:text-gray-500">close</span>
                            </button>
                          </div>
                          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ notification.message }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Profile -->
          <div class="relative group">
            <button 
              @click="toggleProfile"
              class="p-2.5 text-gray-300 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
              :class="{ 'bg-white/10': isProfileOpen }"
            >
              <img 
                src="https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff" 
                class="h-8 w-8 rounded-lg border-2 border-indigo-500/50 transition-transform duration-300 group-hover:scale-105" 
              />
            </button>

            <!-- Profile Dropdown -->
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="isProfileOpen"
                class="absolute right-0 mt-3 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700/50 z-50 overflow-hidden transform origin-top profile-dropdown"
              >
                <div class="p-1">
                  <div class="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 cursor-pointer"
                       @click="() => { isProfileOpen = false; router.push('/settings') }">
                    <span class="material-icons-outlined text-sm">settings</span>
                    <span class="ml-2">settings</span>
                  </div>

                  <div class="flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all duration-200 cursor-pointer"
                       @click="handleLogout">
                    <span class="material-icons-outlined text-sm">logout</span>
                    <span class="ml-2">logout</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center sm:hidden">
          <button
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
            aria-label="Main menu"
          >
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
            @click="closeMobileMenu"
          >
            <component :is="item.icon" class="h-5 w-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
            {{ item.name }}
          </router-link>

          <!-- Mobile Profile and Logout -->
          <div class="mt-4 pt-4 border-t border-white/10">
            <div class="space-y-1 px-4">
              <div class="flex items-center w-full px-4 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer"
                   @click="() => { closeMobileMenu(); router.push('/settings') }">
                <span class="material-icons-outlined text-sm mr-3">settings</span>
                <span>settings</span>
              </div>
              <div class="flex items-center w-full px-4 py-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
                   @click="handleLogout">
                <span class="material-icons-outlined text-sm mr-3">logout</span>
                <span>logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotificationStore } from '../stores/notifications'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const mobileMenuOpen = ref(false)
const scrolled = ref(false)
const isNotificationsOpen = ref(false)
const isProfileOpen = ref(false)

// Profile menu items
const profileMenuItems = [
  { 
    name: 'View Profile', 
    path: '/profile', 
    icon: 'account_circle',
    iconColor: 'text-blue-500 dark:text-blue-400'
  },
  { 
    name: 'Settings', 
    path: '/settings', 
    icon: 'settings',
    iconColor: 'text-gray-500 dark:text-gray-400'
  },
  { 
    name: 'Help & Support', 
    path: '/help', 
    icon: 'help_outline',
    iconColor: 'text-purple-500 dark:text-purple-400'
  }
]

// Handle scroll events for navbar shadow
const handleScroll = () => {
  scrolled.value = window.scrollY > 0
}

// Toggle functions
const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value
  if (isNotificationsOpen.value) {
    isProfileOpen.value = false
  }
}

const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value
  if (isProfileOpen.value) {
    isNotificationsOpen.value = false
  }
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Close notifications and profile dropdown when clicking outside
const handleClickOutside = (event) => {
  // For notifications
  const notificationPanel = event.target.closest('.notification-panel')
  const notificationButton = event.target.closest('.notification-button')
  if (!notificationPanel && !notificationButton && isNotificationsOpen.value) {
    isNotificationsOpen.value = false
  }
  
  // For profile dropdown
  const profileButton = event.target.closest('button')
  const profileDropdown = event.target.closest('.profile-dropdown')
  if (!profileButton && !profileDropdown && isProfileOpen.value) {
    isProfileOpen.value = false
  }
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

const unreadCount = computed(() => notificationStore.unreadNotifications.length)
const hasNotifications = computed(() => notificationStore.notifications.length > 0)
const sortedNotifications = computed(() => notificationStore.sortedNotifications)

function getNotificationIcon(type) {
  const icons = {
    budget: 'account_balance_wallet',
    bankStatement: 'description',
    alert: 'warning',
    success: 'check_circle',
    info: 'info'
  }
  return icons[type] || 'notifications'
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.abs(now - date) / 36e5

  if (diffInHours < 24) {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      -Math.round(diffInHours),
      'hour'
    )
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

function removeNotification(id) {
  notificationStore.removeNotification(id)
}

function clearAllNotifications() {
  notificationStore.notifications = []
}

function acknowledgeStatement(notificationId) {
  notificationStore.acknowledgeStatementCheck()
  notificationStore.removeNotification(notificationId)
}
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

/* Custom scrollbar for light mode */
.notification-panel::-webkit-scrollbar {
  width: 6px;
}

.notification-panel::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.notification-panel::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.notification-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.15);
}

/* Custom scrollbar for dark mode */
.dark .notification-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.dark .notification-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}

.dark .notification-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Smooth transitions */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:rotate-3:hover {
  transform: rotate(3deg);
}

/* Focus styles */
.focus\:ring-2:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
}

/* Active styles */
.active\:scale-95:active {
  transform: scale(0.95);
}

/* Remove duplicate styles and keep only these essential ones */
.notification-panel {
  max-height: calc(100vh - 100px);
}

.notification-panel::-webkit-scrollbar {
  width: 6px;
}

.notification-panel::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.notification-panel::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.dark .notification-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.dark .notification-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}

@keyframes slideIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-in {
  animation: slideIn 0.2s ease-out;
}
</style> 