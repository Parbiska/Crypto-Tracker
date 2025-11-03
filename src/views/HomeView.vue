<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import type { CoinCardData, Coin } from '@/types'
import CoinCard from '@/components/CoinCard.vue'
import Preloader from '@/components/Preloader.vue'
import { getCoinsList } from '@/api/index'

const coins = ref<CoinCardData[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const currentPage = ref(1)
const perPage = ref(20)
const totalPages = ref(1)

const fetchCoins = async (page: number = currentPage.value) => {
  isLoading.value = true
  error.value = null

  try {
    const data = await getCoinsList({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: perPage.value,
      page: page,
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

    // CoinGecko API не возвращает total, поэтому используем эвристику
    // Если вернулось меньше чем perPage, значит это последняя страница
    if (data.length < perPage.value) {
      totalPages.value = page
    } else {
      totalPages.value = page + 1
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка при загрузке данных'
    console.error('Failed to fetch coins:', err)
  } finally {
    isLoading.value = false
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const pages = computed(() => {
  const pagesList: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pagesList.push(i)
    }
  } else {
    pagesList.push(1)

    if (current > 3) {
      pagesList.push('...')
    }

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      pagesList.push(i)
    }

    if (current < total - 2) {
      pagesList.push('...')
    }

    pagesList.push(total)
  }

  return pagesList
})

watchEffect(() => {
  fetchCoins(currentPage.value)
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-crypto-text mb-6">Топ криптовалют</h2>
    <Preloader v-if="isLoading" />

    <div v-else-if="error" class="bg-crypto-red/10 border border-crypto-red rounded-lg p-4 mb-6">
      <p class="text-crypto-red">{{ error }}</p>
      <button
        @click="fetchCoins()"
        class="mt-2 px-4 py-2 bg-crypto-accent text-white rounded-lg hover:opacity-90 transition-opacity"
      >
        Попробовать снова
      </button>
    </div>

    <template v-else>
      <div class="grid gap-4 mb-6">
        <CoinCard v-for="coin in coins" :key="coin.id" :coin="coin" />
      </div>

      <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1 || isLoading"
          class="px-4 py-2 bg-crypto-card border border-crypto-border rounded-lg hover:border-crypto-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Назад
        </button>

        <button
          v-for="page in pages"
          :key="page"
          @click="typeof page === 'number' && goToPage(page)"
          :disabled="typeof page === 'string' || isLoading"
          :class="[
            'px-4 py-2 rounded-lg transition-colors',
            page === currentPage
              ? 'bg-crypto-accent text-white'
              : 'bg-crypto-card border border-crypto-border hover:border-crypto-accent',
            typeof page === 'string' && 'cursor-default',
            (typeof page === 'string' || isLoading) && 'opacity-50 cursor-not-allowed',
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages || isLoading"
          class="px-4 py-2 bg-crypto-card border border-crypto-border rounded-lg hover:border-crypto-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Вперед
        </button>
      </div>
    </template>
  </div>
</template>
