/**
 * Утилиты для форматирования данных
 */

/**
 * Форматирует цену в читаемый вид
 * @param price - цена для форматирования
 * @returns отформатированная строка цены
 */
export const formatPrice = (price: number | undefined): string => {
  if (price === undefined || price === null) return 'N/A'
  if (price <= 1) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    })
  }
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

/**
 * Форматирует изменение цены в процентах
 * @param change - изменение цены в процентах
 * @returns отформатированная строка с знаком и округлением до 1 знака после запятой
 */
export const formatPriceChange = (change: number | undefined): string => {
  if (change === undefined || change === null) return 'N/A'
  const rounded = change.toFixed(1)
  const sign = change >= 0 ? '+' : ''
  return `${sign}${rounded}%`
}
