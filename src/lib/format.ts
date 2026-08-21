export function formatPrice(n: number): string {
  return `${n.toLocaleString('ru-RU')} ₽`
}

export function formatNumber(n: number): string {
  return n.toLocaleString('ru-RU')
}

/** plural(3, ['предложение', 'предложения', 'предложений']) */
export function plural(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return forms[2]
  if (last > 1 && last < 5) return forms[1]
  if (last === 1) return forms[0]
  return forms[2]
}

export const currentMonthYear = new Intl.DateTimeFormat('ru-RU', {
  month: 'long',
  year: 'numeric',
}).format(new Date())

export function verdictByDelta(deltaPct: number): { text: string; good: boolean } {
  if (deltaPct <= -3) return { text: `Сейчас дешевле средней на ${Math.abs(deltaPct)}%`, good: true }
  if (deltaPct >= 3) return { text: `Сейчас дороже средней на ${deltaPct}%`, good: false }
  return { text: 'Цена сейчас близка к средней', good: true }
}
