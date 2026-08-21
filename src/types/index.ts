export type QueryType = 'exact_product' | 'category_search' | 'gift_search' | 'service_search'

export interface SuggestionItem {
  text: string
  type: QueryType
}

export interface Question {
  id: string
  title: string
  options: string[]
}

export interface CheckItem {
  label: string
  ok: boolean
  note?: string
}

export interface PricePoint {
  d: string
  p: number
}

export interface ProductOffer {
  id: string
  title: string
  brand?: string
  store: string
  icon: string
  hue: number
  price: number
  oldPrice?: number
  rating: number
  reviewsCount: number
  delivery: string
  warranty: string
  points: number
  features: string[]
  whySelected: string[]
  priceHistory: PricePoint[]
  marketAverage: number
  minPrice90: number
  reliabilityChecks: CheckItem[]
  risk?: string
  isAuraChoice?: boolean
}

export interface GiftDirection {
  id: string
  title: string
  blurb: string
  recommended: boolean
  items: ProductOffer[]
}

export type BadgeTone = 'good' | 'warn' | 'info'

export interface ServiceBadge {
  label: string
  tone: BadgeTone
}

export interface ServiceBid {
  id: string
  companyName: string
  rating: number
  reviewsCount: number
  estimatedPrice: number
  priceNote: string
  term: string
  responseTime: string
  warranty: string
  comment: string
  badges: ServiceBadge[]
  hiddenFeesNote?: string
  recommended: boolean
}

export type EventKind = 'info' | 'found' | 'warn' | 'done'

export interface LaneEvent {
  at: number
  text: string
  kind: EventKind
}

export interface Lane {
  id: string
  title: string
  icon: string
  events: LaneEvent[]
}

export interface Script {
  lanes: Lane[]
  status: { at: number; text: string }[]
  totalMs: number
}

export interface ProcEvent {
  id: number
  laneId: string
  laneTitle: string
  icon: string
  text: string
  kind: EventKind
  at: number
}

export interface ProductPayload {
  kind: 'product'
  hero: ProductOffer
  offers: ProductOffer[]
  totalFound: number
  storesCount: number
}

export interface GiftPayload {
  kind: 'gift'
  hero: ProductOffer
  directions: GiftDirection[]
  totalFound: number
}

export interface ServicePayload {
  kind: 'service'
  taskRows: { label: string; value: string }[]
  bids: ServiceBid[]
  companiesFound: number
  companiesSent: number
  warnings: string[]
  avgPrice: number
}

export type ResultPayload = ProductPayload | GiftPayload | ServicePayload

export type FlowPhase = 'idle' | 'questions' | 'processing' | 'results' | 'unknown'
