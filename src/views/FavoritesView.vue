<script setup lang="ts">
import { ref } from 'vue'
import type { CoinCardData } from '@/types'
import CoinCard from '@/components/CoinCard.vue'

const favorites = ref<CoinCardData[]>([])
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-crypto-text mb-6">Избранное</h2>

    <div v-if="favorites.length > 0" class="grid gap-4">
      <CoinCard v-for="coin in favorites" :key="coin.id" :coin="coin" />
    </div>

    <div v-else class="text-center text-crypto-text-secondary py-12">
      <p class="text-lg">У вас пока нет избранных монет</p>
    </div>
  </div>
</template>
