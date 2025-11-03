<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { MagnifyingGlassIcon, StarIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <header class="bg-crypto-card border-b border-crypto-border sticky top-0 z-50">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <RouterLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span class="text-2xl">💎</span>
          <h1 class="text-xl font-bold text-crypto-accent">CryptoTracker</h1>
        </RouterLink>

        <div class="flex items-center gap-2">
          <button
            class="bg-crypto-accent text-white p-2 rounded-full hover:opacity-90 transition-opacity"
          >
            <MagnifyingGlassIcon class="w-5 h-5" />
          </button>

          <RouterLink
            to="/favorites"
            class="bg-crypto-accent text-white p-2 rounded-full hover:opacity-90 transition-opacity"
          >
            <StarIcon class="w-5 h-5" />
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>
