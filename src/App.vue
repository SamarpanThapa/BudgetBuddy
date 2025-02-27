<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useSettingsStore } from './stores/settings'
import { useExpenseStore } from './stores/expenses'
import { useBudgetStore } from './stores/budget'

const settingsStore = useSettingsStore()
const expenseStore = useExpenseStore()
const budgetStore = useBudgetStore()

onMounted(() => {
  settingsStore.initializeSettings()
  expenseStore.initializeStore()
  budgetStore.checkBudgetAlerts()
})
</script>

<template>
  <div :class="{ 'dark': settingsStore.isDarkMode }" class="min-h-screen">
    <div class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <main class="pt-16">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary: #f9fafb;
  --text-primary: #111827;
}

.dark {
  --bg-primary: #0f172a;
  --text-primary: #f9fafb;
  color-scheme: dark;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

/* Smooth transitions */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Custom scrollbar for dark mode */
.dark ::-webkit-scrollbar {
  width: 8px;
}

.dark ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

#app {
  min-height: 100vh;
}

.form-select {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
}
</style>
