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

