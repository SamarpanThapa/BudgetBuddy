import { defineStore } from 'pinia'

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    transactions: [],
    recurringTransactions: [],
    events: [],
    budgets: {
      income: 0,
      expenses: 0,
      savings: 0,
      period: 'monthly',
      categories: {} // Category-specific budgets
    },
    categories: [
      'Housing',
      'Transportation',
      'Food',
      'Utilities',
      'Insurance',
      'Healthcare',
      'Entertainment',
      'Shopping',
      'Loans',
      'Subscriptions',
      'Events',
      'Other'
    ],
    notifications: [],
    budgetAlertThreshold: 0.8,
    savingsGoal: 0,
    customCategories: [], // User-defined categories
    tags: [], // Transaction tags for better organization
    filters: {
      dateRange: null,
      categories: [],
      tags: [],
      amountRange: { min: null, max: null },
      searchTerm: ''
    }
  }),
  
  getters: {
    totalIncome: (state) => {
      const regularIncome = state.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const recurringIncome = state.recurringTransactions
        .filter(t => t.type === 'income' && t.isActive)
        .reduce((sum, t) => sum + t.amount, 0)
      
      return regularIncome + recurringIncome
    },

    totalExpenses: (state) => {
      const regularExpenses = state.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const recurringExpenses = state.recurringTransactions
        .filter(t => t.type === 'expense' && t.isActive)
        .reduce((sum, t) => sum + t.amount, 0)
      
      const eventExpenses = state.events
        .reduce((sum, event) => sum + event.spent, 0)
      
      return regularExpenses + recurringExpenses + eventExpenses
    },

    balance: (state) => {
      return state.totalIncome - state.totalExpenses
    },

    expensesByCategory: (state) => {
      const categorySums = {}
      
      // Regular transactions
      state.transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
          categorySums[t.category] = (categorySums[t.category] || 0) + t.amount
        })
      
      // Recurring transactions
      state.recurringTransactions
        .filter(t => t.type === 'expense' && t.isActive)
        .forEach(t => {
          categorySums[t.category] = (categorySums[t.category] || 0) + t.amount
        })
      
      // Event expenses
      state.events.forEach(event => {
        categorySums['Events'] = (categorySums['Events'] || 0) + event.spent
      })
      
      return [...state.categories, ...state.customCategories].map(category => ({
        category,
        amount: categorySums[category] || 0,
        budget: state.budgets.categories[category] || 0,
        percentage: state.budgets.categories[category] 
          ? (categorySums[category] || 0) / state.budgets.categories[category] * 100 
          : 0
      }))
    },

    filteredTransactions: (state) => {
      let filtered = [...state.transactions]

      // Date range filter
      if (state.filters.dateRange) {
        const { start, end } = state.filters.dateRange
        filtered = filtered.filter(t => {
          const date = new Date(t.date)
          return date >= start && date <= end
        })
      }

      // Categories filter
      if (state.filters.categories.length > 0) {
        filtered = filtered.filter(t => state.filters.categories.includes(t.category))
      }

      // Tags filter
      if (state.filters.tags.length > 0) {
        filtered = filtered.filter(t => t.tags?.some(tag => state.filters.tags.includes(tag)))
      }

      // Amount range filter
      if (state.filters.amountRange.min !== null) {
        filtered = filtered.filter(t => t.amount >= state.filters.amountRange.min)
      }
      if (state.filters.amountRange.max !== null) {
        filtered = filtered.filter(t => t.amount <= state.filters.amountRange.max)
      }

      // Search term
      if (state.filters.searchTerm) {
        const term = state.filters.searchTerm.toLowerCase()
        filtered = filtered.filter(t => 
          t.description.toLowerCase().includes(term) ||
          t.category.toLowerCase().includes(term) ||
          t.tags?.some(tag => tag.toLowerCase().includes(term))
        )
      }

      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    },

    upcomingRecurring: (state) => {
      const today = new Date()
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      return state.recurringTransactions
        .filter(t => t.isActive && new Date(t.nextDueDate) <= nextWeek)
        .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate))
    },

    activeEvents: (state) => {
      const today = new Date()
      return state.events
        .filter(event => new Date(event.endDate) >= today)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    },

    savingsProgress: (state) => {
      const currentSavings = state.totalIncome - state.totalExpenses
      const percentage = state.savingsGoal ? (currentSavings / state.savingsGoal) * 100 : 0
      return {
        current: currentSavings,
        goal: state.savingsGoal,
        percentage,
        remaining: state.savingsGoal - currentSavings
      }
    },

    monthlySpendingTrend: (state) => {
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        return date.toISOString().slice(0, 7) // YYYY-MM format
      }).reverse()

      return last6Months.map(month => {
        const expenses = state.transactions
          .filter(t => 
            t.type === 'expense' && 
            t.date.startsWith(month)
          )
          .reduce((sum, t) => sum + t.amount, 0)

        return {
          month,
          amount: expenses
        }
      })
    },

    budgetStatus: (state) => {
      const spent = state.totalExpenses
      const budget = state.budgets.expenses
      const percentage = budget > 0 ? (spent / budget) * 100 : 0
      
      return {
        spent,
        budget,
        percentage,
        isNearLimit: percentage >= (state.budgetAlertThreshold * 100),
        remaining: budget - spent,
        categoryStatus: state.expensesByCategory
          .filter(cat => cat.budget > 0)
          .map(cat => ({
            ...cat,
            isOverBudget: cat.amount > cat.budget,
            remainingBudget: cat.budget - cat.amount
          }))
      }
    }
  },
  
  actions: {
    addTransaction(transaction) {
      const newTransaction = {
        id: Date.now(),
        date: new Date().toISOString(),
        tags: [],
        notes: '',
        ...transaction
      }
      
      this.transactions.push(newTransaction)
      this.checkBudgetStatus()
      
      // Add notification for large transactions
      if (transaction.amount > 1000) {
        this.addNotification({
          type: 'info',
          title: 'Large Transaction',
          message: `A ${transaction.type} of ${formatCurrency(transaction.amount)} was added.`
        })
      }
    },

    addRecurringTransaction(transaction) {
      this.recurringTransactions.push({
        id: Date.now(),
        startDate: new Date().toISOString(),
        isActive: true,
        tags: [],
        notes: '',
        ...transaction
      })
    },

    updateRecurringTransaction(id, updates) {
      const index = this.recurringTransactions.findIndex(t => t.id === id)
      if (index !== -1) {
        this.recurringTransactions[index] = {
          ...this.recurringTransactions[index],
          ...updates
        }
      }
    },

    addEvent(event) {
      this.events.push({
        id: Date.now(),
        spent: 0,
        transactions: [],
        tags: [],
        notes: '',
        ...event
      })
    },

    updateEvent(id, updates) {
      const index = this.events.findIndex(e => e.id === id)
      if (index !== -1) {
        this.events[index] = {
          ...this.events[index],
          ...updates
        }
      }
    },

    addEventTransaction(eventId, transaction) {
      const event = this.events.find(e => e.id === eventId)
      if (event) {
        const newTransaction = {
          id: Date.now(),
          date: new Date().toISOString(),
          tags: [],
          notes: '',
          ...transaction
        }
        
        event.transactions.push(newTransaction)
        event.spent += transaction.amount
        
        // Check if event is over budget
        if (event.spent > event.budget) {
          this.addNotification({
            type: 'warning',
            title: 'Event Budget Alert',
            message: `${event.name} has exceeded its budget of ${formatCurrency(event.budget)}`
          })
        }
        
        this.checkBudgetStatus()
      }
    },

    updateBudget(budgetData) {
      this.budgets = { 
        ...this.budgets, 
        ...budgetData,
        categories: {
          ...this.budgets.categories,
          ...(budgetData.categories || {})
        }
      }
      this.checkBudgetStatus()
    },

    setSavingsGoal(amount) {
      this.savingsGoal = amount
      this.checkSavingsProgress()
    },

    addCustomCategory(category) {
      if (!this.categories.includes(category) && !this.customCategories.includes(category)) {
        this.customCategories.push(category)
      }
    },

    addTag(tag) {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag)
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    deleteTransaction(transactionId) {
      const index = this.transactions.findIndex(t => t.id === transactionId)
      if (index !== -1) {
        this.transactions.splice(index, 1)
        this.checkBudgetStatus()
      }
    },

    checkBudgetStatus() {
      const { percentage, isNearLimit, remaining, categoryStatus } = this.budgetStatus
      
      // Clear old budget alerts
      this.notifications = this.notifications.filter(n => !n.type.includes('budget'))
      
      // Overall budget alert
      if (isNearLimit) {
        this.addNotification({
          type: 'budget-alert',
          title: 'Budget Alert',
          message: `You've used ${percentage.toFixed(1)}% of your budget. ${remaining > 0 ? `${formatCurrency(remaining)} remaining.` : 'Budget exceeded!'}`
        })
      }
      
      // Category-specific alerts
      categoryStatus
        .filter(cat => cat.isOverBudget)
        .forEach(cat => {
          this.addNotification({
            type: 'budget-category-alert',
            title: `${cat.category} Budget Alert`,
            message: `${cat.category} expenses have exceeded the budget by ${formatCurrency(Math.abs(cat.remainingBudget))}`
          })
        })
    },

    checkSavingsProgress() {
      const { percentage, remaining } = this.savingsProgress
      
      if (percentage >= 100) {
        this.addNotification({
          type: 'success',
          title: 'Savings Goal Achieved! 🎉',
          message: `Congratulations! You've reached your savings goal of ${formatCurrency(this.savingsGoal)}`
        })
      } else if (percentage >= 90) {
        this.addNotification({
          type: 'info',
          title: 'Almost There!',
          message: `You're close to your savings goal! Only ${formatCurrency(remaining)} to go.`
        })
      }
    },

    addNotification(notification) {
      this.notifications.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
        ...notification
      })
    },

    markNotificationAsRead(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
      }
    },

    deleteNotification(notificationId) {
      const index = this.notifications.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        this.notifications.splice(index, 1)
      }
    },

    clearAllNotifications() {
      this.notifications = []
    }
  }
})

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
} 