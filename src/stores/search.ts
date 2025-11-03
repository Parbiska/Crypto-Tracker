/**
 * Store для управления поиском криптовалют
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { searchCoins } from '@/api/index'
import type { SearchResult } from '@/types'
import type { CoinCardData, Coin } from '@/types'

export const useSearchStore = defineStore('search', () => {
  const searchQuery = ref('')
  const searchResults = ref<SearchResult[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const hasSearchQuery = computed(() => searchQuery.value.trim().length > 0)
  const hasResults = computed(() => searchResults.value.length > 0)

  const performSearch = async (query: string) => {
    console.log('performSearch called with:', query)
    searchQuery.value = query

    if (!query.trim()) {
      searchResults.value = []
      error.value = null
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const results = await searchCoins(query)
      console.log('Search results received:', results)
      searchResults.value = results
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка при поиске'
      searchResults.value = []
      console.error('Failed to search coins:', err)
    } finally {
      isLoading.value = false
    }
  }

  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    error.value = null
  }

  /**
   * Получает данные монет из результатов поиска для отображения
   * Загружает цены только для найденных монет используя параметр ids
   */
  const getSearchResultsAsCoinCards = async (): Promise<CoinCardData[]> => {
    if (searchResults.value.length === 0) {
      console.log('getSearchResultsAsCoinCards: no search results')
      return []
    }

    try {
      // Получаем ID найденных монет (ограничиваем 20 для производительности)
      const coinIds = searchResults.value
        .slice(0, 20)
        .map(result => result.id)
        .join(',')

      console.log('getSearchResultsAsCoinCards: coinIds:', coinIds)

      const { getCoinsList } = await import('@/api/index')
      const coinsData = await getCoinsList({
        vs_currency: 'usd',
        order: 'market_cap_desc',
        ids: coinIds,
        sparkline: false,
      })

      console.log('getSearchResultsAsCoinCards: coinsData received:', coinsData)

      // Преобразуем в формат CoinCardData
      const result = coinsData.map((coin: Coin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        image: coin.image,
      }))

      console.log('getSearchResultsAsCoinCards: returning:', result)
      return result
    } catch (err) {
      console.error('Failed to get coin data for search results:', err)
      return []
    }
  }

  return {
    searchQuery,
    searchResults,
    isLoading,
    error,
    hasSearchQuery,
    hasResults,
    performSearch,
    clearSearch,
    getSearchResultsAsCoinCards,
  }
})
