import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'light',
    currency: localStorage.getItem('currency') || 'USD',
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
    isDarkMode: (state) => state.theme === 'dark',
    currentCurrency: (state) => state.currency,
    currencySymbol: (state) => {
      const currency = state.currencies.find(c => c.code === state.currency)
      return currency ? currency.symbol : '$'
    }
  },

  actions: {
    setTheme(newTheme) {
      this.theme = newTheme
      localStorage.setItem('theme', newTheme)
      
      // Update DOM
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    setCurrency(newCurrency) {
      this.currency = newCurrency
      localStorage.setItem('currency', newCurrency)
    },

    initializeSettings() {
      // Apply theme on app load
      const savedTheme = localStorage.getItem('theme') || 'light'
      this.setTheme(savedTheme)
    }
  }
}) 