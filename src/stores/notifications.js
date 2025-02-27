import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    lastBankStatementCheck: localStorage.getItem('lastBankStatementCheck') 
      ? new Date(localStorage.getItem('lastBankStatementCheck')) 
      : null,
    bankStatementInterval: 30, // Days between bank statement checks
  }),

  actions: {
    addNotification(notification) {
      this.notifications.push({
        id: Date.now(),
        timestamp: new Date(),
        read: false,
        ...notification
      })
    },

    markAsRead(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
      }
    },

    removeNotification(notificationId) {
      this.notifications = this.notifications.filter(n => n.id !== notificationId)
    },

    checkBudgetAlerts(categoryId, spent, budget) {
      const percentage = (spent / budget) * 100
      if (percentage >= 80) {
        // Check if we already have an active alert for this category
        const existingAlert = this.notifications.find(
          n => n.type === 'budget' && 
          n.categoryId === categoryId && 
          !n.read
        )
        
        if (!existingAlert) {
          this.addNotification({
            type: 'budget',
            categoryId,
            title: 'Budget Alert',
            message: `You've spent ${percentage.toFixed(1)}% of your budget in a category`,
            severity: percentage >= 90 ? 'high' : 'medium',
          })
        }
      }
    },

    checkBankStatementReminder() {
      const today = new Date()
      const lastCheck = this.lastBankStatementCheck
      
      if (!lastCheck || daysBetween(lastCheck, today) >= this.bankStatementInterval) {
        const existingReminder = this.notifications.find(
          n => n.type === 'bankStatement' && !n.read
        )
        
        if (!existingReminder) {
          this.addNotification({
            type: 'bankStatement',
            title: 'Bank Statement Review',
            message: 'It\'s time to review your bank statements for any unnoticed charges',
            severity: 'low',
          })
        }
      }
    },

    acknowledgeStatementCheck() {
      const today = new Date()
      this.lastBankStatementCheck = today
      localStorage.setItem('lastBankStatementCheck', today.toISOString())
      
      // Remove any existing bank statement reminders
      this.notifications = this.notifications.filter(n => n.type !== 'bankStatement')
    }
  },

  getters: {
    unreadNotifications: (state) => state.notifications.filter(n => !n.read),
    sortedNotifications: (state) => [...state.notifications].sort((a, b) => b.timestamp - a.timestamp)
  }
})

function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.round(Math.abs((date1 - date2) / oneDay))
} 