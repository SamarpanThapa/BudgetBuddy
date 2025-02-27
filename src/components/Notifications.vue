<template>
  <div class="relative">
    <!-- Notification Bell -->
    <button
      @click="toggleNotifications"
      class="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
    >
      <span class="sr-only">View notifications</span>
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <span
        v-if="unreadCount > 0"
        class="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white"
      >
        {{ unreadCount }}
      </span>
    </button>

    <!-- Notifications Panel -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showNotifications"
        class="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50"
        @click.stop
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Notifications</h3>
            <button
              v-if="notifications.length > 0"
              @click="clearAll"
              class="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>

          <div class="space-y-4 max-h-96 overflow-y-auto">
            <TransitionGroup name="list">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="flex items-start space-x-4 p-3 rounded-lg"
                :class="[
                  notification.read ? 'bg-gray-50' : 'bg-white',
                  getNotificationBgClass(notification.type)
                ]"
              >
                <!-- Notification Icon -->
                <div class="flex-shrink-0">
                  <span
                    class="inline-flex items-center justify-center h-8 w-8 rounded-full"
                    :class="getNotificationIconClass(notification.type)"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        :d="getNotificationIcon(notification.type)"
                      />
                    </svg>
                  </span>
                </div>

                <!-- Notification Content -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">
                    {{ notification.title }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ notification.message }}
                  </p>
                  <p class="mt-1 text-xs text-gray-400">
                    {{ formatDate(notification.timestamp) }}
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="flex-shrink-0 flex items-center space-x-2">
                  <button
                    v-if="!notification.read"
                    @click="markAsRead(notification)"
                    class="text-gray-400 hover:text-blue-600 transition-colors duration-150"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                  <button
                    @click="deleteNotification(notification)"
                    class="text-gray-400 hover:text-red-600 transition-colors duration-150"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </TransitionGroup>

            <!-- Empty State -->
            <div
              v-if="notifications.length === 0"
              class="text-center py-12"
            >
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
              <p class="mt-1 text-sm text-gray-500">
                You're all caught up!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useBudgetStore } from '../stores/budget'

const store = useBudgetStore()
const showNotifications = ref(false)

const notifications = computed(() => store.notifications)
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const markAsRead = (notification) => {
  store.markNotificationAsRead(notification.id)
}

const deleteNotification = (notification) => {
  store.deleteNotification(notification.id)
}

const clearAll = () => {
  store.clearNotifications()
}

const getNotificationIcon = (type) => {
  switch (type) {
    case 'warning':
      return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    case 'danger':
      return 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    case 'success':
      return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
}

const getNotificationIconClass = (type) => {
  switch (type) {
    case 'warning':
      return 'bg-yellow-100 text-yellow-600'
    case 'danger':
      return 'bg-red-100 text-red-600'
    case 'success':
      return 'bg-green-100 text-green-600'
    default:
      return 'bg-blue-100 text-blue-600'
  }
}

const getNotificationBgClass = (type) => {
  switch (type) {
    case 'warning':
      return 'hover:bg-yellow-50'
    case 'danger':
      return 'hover:bg-red-50'
    case 'success':
      return 'hover:bg-green-50'
    default:
      return 'hover:bg-blue-50'
  }
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) { // less than 1 minute
    return 'Just now'
  } else if (diff < 3600000) { // less than 1 hour
    const minutes = Math.floor(diff / 60000)
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  } else if (diff < 86400000) { // less than 1 day
    const hours = Math.floor(diff / 3600000)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  } else if (diff < 604800000) { // less than 1 week
    const days = Math.floor(diff / 86400000)
    return `${days} day${days === 1 ? '' : 's'} ago`
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
}

// Click outside to close
const handleClickOutside = (event) => {
  if (showNotifications.value && !event.target.closest('.notifications-panel')) {
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.notifications-panel {
  max-height: calc(100vh - 100px);
}
</style> 