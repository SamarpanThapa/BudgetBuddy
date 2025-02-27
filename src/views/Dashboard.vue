<template>
  <div class="space-y-8">
    <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
    
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-sm font-medium text-gray-500">Total Balance</h2>
        <p class="mt-2 text-3xl font-semibold text-gray-900">$5,240.00</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-sm font-medium text-gray-500">Total Income</h2>
        <p class="mt-2 text-3xl font-semibold text-green-600">$8,350.00</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-sm font-medium text-gray-500">Total Expenses</h2>
        <p class="mt-2 text-3xl font-semibold text-red-600">$3,110.00</p>
      </div>
    </div>

    <!-- Content Placeholder -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
      <p class="text-gray-500">Your recent financial activity will appear here.</p>
    </div>
  </div>
</template>

<script setup>
// Basic setup - we'll add more functionality later
</script> 