import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    isDarkMode: JSON.parse(localStorage.getItem('isDarkMode')) || false,
    currency: localStorage.getItem('currency') || 'USD',
    language: localStorage.getItem('language') || 'en',
    notificationsEnabled: JSON.parse(localStorage.getItem('notificationsEnabled')) || true,
    emailNotifications: JSON.parse(localStorage.getItem('emailNotifications')) || false,
    budgetingPeriod: localStorage.getItem('budgetingPeriod') || 'biweekly',
    dateFormat: localStorage.getItem('dateFormat') || 'MM/DD/YYYY',
    theme: localStorage.getItem('theme') || 'system',
    showDecimals: JSON.parse(localStorage.getItem('showDecimals')) || true,
    currencies: [
      { code: 'USD', symbol: '$', name: 'US Dollar' },
      { code: 'EUR', symbol: '€', name: 'Euro' },
      { code: 'GBP', symbol: '£', name: 'British Pound' },
      { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
      { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
      // Add more currencies as needed
    ]
  }),

  getters: {
    currentTheme: (state) => state.theme,
    currentCurrency: (state) => state.currency,
    currencySymbol: (state) => {
      const currency = state.currencies.find(c => c.code === state.currency)
      return currency ? currency.symbol : '$'
    },
    formattedCurrency: (state) => (amount) => {
      return new Intl.NumberFormat(state.language, {
        style: 'currency',
        currency: state.currency,
        minimumFractionDigits: state.showDecimals ? 2 : 0,
        maximumFractionDigits: state.showDecimals ? 2 : 0
      }).format(amount)
    },
    formattedDate: (state) => (date) => {
      return new Intl.DateTimeFormat(state.language, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date(date))
    }
  },

  actions: {
    initializeSettings() {
      // Check system dark mode preference
      if (this.theme === 'system') {
        this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      
      // Save initial settings
      this.saveSettings()

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (this.theme === 'system') {
          this.isDarkMode = e.matches
          this.saveSettings()
        }
      })
    },

    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      this.theme = 'custom'
      this.saveSettings()
    },

    setCurrency(currency) {
      this.currency = currency
      this.saveSettings()
    },

    setLanguage(language) {
      this.language = language
      this.saveSettings()
    },

    toggleNotifications() {
      this.notificationsEnabled = !this.notificationsEnabled
      this.saveSettings()
    },

    toggleEmailNotifications() {
      this.emailNotifications = !this.emailNotifications
      this.saveSettings()
    },

    setBudgetingPeriod(period) {
      this.budgetingPeriod = period
      this.saveSettings()
    },

    setDateFormat(format) {
      this.dateFormat = format
      this.saveSettings()
    },

    setTheme(theme) {
      this.theme = theme
      if (theme === 'system') {
        this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      } else if (theme === 'dark') {
        this.isDarkMode = true
      } else {
        this.isDarkMode = false
      }
      this.saveSettings()
    },

    toggleDecimals() {
      this.showDecimals = !this.showDecimals
      this.saveSettings()
    },

    saveSettings() {
      localStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode))
      localStorage.setItem('currency', this.currency)
      localStorage.setItem('language', this.language)
      localStorage.setItem('notificationsEnabled', JSON.stringify(this.notificationsEnabled))
      localStorage.setItem('emailNotifications', JSON.stringify(this.emailNotifications))
      localStorage.setItem('budgetingPeriod', this.budgetingPeriod)
      localStorage.setItem('dateFormat', this.dateFormat)
      localStorage.setItem('theme', this.theme)
      localStorage.setItem('showDecimals', JSON.stringify(this.showDecimals))
    },

    resetSettings() {
      this.isDarkMode = false
      this.currency = 'USD'
      this.language = 'en'
      this.notificationsEnabled = true
      this.emailNotifications = false
      this.budgetingPeriod = 'biweekly'
      this.dateFormat = 'MM/DD/YYYY'
      this.theme = 'system'
      this.showDecimals = true
      this.saveSettings()
    }
  }
}) 