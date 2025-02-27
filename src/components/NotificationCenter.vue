<!-- Notification Center Component -->
<template>
  <div class="relative">
    <!-- Notification Bell Icon -->
    <button
      @click="isOpen = !isOpen"
      class="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
    >
      <span class="material-icons-outlined text-2xl">notifications</span>
      <!-- Notification Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-rose-600 rounded-full"
      >
        {{ unreadCount }}
      </span>
    </button>

    <!-- Notification Panel -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 z-50"
    >
      <div class="p-4 border-b border-gray-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
          <button
            v-if="hasNotifications"
            @click="clearAllNotifications"
            class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear all
          </button>
        </div>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div v-if="!hasNotifications" class="p-4 text-center text-gray-500 dark:text-gray-400">
          No notifications
        </div>

        <div v-else>
          <div
            v-for="notification in sortedNotifications"
            :key="notification.id"
            class="p-4 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
            :class="{ 'bg-gray-50 dark:bg-slate-700': !notification.read }"
          >
            <!-- Notification Content -->
            <div class="flex items-start gap-3">
              <!-- Icon -->
              <div class="flex-shrink-0">
                <span
                  class="material-icons-outlined text-2xl"
                  :class="{
                    'text-rose-600': notification.severity === 'high',
                    'text-amber-600': notification.severity === 'medium',
                    'text-blue-600': notification.severity === 'low'
                  }"
                >
                  {{ getNotificationIcon(notification.type) }}
                </span>
              </div>

              <!-- Content -->
              <div class="flex-1">
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ notification.title }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ notification.message }}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {{ formatTimestamp(notification.timestamp) }}
                </p>

                <!-- Action Buttons -->
                <div v-if="notification.type === 'bankStatement'" class="mt-2">
                  <button
                    @click="acknowledgeStatement(notification.id)"
                    class="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Mark as Reviewed
                  </button>
                </div>
              </div>

              <!-- Close Button -->
              <button
                @click="removeNotification(notification.id)"
                class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <span class="material-icons-outlined text-lg">close</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '../stores/notifications'
import { useExpenseStore } from '../stores/expenses'
import { useBudgetStore } from '../stores/budget'

const notificationStore = useNotificationStore()
const expenseStore = useExpenseStore()
const budgetStore = useBudgetStore()

const isOpen = ref(false)

// Close notifications when clicking outside
const handleClickOutside = (event) => {
  const notificationCenter = event.target.closest('.notification-center')
  if (!notificationCenter) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Initial checks
  checkBudgets()
  notificationStore.checkBankStatementReminder()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Computed properties
const unreadCount = computed(() => notificationStore.unreadNotifications.length)
const hasNotifications = computed(() => notificationStore.notifications.length > 0)
const sortedNotifications = computed(() => notificationStore.sortedNotifications)

// Methods
function getNotificationIcon(type) {
  switch (type) {
    case 'budget':
      return 'account_balance_wallet'
    case 'bankStatement':
      return 'description'
    default:
      return 'notifications'
  }
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleString()
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

// Check all budget categories for potential alerts
function checkBudgets() {
  const budget = budgetStore.currentBiweeklyBudget
  if (!budget) return

  budget.categories.forEach(category => {
    const spent = expenseStore.expenses
      ?.filter(e => e.categoryId === category.id)
      .reduce((sum, e) => sum + Math.abs(e.amount), 0) || 0
    
    notificationStore.checkBudgetAlerts(category.id, spent, category.amount)
  })
}

// Set up periodic checks
const checkInterval = setInterval(() => {
  checkBudgets()
  notificationStore.checkBankStatementReminder()
}, 1800000) // Check every 30 minutes

onUnmounted(() => {
  clearInterval(checkInterval)
})
</script>

<style scoped>
.notification-center {
  position: relative;
}
</style> 