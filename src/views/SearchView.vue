<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { CoinCardData } from '@/types'
import CoinCard from '@/components/CoinCard.vue'
import AppPreloader from '@/components/AppPreloader.vue'
import { useSearchStore } from '@/stores/search'

const route = useRoute()
const searchStore = useSearchStore()

const coins = ref<CoinCardData[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const searchQuery = computed(() => {
  const query = typeof route.query.q === 'string' ? route.query.q : ''
  return query.trim()
})

const displayedLoading = computed(() => isLoading.value || searchStore.isLoading)
const displayedError = computed(() => error.value || searchStore.error)

const fetchSearchResults = async (query: string) => {
  if (!query) {
    coins.value = []
    return
  }

  isLoading.value = true
  error.value = null

  try {
    await searchStore.performSearch(query)

    const results = await searchStore.getSearchResultsAsCoinCards()
    coins.value = results
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка при загрузке результатов поиска'
    console.error('Failed to fetch search results:', err)
    coins.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (searchQuery.value) {
    fetchSearchResults(searchQuery.value)
  }
})

watch(
  () => route.query.q,
  async newQuery => {
    const query = typeof newQuery === 'string' ? newQuery.trim() : ''
    if (query) {
      await fetchSearchResults(query)
    } else {
      coins.value = []
    }
  }
)

watch(
  () => searchStore.searchResults,
  async newResults => {
    if (searchStore.hasSearchQuery && newResults.length > 0) {
      const results = await searchStore.getSearchResultsAsCoinCards()
      coins.value = results
    }
  },
  { deep: true }
)
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-crypto-text mb-6">
      {{ searchQuery ? `Результаты поиска: "${searchQuery}"` : 'Поиск криптовалют' }}
    </h2>

    <div
      v-if="!searchQuery"
      class="bg-crypto-card border border-crypto-border rounded-lg p-8 text-center"
    >
      <p class="text-crypto-text-secondary text-lg">Введите запрос для поиска</p>
      <p class="text-crypto-text-secondary mt-2">Используйте поиск в шапке сайта</p>
    </div>

    <AppPreloader v-else-if="displayedLoading" />

    <div
      v-else-if="displayedError"
      class="bg-crypto-red/10 border border-crypto-red rounded-lg p-4 mb-6"
    >
      <p class="text-crypto-red">{{ displayedError }}</p>
      <button
        @click="fetchSearchResults(searchQuery)"
        class="mt-2 px-4 py-2 bg-crypto-accent text-white rounded-lg hover:opacity-90 transition-opacity"
      >
        Попробовать снова
      </button>
    </div>

    <template v-else>
      <div
        v-if="coins.length === 0"
        class="bg-crypto-card border border-crypto-border rounded-lg p-8 text-center"
      >
        <p class="text-crypto-text-secondary text-lg">Ничего не найдено</p>
        <p class="text-crypto-text-secondary mt-2">Попробуйте изменить поисковый запрос</p>
      </div>

      <div v-else class="grid gap-4 mb-6">
        <CoinCard v-for="coin in coins" :key="coin.id" :coin="coin" />
      </div>
    </template>
  </div>
</template>
