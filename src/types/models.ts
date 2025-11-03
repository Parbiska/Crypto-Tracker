/**
 * Основные модели данных криптовалют
 * Соответствуют структуре данных из CoinGecko API
 */

/**
 * Основная информация о криптовалюте
 */
export interface Coin {
  id: string
  symbol: string
  name: string
  image?: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  market_cap_rank?: number
  total_volume: number
  high_24h: number
  low_24h: number
  circulating_supply?: number
  total_supply?: number
  max_supply?: number
  ath?: number
  ath_date?: string
  atl?: number
  atl_date?: string
  last_updated?: string
}

/**
 * Детальная информация о монете для страницы CoinDetail
 */
export interface CoinDetail extends Coin {
  description?: {
    en?: string
    ru?: string
  }
  links?: {
    homepage?: string[]
    blockchain_site?: string[]
    official_forum_url?: string[]
    subreddit_url?: string
    repos_url?: {
      github?: string[]
    }
  }
  market_data?: {
    current_price?: Record<string, number>
    market_cap?: Record<string, number>
    price_change_24h?: number
    price_change_percentage_24h?: number
    price_change_percentage_7d?: number
    price_change_percentage_30d?: number
  }
}
