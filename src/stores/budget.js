import { defineStore } from 'pinia'
import { useExpenseStore } from './expenses'

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    budgets: JSON.parse(localStorage.getItem('budgets')) || [],
    eventBudgets: JSON.parse(localStorage.getItem('eventBudgets')) || [],
    recurringIncome: JSON.parse(localStorage.getItem('recurringIncome')) || [],
    income: JSON.parse(localStorage.getItem('income')) || [],
    monthlyIncome: JSON.parse(localStorage.getItem('monthlyIncome')) || 0,
    savingsGoal: JSON.parse(localStorage.getItem('savingsGoal')) || 0,
    alerts: JSON.parse(localStorage.getItem('budgetAlerts')) || [],
    alertThreshold: JSON.parse(localStorage.getItem('alertThreshold')) || 80, // percentage
  }),

  actions: {
    setBiweeklyBudget(amount, startDate, categories = []) {
      const newBudget = {
        id: Date.now(),
        amount,
        startDate,
        type: 'biweekly',
        categories,
        spent: 0,
        createdAt: new Date().toISOString()
      }
      this.budgets.push(newBudget)
      this.saveToLocalStorage()
      return newBudget
    },

    addEventBudget(event) {
      const newEventBudget = {
        ...event,
        id: Date.now(),
        spent: 0,
        createdAt: new Date().toISOString()
      }
      this.eventBudgets.push(newEventBudget)
      this.saveToLocalStorage()
      return newEventBudget
    },

    updateEventBudget(eventId, updatedData) {
      const index = this.eventBudgets.findIndex(e => e.id === eventId)
      if (index !== -1) {
        this.eventBudgets[index] = { ...this.eventBudgets[index], ...updatedData }
        this.saveToLocalStorage()
        return true
      }
      return false
    },

    removeEventBudget(eventId) {
      this.eventBudgets = this.eventBudgets.filter(event => event.id !== eventId)
      this.saveToLocalStorage()
    },

    addRecurringIncome(income) {
      const newIncome = {
        ...income,
        id: Date.now(),
        startDate: new Date().toISOString(),
        lastProcessed: new Date().toISOString()
      }
      this.recurringIncome.push(newIncome)
      this.updateMonthlyIncome()
      this.saveToLocalStorage()
      return newIncome
    },

    removeRecurringIncome(incomeId) {
      this.recurringIncome = this.recurringIncome.filter(income => income.id !== incomeId)
      this.updateMonthlyIncome()
      this.saveToLocalStorage()
    },

    updateRecurringIncome(incomeId, updatedData) {
      const index = this.recurringIncome.findIndex(i => i.id === incomeId)
      if (index !== -1) {
        this.recurringIncome[index] = { ...this.recurringIncome[index], ...updatedData }
        this.updateMonthlyIncome()
        this.saveToLocalStorage()
        return true
      }
      return false
    },

    setSavingsGoal(amount) {
      this.savingsGoal = amount
      this.saveToLocalStorage()
    },

    setAlertThreshold(percentage) {
      this.alertThreshold = percentage
      this.saveToLocalStorage()
    },

    addAlert(alert) {
      const newAlert = {
        ...alert,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        read: false
      }
      this.alerts.push(newAlert)
      this.saveToLocalStorage()
      return newAlert
    },

    markAlertAsRead(alertId) {
      const alert = this.alerts.find(a => a.id === alertId)
      if (alert) {
        alert.read = true
        this.saveToLocalStorage()
      }
    },

    clearAlerts() {
      this.alerts = []
      this.saveToLocalStorage()
    },

    updateMonthlyIncome() {
      let total = 0
      this.recurringIncome.forEach(income => {
        switch (income.frequency) {
          case 'weekly':
            total += income.amount * 4
            break
          case 'biweekly':
            total += income.amount * 2
            break
          case 'monthly':
            total += income.amount
            break
          case 'yearly':
            total += income.amount / 12
            break
        }
      })
      this.monthlyIncome = total
      this.saveToLocalStorage()
    },

    checkBudgetAlerts() {
      const expenseStore = useExpenseStore()
      
      // Check biweekly budget
      const currentBudget = this.currentBiweeklyBudget
      if (currentBudget) {
        const spentPercentage = (currentBudget.spent / currentBudget.amount) * 100
        if (spentPercentage >= this.alertThreshold && !this.hasAlertForBudget(currentBudget.id)) {
          this.addAlert({
            type: 'budget',
            budgetId: currentBudget.id,
            message: `You've spent ${spentPercentage.toFixed(1)}% of your biweekly budget`,
            severity: spentPercentage >= 100 ? 'high' : 'medium'
          })
        }
      }

      // Check event budgets
      this.eventBudgets.forEach(event => {
        const spentPercentage = (event.spent / event.budget) * 100
        if (spentPercentage >= this.alertThreshold && !this.hasAlertForEvent(event.id)) {
          this.addAlert({
            type: 'event',
            eventId: event.id,
            message: `You've spent ${spentPercentage.toFixed(1)}% of your budget for ${event.name}`,
            severity: spentPercentage >= 100 ? 'high' : 'medium'
          })
        }
      })

      // Check monthly spending vs income
      const monthlyExpenses = expenseStore.monthlyExpenses.reduce((total, exp) => total + exp.amount, 0)
      const spendingPercentage = (monthlyExpenses / this.monthlyIncome) * 100
      if (spendingPercentage >= this.alertThreshold && !this.hasAlertForMonthlySpending()) {
        this.addAlert({
          type: 'monthly',
          message: `You've spent ${spendingPercentage.toFixed(1)}% of your monthly income`,
          severity: spendingPercentage >= 100 ? 'high' : 'medium'
        })
      }
    },

    hasAlertForBudget(budgetId) {
      return this.alerts.some(alert => 
        alert.type === 'budget' && 
        alert.budgetId === budgetId && 
        !alert.read
      )
    },

    hasAlertForEvent(eventId) {
      return this.alerts.some(alert => 
        alert.type === 'event' && 
        alert.eventId === eventId && 
        !alert.read
      )
    },

    hasAlertForMonthlySpending() {
      return this.alerts.some(alert => 
        alert.type === 'monthly' && 
        !alert.read
      )
    },

    saveToLocalStorage() {
      localStorage.setItem('budgets', JSON.stringify(this.budgets))
      localStorage.setItem('eventBudgets', JSON.stringify(this.eventBudgets))
      localStorage.setItem('recurringIncome', JSON.stringify(this.recurringIncome))
      localStorage.setItem('income', JSON.stringify(this.income))
      localStorage.setItem('monthlyIncome', JSON.stringify(this.monthlyIncome))
      localStorage.setItem('savingsGoal', JSON.stringify(this.savingsGoal))
      localStorage.setItem('budgetAlerts', JSON.stringify(this.alerts))
      localStorage.setItem('alertThreshold', JSON.stringify(this.alertThreshold))
    },

    clearAllData() {
      this.budgets = []
      this.eventBudgets = []
      this.recurringIncome = []
      this.income = []
      this.monthlyIncome = 0
      this.savingsGoal = 0
      this.alerts = []
      this.saveToLocalStorage()
    },

    addIncome(income) {
      try {
        const newIncome = {
          ...income,
          id: Date.now(),
          date: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
        this.income.push(newIncome)
        this.updateMonthlyIncome()
        this.saveToLocalStorage()
        return newIncome
      } catch (error) {
        console.error('Error adding income:', error)
        return null
      }
    },

    updateIncome(incomeId, updatedData) {
      try {
        const index = this.income.findIndex(i => i.id === incomeId)
        if (index !== -1) {
          this.income[index] = { ...this.income[index], ...updatedData }
          this.updateMonthlyIncome()
          this.saveToLocalStorage()
          return true
        }
        return false
      } catch (error) {
        console.error('Error updating income:', error)
        return false
      }
    },

    removeIncome(incomeId) {
      try {
        this.income = this.income.filter(i => i.id !== incomeId)
        this.updateMonthlyIncome()
        this.saveToLocalStorage()
        return true
      } catch (error) {
        console.error('Error removing income:', error)
        return false
      }
    }
  },

  getters: {
    currentBiweeklyBudget: (state) => {
      try {
        const now = new Date()
        return state.budgets
          .filter(budget => budget.type === 'biweekly')
          .find(budget => {
            const startDate = new Date(budget.startDate)
            const endDate = new Date(startDate)
            endDate.setDate(endDate.getDate() + 14)
            return now >= startDate && now <= endDate
          })
      } catch (error) {
        console.error('Error getting current biweekly budget:', error)
        return null
      }
    },

    activeEventBudgets: (state) => {
      try {
        const now = new Date()
        return state.eventBudgets.filter(event => {
          const endDate = new Date(event.endDate)
          return endDate >= now
        })
      } catch (error) {
        console.error('Error getting active event budgets:', error)
        return []
      }
    },

    upcomingEventBudgets: (state) => {
      const now = new Date()
      return state.eventBudgets.filter(event => {
        const startDate = new Date(event.startDate)
        return startDate > now
      })
    },

    completedEventBudgets: (state) => {
      const now = new Date()
      return state.eventBudgets.filter(event => {
        const endDate = new Date(event.endDate)
        return endDate < now
      })
    },

    monthlyBudgetProgress: (state) => {
      const expenseStore = useExpenseStore()
      const monthlyExpenses = expenseStore.monthlyExpenses.reduce((total, exp) => total + exp.amount, 0)
      return {
        spent: monthlyExpenses,
        remaining: state.monthlyIncome - monthlyExpenses,
        percentage: state.monthlyIncome ? (monthlyExpenses / state.monthlyIncome) * 100 : 0
      }
    },

    savingsProgress: (state) => {
      const expenseStore = useExpenseStore()
      const totalSaved = state.monthlyIncome - expenseStore.totalExpenses
      return {
        saved: totalSaved,
        goal: state.savingsGoal,
        percentage: state.savingsGoal ? (totalSaved / state.savingsGoal) * 100 : 0
      }
    },

    unreadAlerts: (state) => {
      return state.alerts.filter(alert => !alert.read)
    },

    totalMonthlyIncome: (state) => {
      try {
        return parseFloat(state.monthlyIncome.toFixed(2)) || 0
      } catch (error) {
        console.error('Error getting total monthly income:', error)
        return 0
      }
    },

    recentIncome: (state) => {
      try {
        return state.income
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
      } catch (error) {
        console.error('Error getting recent income:', error)
        return []
      }
    },

    monthlyIncomeTransactions: (state) => {
      try {
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        
        return state.income.filter(income => {
          const incomeDate = new Date(income.date)
          return incomeDate >= firstDayOfMonth && incomeDate <= lastDayOfMonth
        })
      } catch (error) {
        console.error('Error getting monthly income transactions:', error)
        return []
      }
    }
  }
}) 