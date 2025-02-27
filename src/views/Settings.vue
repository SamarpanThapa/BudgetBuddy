<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8 text-gray-800 dark:text-white">Settings</h1>
    
    <!-- Theme Settings -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Theme Preferences</h2>
      <div class="flex space-x-4">
        <button
          @click="handleThemeChange('light')"
          class="flex-1 p-4 rounded-lg border-2 transition-all duration-300"
          :class="[
            !settingsStore.isDarkMode
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-200'
          ]"
        >
          <div class="flex items-center justify-center mb-3">
            <svg class="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="text-center">
            <div class="font-medium text-gray-900 dark:text-white">Light Mode</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Bright and clear interface</div>
          </div>
        </button>

        <button
          @click="handleThemeChange('dark')"
          class="flex-1 p-4 rounded-lg border-2 transition-all duration-300"
          :class="[
            settingsStore.isDarkMode
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-200'
          ]"
        >
          <div class="flex items-center justify-center mb-3">
            <svg class="w-8 h-8 text-gray-900 dark:text-gray-100" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </div>
          <div class="text-center">
            <div class="font-medium text-gray-900 dark:text-white">Dark Mode</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Easy on the eyes</div>
          </div>
        </button>
      </div>
    </div>

    <!-- Currency Settings -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Currency Preferences</h2>
      <div class="max-w-md">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select your preferred currency
        </label>
        <select
          v-model="settingsStore.currency"
          @change="settingsStore.setCurrency($event.target.value)"
          class="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-300"
        >
          <option
            v-for="currency in settingsStore.currencies"
            :key="currency.code"
            :value="currency.code"
          >
            {{ currency.name }} ({{ currency.symbol }})
          </option>
        </select>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          This will be used to display all monetary values across the application
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()

const handleThemeChange = (theme) => {
  settingsStore.setTheme(theme)
}
</script>

<style scoped>
/* Theme transition */
:root {
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

/* Button transitions */
button {
  transition: all 0.3s ease-in-out;
}

button:hover {
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}
</style> 