import { defineStore } from 'pinia'

export const useExpenseStore = defineStore('expenses', {
  state: () => ({
    expenses: JSON.parse(localStorage.getItem('expenses')) || [],
    recurringExpenses: JSON.parse(localStorage.getItem('recurringExpenses')) || [],
    categories: [
      { id: 1, name: 'Transport', icon: '🚗', color: '#3B82F6' },
      { id: 2, name: 'Groceries', icon: '🛒', color: '#10B981' },
      { id: 3, name: 'Loans', icon: '💰', color: '#F59E0B' },
      { id: 4, name: 'Entertainment', icon: '🎮', color: '#8B5CF6' },
      { id: 5, name: 'Utilities', icon: '💡', color: '#EF4444' },
      { id: 6, name: 'Healthcare', icon: '🏥', color: '#EC4899' },
      { id: 7, name: 'Shopping', icon: '🛍️', color: '#6366F1' },
      { id: 8, name: 'Food', icon: '🍽️', color: '#14B8A6' }
    ],
    customCategories: JSON.parse(localStorage.getItem('customCategories')) || [],
  }),

  actions: {
    addExpense(expense) {
      const newExpense = {
        ...expense,
        id: Date.now(),
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
      this.expenses.push(newExpense)
      this.saveToLocalStorage()
      return newExpense
    },

    updateExpense(expenseId, updatedData) {
      const index = this.expenses.findIndex(e => e.id === expenseId)
      if (index !== -1) {
        this.expenses[index] = { ...this.expenses[index], ...updatedData }
        this.saveToLocalStorage()
        return true
      }
      return false
    },

    addRecurringExpense(recurringExpense) {
      const newRecurringExpense = {
        ...recurringExpense,
        id: Date.now(),
        startDate: new Date().toISOString(),
        lastProcessed: new Date().toISOString()
      }
      this.recurringExpenses.push(newRecurringExpense)
      this.saveToLocalStorage()
      return newRecurringExpense
    },

    updateRecurringExpense(expenseId, updatedData) {
      const index = this.recurringExpenses.findIndex(e => e.id === expenseId)
      if (index !== -1) {
        this.recurringExpenses[index] = { ...this.recurringExpenses[index], ...updatedData }
        this.saveToLocalStorage()
        return true
      }
      return false
    },

    removeExpense(expenseId) {
      this.expenses = this.expenses.filter(expense => expense.id !== expenseId)
      this.saveToLocalStorage()
    },

    removeRecurringExpense(expenseId) {
      this.recurringExpenses = this.recurringExpenses.filter(expense => expense.id !== expenseId)
      this.saveToLocalStorage()
    },

    addCategory(category) {
      const newCategory = {
        ...category,
        id: Math.max(...[...this.categories, ...this.customCategories].map(c => c.id), 0) + 1
      }
      this.customCategories.push(newCategory)
      this.saveToLocalStorage()
      return newCategory
    },

    removeCategory(categoryId) {
      this.customCategories = this.customCategories.filter(category => category.id !== categoryId)
      this.saveToLocalStorage()
    },

    processRecurringExpenses() {
      const now = new Date()
      this.recurringExpenses.forEach(recurring => {
        const lastProcessed = new Date(recurring.lastProcessed)
        const daysSinceLastProcessed = Math.floor((now - lastProcessed) / (1000 * 60 * 60 * 24))

        if (recurring.frequency === 'daily' && daysSinceLastProcessed >= 1) {
          this.addExpense({
            amount: recurring.amount,
            categoryId: recurring.categoryId,
            description: recurring.description,
            isRecurring: true,
            recurringId: recurring.id
          })
          this.updateRecurringExpense(recurring.id, { lastProcessed: now.toISOString() })
        } else if (recurring.frequency === 'weekly' && daysSinceLastProcessed >= 7) {
          this.addExpense({
            amount: recurring.amount,
            categoryId: recurring.categoryId,
            description: recurring.description,
            isRecurring: true,
            recurringId: recurring.id
          })
          this.updateRecurringExpense(recurring.id, { lastProcessed: now.toISOString() })
        } else if (recurring.frequency === 'monthly' && daysSinceLastProcessed >= 30) {
          this.addExpense({
            amount: recurring.amount,
            categoryId: recurring.categoryId,
            description: recurring.description,
            isRecurring: true,
            recurringId: recurring.id
          })
          this.updateRecurringExpense(recurring.id, { lastProcessed: now.toISOString() })
        }
      })
    },

    saveToLocalStorage() {
      localStorage.setItem('expenses', JSON.stringify(this.expenses))
      localStorage.setItem('recurringExpenses', JSON.stringify(this.recurringExpenses))
      localStorage.setItem('customCategories', JSON.stringify(this.customCategories))
    },

    clearAllData() {
      this.expenses = []
      this.recurringExpenses = []
      this.customCategories = []
      this.saveToLocalStorage()
    }
  },

  getters: {
    allCategories: (state) => [...state.categories, ...state.customCategories],
    
    monthlyExpenses: (state) => {
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      return state.expenses.filter(expense => {
        const expenseDate = new Date(expense.date)
        return expenseDate >= firstDayOfMonth && expenseDate <= lastDayOfMonth
      })
    },

    expensesByCategory: (state) => {
      return state.allCategories.map(category => ({
        ...category,
        total: state.expenses
          .filter(expense => expense.categoryId === category.id)
          .reduce((sum, expense) => sum + expense.amount, 0)
      }))
    },

    weeklyExpenses: (state) => {
      const now = new Date()
      const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
      firstDayOfWeek.setHours(0, 0, 0, 0)
      const lastDayOfWeek = new Date(firstDayOfWeek)
      lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6)
      lastDayOfWeek.setHours(23, 59, 59, 999)

      return state.expenses.filter(expense => {
        const expenseDate = new Date(expense.date)
        return expenseDate >= firstDayOfWeek && expenseDate <= lastDayOfWeek
      })
    },

    totalExpenses: (state) => {
      return state.expenses.reduce((total, expense) => total + expense.amount, 0)
    },

    getExpensesByDateRange: (state) => (startDate, endDate) => {
      return state.expenses.filter(expense => {
        const expenseDate = new Date(expense.date)
        return expenseDate >= startDate && expenseDate <= endDate
      })
    }
  }
}) 