export type IntentType =
  | "exact_product"
  | "category_search"
  | "gift_search"
  | "service_search"
  | "unknown";

export type ThemePref = "system" | "light" | "dark";

export type ProductKind =
  | "phone"
  | "earbuds"
  | "headphones"
  | "vacuum"
  | "laptop"
  | "tv"
  | "monitor"
  | "coffee"
  | "brush"
  | "hair"
  | "console"
  | "gpu"
  | "book"
  | "watch"
  | "tool"
  | "baby"
  | "pet"
  | "tire"
  | "perfume"
  | "kitchen"
  | "wear"
  | "sport"
  | "home"
  | "gift"
  | "generic";

export interface PricePoint {
  day: number;
  price: number;
}

export interface ReliabilityCheck {
  ok: boolean;
  label: string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  kind: ProductKind;
  hue: number;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  delivery: string;
  warranty: string;
  points: number;
  features: string[];
  whySelected: string[];
  priceHistory: PricePoint[];
  marketAverage: number;
  reliabilityChecks: ReliabilityCheck[];
  isAuraChoice: boolean;
  shop: string;
  reliable: boolean;
}

export interface ServiceOffer {
  id: string;
  companyName: string;
  rating: number;
  reviewsCount: number;
  estimatedPrice: number;
  responseTime: string;
  warranty: string;
  notes: string;
  hiddenFeesWarning: boolean;
  recommended: boolean;
  tags: string[];
}

export interface GiftDirection {
  id: string;
  title: string;
  subtitle: string;
  products: Product[];
}

export type ProcessScene = "parse" | "reviews" | "crawl" | "compare" | "verify" | "compose" | "send" | "inbox";

export interface ProcessStep {
  id: string;
  text: string;
  detail: string;
  queryHint: string;
  scene: ProcessScene;
  delay: number;
}

export interface InterviewOption {
  id: string;
  label: string;
  hint?: string;
}

export interface InterviewQuestion {
  id: string;
  title: string;
  options: InterviewOption[];
}

export interface ClassifiedQuery {
  type: IntentType;
  query: string;
  matched?: string;
}

export type InterviewAnswers = Record<string, string>;

export interface Tx {
  id: string;
  delta: number;
  label: string;
  at: string;
}

export interface Suggestion {
  text: string;
  type: Exclude<IntentType, "unknown">;
}

export interface SerpRow {
  id: string;
  title: string;
  url: string;
  snippet: string;
  meta?: string;
}

export interface CrawlSource {
  id: string;
  name: string;
  host: string;
  tint: string;
  kind: "shop" | "web" | "maps" | "inbox";
}
