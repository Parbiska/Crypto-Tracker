<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { MagnifyingGlassIcon, StarIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const isSearchExpanded = ref(false)

watch(
  () => route.query.q,
  (newQuery) => {
    const query = typeof newQuery === 'string' ? newQuery : ''
    searchQuery.value = query
  },
  { immediate: true }
)

const handleSearch = (e?: Event) => {
  if (e) {
    e.preventDefault()
  }
  const query = searchQuery.value.trim()
  if (query) {
    router.push({
      name: 'search',
      query: { q: query },
    })
  }
}

const toggleSearch = () => {
  isSearchExpanded.value = !isSearchExpanded.value
  if (!isSearchExpanded.value) {
    searchQuery.value = ''
  }
}

const emptySearchQuery = () => {
  searchQuery.value = ''
}
</script>

<template>
  <header class="bg-crypto-card border-b border-crypto-border sticky top-0 z-50">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <RouterLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span class="text-2xl">💎</span>
          <h1 class="text-xl font-bold text-crypto-accent">CryptoTracker</h1>
        </RouterLink>

        <div class="flex items-center gap-2">
          <form
            @submit.prevent="handleSearch"
            class="hidden md:flex items-center relative"
          >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск криптовалют..."
              @keyup.enter="handleSearch"
              class="w-64 px-4 py-2 pr-10 bg-crypto-bg border border-crypto-border rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-accent focus:border-transparent"
            />
            <button
              type="submit"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-crypto-text-secondary hover:text-crypto-accent transition-colors cursor-pointer"
            >
              <MagnifyingGlassIcon class="w-5 h-5" />
            </button>
          </form>

          <button
            @click="toggleSearch"
            class="md:hidden bg-crypto-accent text-white p-2 rounded-full hover:opacity-90 transition-opacity"
          >
            <MagnifyingGlassIcon class="w-5 h-5" />
          </button>

          <RouterLink
            to="/favorites"
            class="bg-crypto-accent text-white p-2 rounded-full hover:opacity-90 transition-opacity"
          >
            <StarIcon class="w-5 h-5" />
          </RouterLink>
        </div>
      </div>

      <form
        v-if="isSearchExpanded"
        @submit.prevent="handleSearch"
        class="md:hidden flex items-center gap-2 mt-3 w-full"
      >
        <div class="flex-1 relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск криптовалют..."
            @keyup.enter="handleSearch"
            class="w-full px-4 py-2 pl-10 pr-12 bg-crypto-bg border border-crypto-border rounded-lg focus:outline-none focus:ring-2 focus:ring-crypto-accent focus:border-transparent"
            autofocus
          />
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-crypto-text-secondary pointer-events-none" />
          <button
            type="submit"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-crypto-text-secondary hover:text-crypto-accent transition-colors"
          >
            <MagnifyingGlassIcon class="w-5 h-5" />
          </button>
        </div>
        <button
          type="button"
          @click="emptySearchQuery"
          class="bg-crypto-card border border-crypto-border text-crypto-text p-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </form>
    </div>
  </header>
</template>
