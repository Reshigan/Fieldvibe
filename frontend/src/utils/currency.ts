const CURRENCY_CONFIG: Record<string, { symbol: string; locale: string; decimals: number }> = {
  ZAR: { symbol: 'R', locale: 'en-ZA', decimals: 2 },
  USD: { symbol: '$', locale: 'en-US', decimals: 2 },
  EUR: { symbol: '€', locale: 'de-DE', decimals: 2 },
  GBP: { symbol: '£', locale: 'en-GB', decimals: 2 },
  KES: { symbol: 'KSh', locale: 'en-KE', decimals: 2 },
  NGN: { symbol: '₦', locale: 'en-NG', decimals: 2 },
  GHS: { symbol: 'GH₵', locale: 'en-GH', decimals: 2 },
  TZS: { symbol: 'TSh', locale: 'en-TZ', decimals: 0 },
  UGX: { symbol: 'USh', locale: 'en-UG', decimals: 0 },
  BWP: { symbol: 'P', locale: 'en-BW', decimals: 2 },
  MZN: { symbol: 'MT', locale: 'pt-MZ', decimals: 2 },
  ZMW: { symbol: 'ZK', locale: 'en-ZM', decimals: 2 },
}

export function formatCurrency(amount: number, currencyCode = 'ZAR'): string {
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.ZAR
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    }).format(amount)
  } catch {
    return `${config.symbol}${amount.toFixed(config.decimals)}`
  }
}

export function getCurrencySymbol(currencyCode = 'ZAR'): string {
  return CURRENCY_CONFIG[currencyCode]?.symbol || currencyCode
}

export function getSupportedCurrencies(): string[] {
  return Object.keys(CURRENCY_CONFIG)
}
