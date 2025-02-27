<template>
  <div class="space-y-8">
    <h1 class="text-2xl font-semibold text-gray-900">Transactions</h1>
    
    <!-- Transaction Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-sm font-medium text-gray-500">Recent Income</h2>
        <p class="mt-2 text-3xl font-semibold text-green-600">$3,250.00</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-sm font-medium text-gray-500">Recent Expenses</h2>
        <p class="mt-2 text-3xl font-semibold text-red-600">$1,840.00</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-sm font-medium text-gray-500">Net Balance</h2>
        <p class="mt-2 text-3xl font-semibold text-gray-900">$1,410.00</p>
      </div>
    </div>

    <!-- Transaction List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h2>
        <p class="text-gray-500">Your transactions will appear here.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Basic setup - we'll add more functionality later
</script> 