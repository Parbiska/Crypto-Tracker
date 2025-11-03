<script setup lang="ts">
import { ref } from 'vue'
import type { CoinCardData } from '@/types'
import CoinCard from '@/components/CoinCard.vue'

const coins = ref<CoinCardData[]>([
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 45000, change24h: 2.5 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3200, change24h: -1.2 },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.52, change24h: 3.8 },
])
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-crypto-text mb-6">
      Топ криптовалют
    </h2>

    <div class="grid gap-4">
      <CoinCard 
        v-for="coin in coins" 
        :key="coin.id"
        :coin="coin"
      />
    </div>
  </div>
</template>

