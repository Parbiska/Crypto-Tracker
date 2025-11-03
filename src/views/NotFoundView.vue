<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <ExclamationTriangleIcon class="w-32 h-32 text-crypto-red mb-6" />

    <h1 class="text-6xl font-bold text-crypto-text mb-4">404</h1>

    <h2 class="text-2xl font-semibold text-crypto-text mb-2">Страница не найдена</h2>

    <p class="text-crypto-text-secondary max-w-md mb-8">
      К сожалению, запрашиваемая страница не существует. Возможно, она была удалена или вы ввели
      неправильный адрес.
    </p>

    <div class="flex gap-4">
      <RouterLink
        to="/"
        class="px-6 py-3 bg-crypto-accent text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
      >
        На главную
      </RouterLink>

      <RouterLink
        to="/favorites"
        class="px-6 py-3 bg-crypto-card border border-crypto-border text-crypto-text rounded-lg hover:border-crypto-accent transition-colors font-medium"
      >
        Избранное
      </RouterLink>
    </div>
  </div>
</template>
