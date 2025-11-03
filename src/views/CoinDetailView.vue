<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router'
import { computed, ref, watch } from 'vue'
import type { CoinDetail } from '@/types'
import { getCoinById } from '@/api/coins'
import AppPreloader from '@/components/AppPreloader.vue'
import { formatPrice } from '@/utils/format'
import { useFavoritesStore } from '@/stores/favorites'
import { StarIcon } from '@heroicons/vue/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/vue/24/outline'
import type { CoinCardData } from '@/types'

const route = useRoute()
const isLoading = ref(false)
const error = ref<string | null>(null)
const coinDetail = ref<CoinDetail | null>(null)

const coinId = computed(() => (route.params.id ? String(route.params.id) : null))

const favoritesStore = useFavoritesStore()

const isFavorite = computed(() => {
  if (!coinDetail.value) return false
  return favoritesStore.isFavorite(coinDetail.value.id)
})

const toggleFavorite = () => {
  if (!coinDetail.value) return

  const coinCardData: CoinCardData = {
    id: coinDetail.value.id,
    name: coinDetail.value.name,
    symbol: coinDetail.value.symbol,
    current_price: coinDetail.value.market_data?.current_price?.usd || 0,
    price_change_percentage_24h: coinDetail.value.market_data?.price_change_percentage_24h || 0,
    image: coinDetail.value.image?.large || coinDetail.value.image?.small,
  }

  favoritesStore.toggleFavorite(coinCardData)
}

const formatLargeNumber = (num: number | undefined): string => {
  if (num === undefined || num === null) return 'N/A'
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  return `$${num.toLocaleString('en-US')}`
}

const formatSupply = (num: number | undefined): string => {
  if (num === undefined || num === null) return 'N/A'
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
  return num.toLocaleString('en-US')
}

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

const fetchCoinDetail = async () => {
  isLoading.value = true
  error.value = null

  try {
    if (!coinId.value) {
      throw new Error('Отсутствует ID монеты')
    }
    const data = await getCoinById(coinId.value)
    coinDetail.value = data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка при загрузке данных'
    console.error('Failed to fetch coin:', err)
  } finally {
    isLoading.value = false
  }
}

watch(
  coinId,
  () => {
    if (coinId.value) {
      fetchCoinDetail()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <div v-if="!coinId" class="text-center py-12">
      <h2 class="text-2xl font-bold text-crypto-red mb-4">Монета не найдена</h2>
      <p class="text-crypto-text-secondary">
        Проверьте правильность URL или вернитесь на главную страницу
      </p>
      <RouterLink
        to="/"
        class="inline-block mt-6 px-6 py-3 bg-crypto-accent text-white rounded-lg hover:opacity-90 transition-opacity"
      >
        На главную
      </RouterLink>
    </div>

    <AppPreloader v-else-if="isLoading" />

    <div v-else-if="error" class="bg-crypto-red/10 border border-crypto-red rounded-lg p-4 mb-6">
      <p class="text-crypto-red">{{ error }}</p>
      <button
        v-if="coinId"
        @click="fetchCoinDetail"
        class="mt-2 px-4 py-2 bg-crypto-accent text-white rounded-lg hover:opacity-90 transition-opacity"
      >
        Попробовать снова
      </button>
    </div>

    <div v-else-if="coinDetail" class="space-y-6">
      <div class="bg-crypto-card border border-crypto-border rounded-lg p-6">
        <div class="flex items-center gap-4 mb-6">
          <img
            v-if="coinDetail.image?.large || coinDetail.image?.small"
            :src="coinDetail.image?.large || coinDetail.image?.small"
            :alt="coinDetail.name"
            class="w-16 h-16 rounded-full"
          />
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-bold text-crypto-text">{{ coinDetail.name }}</h1>
              <button
                @click="toggleFavorite"
                class="p-2 rounded-full hover:bg-crypto-border transition-colors"
                :class="isFavorite ? 'text-yellow-500' : 'text-crypto-text-secondary'"
                :title="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'"
              >
                <StarIcon v-if="isFavorite" class="w-6 h-6" />
                <StarOutlineIcon v-else class="w-6 h-6" />
              </button>
            </div>
            <p class="text-lg text-crypto-text-secondary uppercase">{{ coinDetail.symbol }}</p>
            <p
              v-if="coinDetail.market_cap_rank || coinDetail.market_data?.market_cap_rank"
              class="text-sm text-crypto-text-secondary mt-1"
            >
              Ранг по рыночной капитализации: #{{
                coinDetail.market_cap_rank || coinDetail.market_data?.market_cap_rank
              }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap gap-6 items-baseline">
          <div>
            <p class="text-sm text-crypto-text-secondary mb-1">Текущая цена</p>
            <p class="text-3xl font-bold text-crypto-text">
              ${{ formatPrice(coinDetail.market_data?.current_price?.usd) }}
            </p>
          </div>
          <div v-if="coinDetail.market_data?.price_change_percentage_24h !== undefined">
            <p class="text-sm text-crypto-text-secondary mb-1">Изменение за 24ч</p>
            <p
              :class="
                coinDetail.market_data.price_change_percentage_24h >= 0
                  ? 'text-crypto-green'
                  : 'text-crypto-red'
              "
              class="text-2xl font-bold"
            >
              {{ coinDetail.market_data.price_change_percentage_24h >= 0 ? '+' : ''
              }}{{ coinDetail.market_data.price_change_percentage_24h.toFixed(2) }}%
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-crypto-card border border-crypto-border rounded-lg p-4">
          <p class="text-sm text-crypto-text-secondary mb-2">Рыночная капитализация</p>
          <p class="text-xl font-bold text-crypto-text">
            {{ formatLargeNumber(coinDetail.market_data?.market_cap?.usd) }}
          </p>
        </div>

        <div class="bg-crypto-card border border-crypto-border rounded-lg p-4">
          <p class="text-sm text-crypto-text-secondary mb-2">Объем торгов за 24ч</p>
          <p class="text-xl font-bold text-crypto-text">
            {{ formatLargeNumber(coinDetail.market_data?.total_volume?.usd) }}
          </p>
        </div>

        <div class="bg-crypto-card border border-crypto-border rounded-lg p-4">
          <p class="text-sm text-crypto-text-secondary mb-2">Циркулирующее предложение</p>
          <p class="text-xl font-bold text-crypto-text">
            {{ formatSupply(coinDetail.market_data?.circulating_supply) }}
          </p>
        </div>

        <div class="bg-crypto-card border border-crypto-border rounded-lg p-4">
          <p class="text-sm text-crypto-text-secondary mb-2">Максимальное предложение</p>
          <p class="text-xl font-bold text-crypto-text">
            {{
              coinDetail.market_data?.max_supply
                ? formatSupply(coinDetail.market_data.max_supply)
                : '∞'
            }}
          </p>
        </div>
      </div>

      <div
        v-if="coinDetail.market_data"
        class="bg-crypto-card border border-crypto-border rounded-lg p-6"
      >
        <h2 class="text-xl font-bold text-crypto-text mb-4">Изменения цены</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-if="coinDetail.market_data.price_change_percentage_24h !== undefined">
            <p class="text-sm text-crypto-text-secondary mb-1">За 24 часа</p>
            <p
              :class="
                coinDetail.market_data.price_change_percentage_24h >= 0
                  ? 'text-crypto-green'
                  : 'text-crypto-red'
              "
              class="text-lg font-bold"
            >
              {{ coinDetail.market_data.price_change_percentage_24h >= 0 ? '+' : ''
              }}{{ coinDetail.market_data.price_change_percentage_24h.toFixed(2) }}%
            </p>
          </div>
          <div v-if="coinDetail.market_data.price_change_percentage_7d !== undefined">
            <p class="text-sm text-crypto-text-secondary mb-1">За 7 дней</p>
            <p
              :class="
                coinDetail.market_data.price_change_percentage_7d >= 0
                  ? 'text-crypto-green'
                  : 'text-crypto-red'
              "
              class="text-lg font-bold"
            >
              {{ coinDetail.market_data.price_change_percentage_7d >= 0 ? '+' : ''
              }}{{ coinDetail.market_data.price_change_percentage_7d.toFixed(2) }}%
            </p>
          </div>
          <div v-if="coinDetail.market_data.price_change_percentage_30d !== undefined">
            <p class="text-sm text-crypto-text-secondary mb-1">За 30 дней</p>
            <p
              :class="
                coinDetail.market_data.price_change_percentage_30d >= 0
                  ? 'text-crypto-green'
                  : 'text-crypto-red'
              "
              class="text-lg font-bold"
            >
              {{ coinDetail.market_data.price_change_percentage_30d >= 0 ? '+' : ''
              }}{{ coinDetail.market_data.price_change_percentage_30d.toFixed(2) }}%
            </p>
          </div>
        </div>
      </div>

      <!-- Диапазон цен за 24 часа -->
      <div class="bg-crypto-card border border-crypto-border rounded-lg p-6">
        <h2 class="text-xl font-bold text-crypto-text mb-4">Диапазон цен за 24 часа</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-crypto-text-secondary mb-1">Максимум</p>
            <p class="text-lg font-bold text-crypto-text">
              ${{ formatPrice(coinDetail.market_data?.high_24h?.usd) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-crypto-text-secondary mb-1">Минимум</p>
            <p class="text-lg font-bold text-crypto-text">
              ${{ formatPrice(coinDetail.market_data?.low_24h?.usd) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Исторические максимумы и минимумы -->
      <div class="bg-crypto-card border border-crypto-border rounded-lg p-6">
        <h2 class="text-xl font-bold text-crypto-text mb-4">Исторические рекорды</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-if="coinDetail.market_data?.ath?.usd">
            <p class="text-sm text-crypto-text-secondary mb-1">Исторический максимум (ATH)</p>
            <p class="text-lg font-bold text-crypto-text">
              ${{ formatPrice(coinDetail.market_data.ath.usd) }}
            </p>
            <p
              v-if="coinDetail.market_data.ath_date?.usd"
              class="text-xs text-crypto-text-secondary mt-1"
            >
              {{ formatDate(coinDetail.market_data.ath_date.usd) }}
            </p>
          </div>
          <div v-if="coinDetail.market_data?.atl?.usd">
            <p class="text-sm text-crypto-text-secondary mb-1">Исторический минимум (ATL)</p>
            <p class="text-lg font-bold text-crypto-text">
              ${{ formatPrice(coinDetail.market_data.atl.usd) }}
            </p>
            <p
              v-if="coinDetail.market_data.atl_date?.usd"
              class="text-xs text-crypto-text-secondary mt-1"
            >
              {{ formatDate(coinDetail.market_data.atl_date.usd) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Описание -->
      <div
        v-if="coinDetail.description?.ru || coinDetail.description?.en"
        class="bg-crypto-card border border-crypto-border rounded-lg p-6"
      >
        <h2 class="text-xl font-bold text-crypto-text mb-4">Описание</h2>
        <div
          class="text-crypto-text-secondary prose prose-sm max-w-none"
          v-html="coinDetail.description?.ru || coinDetail.description?.en"
        ></div>
      </div>

      <!-- Ссылки -->
      <div
        v-if="coinDetail.links"
        class="bg-crypto-card border border-crypto-border rounded-lg p-6"
      >
        <h2 class="text-xl font-bold text-crypto-text mb-4">Полезные ссылки</h2>
        <div class="space-y-3">
          <div v-if="coinDetail.links.homepage && coinDetail.links.homepage.length > 0">
            <p class="text-sm font-medium text-crypto-text-secondary mb-2">Официальный сайт:</p>
            <div class="flex flex-wrap gap-2">
              <a
                v-for="link in coinDetail.links.homepage.slice(0, 3)"
                :key="link"
                :href="link"
                target="_blank"
                rel="noopener noreferrer"
                class="text-crypto-accent hover:underline text-sm break-all"
              >
                {{ link }}
              </a>
            </div>
          </div>
          <div
            v-if="coinDetail.links.blockchain_site && coinDetail.links.blockchain_site.length > 0"
          >
            <p class="text-sm font-medium text-crypto-text-secondary mb-2">Блокчейн:</p>
            <div class="flex flex-wrap gap-2">
              <a
                v-for="link in coinDetail.links.blockchain_site.slice(0, 3)"
                :key="link"
                :href="link"
                target="_blank"
                rel="noopener noreferrer"
                class="text-crypto-accent hover:underline text-sm break-all"
              >
                {{ link }}
              </a>
            </div>
          </div>
          <div
            v-if="
              coinDetail.links.repos_url?.github && coinDetail.links.repos_url.github.length > 0
            "
          >
            <p class="text-sm font-medium text-crypto-text-secondary mb-2">GitHub:</p>
            <div class="flex flex-wrap gap-2">
              <a
                v-for="link in coinDetail.links.repos_url.github.slice(0, 3)"
                :key="link"
                :href="link"
                target="_blank"
                rel="noopener noreferrer"
                class="text-crypto-accent hover:underline text-sm break-all"
              >
                {{ link }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопка возврата -->
      <div class="flex justify-center">
        <RouterLink
          to="/"
          class="inline-block px-6 py-3 bg-crypto-accent text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Вернуться на главную
        </RouterLink>
      </div>
    </div>
  </div>
</template>
