import { computed } from 'vue'
import { useSettingsStore } from '../stores/settings'

export function useCurrency() {
  const settingsStore = useSettingsStore()

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: settingsStore.currency
    })
    return formatter.format(amount)
  }

  const currencySymbol = computed(() => {
    const currency = settingsStore.currencies.find(c => c.code === settingsStore.currency)
    return currency ? currency.symbol : '$'
  })

  return {
    formatCurrency,
    currencySymbol
  }
} 