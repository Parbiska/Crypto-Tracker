/**
 * Store для управления избранными монетами
 * Сохраняет данные в localStorage
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CoinCardData } from '@/types'

const STORAGE_KEY = 'crypto-tracker-favorites'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<CoinCardData[]>([])

  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        favorites.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Ошибка при загрузке избранного:', error)
      favorites.value = []
    }
  }

  const saveFavorites = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
    } catch (error) {
      console.error('Ошибка при сохранении избранного:', error)
    }
  }

  const isFavorite = (coinId: string): boolean => {
    return favorites.value.some(coin => coin.id === coinId)
  }

  const addFavorite = (coin: CoinCardData) => {
    if (!isFavorite(coin.id)) {
      favorites.value.push(coin)
      saveFavorites()
    }
  }

  const removeFavorite = (coinId: string) => {
    favorites.value = favorites.value.filter(coin => coin.id !== coinId)
    saveFavorites()
  }

  const toggleFavorite = (coin: CoinCardData) => {
    if (isFavorite(coin.id)) {
      removeFavorite(coin.id)
    } else {
      addFavorite(coin)
    }
  }

  loadFavorites()

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  }
})
