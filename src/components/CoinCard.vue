<script setup lang="ts">
import type { CoinCardData } from '@/types'
import { RouterLink } from 'vue-router'

interface Props {
  coin: CoinCardData
}

defineProps<Props>()

const formatPrice = (price: number) => {
  if (price < 1) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    })
  }

  return price.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
  })
}
</script>

<template>
  <RouterLink 
    :to="`/coin/${coin.id}`"
    class="block bg-crypto-card border border-crypto-border rounded-lg p-4 hover:shadow-md hover:border-crypto-accent transition-all cursor-pointer"
  >
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-3">
        <img 
          v-if="coin.image" 
          :src="coin.image" 
          :alt="coin.name"
          class="w-10 h-10 rounded-full"
        />
        <div>
          <h3 class="font-bold text-crypto-text">{{ coin.name }}</h3>
          <span class="text-sm text-crypto-text-secondary">{{ coin.symbol }}</span>
        </div>
      </div>
      
      <div class="text-right">
        <p class="font-bold text-crypto-text">${{ formatPrice(coin.price) }}</p>
        <p 
          :class="coin.change24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'"
          class="text-sm font-medium"
        >
          {{ coin.change24h >= 0 ? '+' : '' }}{{ coin.change24h }}%
        </p>
      </div>
    </div>
  </RouterLink>
</template>

