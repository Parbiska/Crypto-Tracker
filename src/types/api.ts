/**
 * Типы для работы с API
 * Параметры запросов, ответы сервера, ошибки
 */

/**
 * Параметры для запроса списка монет
 */
export interface CoinsListParams {
  vs_currency?: string
  order?: 'market_cap_desc' | 'market_cap_asc' | 'volume_desc' | 'volume_asc'
  per_page?: number
  page?: number
  sparkline?: boolean
  price_change_percentage?: string
  ids?: string
}

/**
 * Общий тип ответа API с пагинацией
 */
export interface ApiResponse<T> {
  data: T
  total?: number
  page?: number
  perPage?: number
}

/**
 * Тип ошибки API
 */
export interface ApiError {
  message: string
  status?: number
  code?: string
}

/**
 * Результат поиска монеты из CoinGecko API
 */
export interface SearchResult {
  id: string
  name: string
  symbol: string
  market_cap_rank?: number
  thumb?: string
  large?: string
}

/**
 * Ответ API поиска
 */
export interface SearchResponse {
  coins: SearchResult[]
}
