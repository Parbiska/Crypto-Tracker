/**
 * API методы для работы с криптовалютами
 * Использует CoinGecko API
 */

import { get } from './client'
import type { Coin, CoinDetail, CoinsListParams, SearchResult, SearchResponse } from '@/types'

/**
 * Получает список криптовалют с рынков
 */
export async function getCoinsList(params: CoinsListParams = {}): Promise<Coin[]> {
  return get<Coin[]>('/coins/markets', {
    params: {
      vs_currency: params.vs_currency || 'usd',
      order: params.order || 'market_cap_desc',
      per_page: params.per_page,
      page: params.page,
      sparkline: params.sparkline,
      price_change_percentage: params.price_change_percentage,
      ids: params.ids,
    },
  })
}

/**
 * Получает детальную информацию о конкретной монете
 */
export async function getCoinById(id: string): Promise<CoinDetail> {
  return get<CoinDetail>(`/coins/${id}`)
}

/**
 * Поиск криптовалют по запросу
 */
export async function searchCoins(query: string): Promise<SearchResult[]> {
  if (!query.trim()) {
    return []
  }

  try {
    const response = await get<SearchResponse>('/search', {
      params: {
        query: query.trim(),
      },
    })

    return response.coins || []
  } catch (error) {
    console.error('Search API error:', error)
    throw error
  }
}
