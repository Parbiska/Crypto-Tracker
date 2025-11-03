/**
 * API методы для работы с криптовалютами
 * Использует CoinGecko API
 */

import { get } from './client'
import type { Coin, CoinDetail, CoinsListParams } from '@/types'

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
    },
  })
}

/**
 * Получает детальную информацию о конкретной монете
 */
export async function getCoinById(id: string): Promise<CoinDetail> {
  return get<CoinDetail>(`/coins/${id}`)
}

