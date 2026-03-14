export type Currency = 'USD' | 'ZAR' | 'EUR' | 'GBP' | 'KES' | 'NGN' | 'GHS' | 'TZS' | 'UGX' | 'BWP' | 'MZN' | 'ZMW'

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

let defaultCurrency: Currency = 'ZAR'

export const setDefaultCurrency = (currency: Currency): void => {
  defaultCurrency = currency
  if (typeof window !== 'undefined') {
    localStorage.setItem('fieldvibe_currency', currency)
  }
}

export const getDefaultCurrency = (): Currency => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('fieldvibe_currency') as Currency
    if (stored && CURRENCY_CONFIG[stored]) {
      defaultCurrency = stored
    }
  }
  return defaultCurrency
}

export function formatCurrency(
  amount: number | string | null | undefined,
  currencyOrOptions?: string | { compact?: boolean; showSymbol?: boolean; showCode?: boolean },
  options?: { compact?: boolean; showSymbol?: boolean; showCode?: boolean }
): string {
  let numAmount: number
  if (amount === null || amount === undefined) {
    numAmount = 0
  } else if (typeof amount === 'string') {
    numAmount = parseFloat(amount) || 0
  } else if (isNaN(amount)) {
    numAmount = 0
  } else {
    numAmount = amount
  }

  let currencyCode: string
  let opts: { compact?: boolean; showSymbol?: boolean; showCode?: boolean }

  if (typeof currencyOrOptions === 'string') {
    currencyCode = currencyOrOptions
    opts = options || {}
  } else if (typeof currencyOrOptions === 'object' && currencyOrOptions !== null) {
    currencyCode = getDefaultCurrency()
    opts = currencyOrOptions
  } else {
    currencyCode = getDefaultCurrency()
    opts = {}
  }

  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.ZAR
  const { compact = false, showSymbol = true } = opts

  if (compact) {
    if (Math.abs(numAmount) >= 1000000) {
      return `${showSymbol ? config.symbol : ''}${(numAmount / 1000000).toFixed(1)}M`
    }
    if (Math.abs(numAmount) >= 1000) {
      return `${showSymbol ? config.symbol : ''}${(numAmount / 1000).toFixed(1)}K`
    }
  }

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    }).format(numAmount)
  } catch {
    return `${config.symbol}${numAmount.toFixed(config.decimals)}`
  }
}

export function getCurrencySymbol(currencyCode = 'ZAR'): string {
  return CURRENCY_CONFIG[currencyCode]?.symbol || currencyCode
}

export function getSupportedCurrencies(): string[] {
  return Object.keys(CURRENCY_CONFIG)
}

// Initialize default currency from localStorage on module load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('fieldvibe_currency') as Currency
  if (stored && CURRENCY_CONFIG[stored]) {
    defaultCurrency = stored
  }
}
