<script setup lang="ts">
import { computed } from 'vue'
import type { CoinCardData } from '@/types'
import { RouterLink } from 'vue-router'
import { formatPrice } from '@/utils/format'
import { useFavoritesStore } from '@/stores/favorites'
import { StarIcon } from '@heroicons/vue/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/vue/24/outline'

interface Props {
  coin: CoinCardData
}

const props = defineProps<Props>()
const favoritesStore = useFavoritesStore()

const isFavorite = computed(() => favoritesStore.isFavorite(props.coin.id))

const handleToggleFavorite = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  favoritesStore.toggleFavorite(props.coin)
}
</script>

<template>
  <RouterLink
    :to="`/coin/${coin.id}`"
    class="block bg-crypto-card border border-crypto-border rounded-lg p-4 hover:shadow-md hover:border-crypto-accent transition-all cursor-pointer"
  >
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-3">
        <img v-if="coin.image" :src="coin.image" :alt="coin.name" class="w-10 h-10 rounded-full" />
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-crypto-text">{{ coin.name }}</h3>
            <button
              @click="handleToggleFavorite"
              class="p-1 rounded-full hover:bg-crypto-border transition-colors"
              :class="isFavorite ? 'text-yellow-500' : 'text-crypto-text-secondary'"
              :title="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'"
            >
              <StarIcon v-if="isFavorite" class="w-4 h-4" />
              <StarOutlineIcon v-else class="w-4 h-4" />
            </button>
          </div>
          <span class="text-sm text-crypto-text-secondary">{{ coin.symbol.toUpperCase() }}</span>
        </div>
      </div>

      <div class="text-right">
        <p class="font-bold text-crypto-text">${{ formatPrice(Number(coin.current_price)) }}</p>
        <p
          :class="coin.price_change_percentage_24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'"
          class="text-sm font-medium"
        >
          {{ coin.price_change_percentage_24h >= 0 ? '+' : ''
          }}{{ coin.price_change_percentage_24h }}%
        </p>
      </div>
    </div>
  </RouterLink>
</template>
