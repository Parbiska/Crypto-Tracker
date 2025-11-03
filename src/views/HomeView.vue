<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CoinCardData, Coin } from '@/types'
import CoinCard from '@/components/CoinCard.vue'
import { getCoinsList } from '@/api/index'

const coins = ref<CoinCardData[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const rowsToShow = ref(20)

const fetchCoins = async () => {
  isLoading.value = true
  error.value = null

  try {
    const data = await getCoinsList({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: rowsToShow.value,
      page: 1,
      sparkline: false,
    })

    coins.value = data.map((coin: Coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      image: coin.image,
    }))
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка при загрузке данных'
    console.error('Failed to fetch coins:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCoins()
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-crypto-text mb-6">Топ криптовалют</h2>

    <div class="grid gap-4">
      <CoinCard v-for="coin in coins" :key="coin.id" :coin="coin" />
    </div>
  </div>
</template>
