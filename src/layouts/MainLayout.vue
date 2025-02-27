<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <Navbar />
    <div class="pt-16"> <!-- Container for main content with padding for navbar -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <router-view v-slot="{ Component }">
          <transition
            name="page"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '../stores/settings'
import Navbar from '../components/Navbar.vue'

const settingsStore = useSettingsStore()
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Ensure content is visible */
.min-h-screen {
  min-height: 100vh;
}

/* Smooth transitions */
main {
  transition: all 0.3s ease-in-out;
}
</style> 