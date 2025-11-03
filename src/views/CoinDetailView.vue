<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const coinId = computed(() => (route.params.id ? String(route.params.id) : null))
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

    <div v-else>
      <h2 class="text-2xl font-bold text-crypto-text mb-6">Детали монеты: {{ coinId }}</h2>

      <div class="bg-crypto-card border border-crypto-border rounded-lg p-6">
        <p class="text-crypto-text-secondary">Здесь будет подробная информация о криптовалюте</p>
      </div>
    </div>
  </div>
</template>
