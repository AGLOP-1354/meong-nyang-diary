export function formatCurrency(value: number, currency: string = 'KRW') {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value)
}

export function formatDate(date: Date | string | number, locale = 'ko-KR') {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  if (digits.length === 11) return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')

  return phone
}

export function truncate(text: string, max = 100, suffix = '…') {
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + suffix
}
