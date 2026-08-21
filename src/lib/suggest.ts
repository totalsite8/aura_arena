import type { QueryType, SuggestionItem } from '../types'
import { SUGGESTIONS } from '../data/suggestions'
import { normalize } from './normalize'

const TYPE_ORDER: QueryType[] = ['exact_product', 'category_search', 'gift_search', 'service_search']

/** Подсказки при вводе: сначала по началу строки, потом по вхождению, группами. */
export function getSuggestions(raw: string, limit = 8): SuggestionItem[] {
  const q = normalize(raw)
  if (!q) {
    // Пустой ввод — кураторские подсказки: по 2 из каждой группы
    const byType = new Map<QueryType, SuggestionItem[]>()
    for (const t of TYPE_ORDER) byType.set(t, [])
    const curatedIdx = [0, 3, 10, 17]
    for (const t of TYPE_ORDER) {
      const list = SUGGESTIONS.filter((s) => s.type === t)
      byType.set(t, curatedIdx.map((i) => list[i % list.length]).slice(0, 2))
    }
    return TYPE_ORDER.flatMap((t) => byType.get(t) ?? [])
  }

  const starts: SuggestionItem[] = []
  const includes: SuggestionItem[] = []
  for (const item of SUGGESTIONS) {
    const text = normalize(item.text)
    if (text.startsWith(q)) starts.push(item)
    else if (text.includes(q)) includes.push(item)
  }
  const rank = (list: SuggestionItem[]) =>
    list.sort(
      (a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type) || a.text.length - b.text.length
    )
  return [...rank(starts), ...rank(includes)].slice(0, limit)
}
