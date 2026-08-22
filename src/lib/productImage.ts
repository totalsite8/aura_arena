/**
 * Реестр фотографий товаров.
 *
 * Фото лежат в public/img/products/ и отдаются как /img/products/{file}.jpg.
 * По названию товара ищется подходящий файл. Если файла нет — компонент
 * ProductImage сам покажет градиентную заглушку с иконкой (через onError),
 * поэтому сайт никогда не ломается, даже если фото ещё не добавлено.
 */

/** Транслит + нормализация названия в имя файла. */
export function productSlug(title: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh',
    з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
    п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts',
    ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  }
  return title
    .toLowerCase()
    .replace(/[\u0400-\u04ff]/g, (ch) => map[ch] ?? ch)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/**
 * Переопределения: слаг названия → имя файла в /img/products/ (без расширения).
 * Нужны для точных брендовых товаров с «человеческими» именами файлов и для
 * подарочных позиций, где название длинное/с описанием.
 */
const ALIASES: Record<string, string> = {
  // точные товары
  'smartfon-honor-magic-7-pro-12-512-gb': 'honor-magic-7-pro',
  'naushniki-apple-airpods-pro-3': 'airpods-pro-3',
  'naushniki-sony-wh-1000xm5': 'sony-wh-1000xm5',
  'robot-pylesos-roborock-q7-max': 'roborock-q7-max',
  'smartfon-apple-iphone-16-pro-256-gb': 'iphone-16-pro',
  'noutbuk-asus-vivobook-15': 'asus-vivobook-15',
  'televizor-lg-55-4k-uhd': 'lg-55-4k',
  'monitor-samsung-27-ips': 'samsung-27-ips',
  'elektricheskaya-schetka-oral-b-pro-3': 'oral-b-pro-3',
  'fen-dyson-supersonic': 'dyson-supersonic',
  'igrovaya-pristavka-playstation-5-slim': 'ps5-slim',
  'videokarta-geforce-rtx-4070-super-12-gb': 'rtx-4070-super',
  'elektronnaya-kniga-pocketbook-632': 'pocketbook-632',
  'smart-chasy-amazfit-gts-4': 'amazfit-gts-4',
  'shurupovert-bosch-12v-s-dvumya-akb': 'bosch-12v',
  'detskaya-smes-nan-2-800-g': 'nan-2',
  'korm-dlya-sobak-monge-kuritsa-10-kg': 'monge-10kg',
  'shiny-michelin-primacy-4-205-55-r16': 'michelin-primacy-4',
  'parfyum-dior-sauvage-100-ml': 'dior-sauvage',
  'kofemashina-delonghi-magnifica': 'delonghi-magnifica',
  "kofemashina-de-longhi-magnifica": 'delonghi-magnifica',
  "kofemashina-delongi-magnifica": 'delonghi-magnifica',

  // категория «наушники»
  'baseus-bowie-ma10': 'baseus-bowie-ma10',
  'qcy-t13-anc': 'qcy-t13-anc',
  'redmi-buds-4-lite': 'redmi-buds-4-lite',
  'realme-buds-t110': 'realme-buds-t110',
  'jbl-wave-beam': 'jbl-wave-beam',
  'cmf-buds-nothing': 'cmf-buds',

  // подарки
  'portativnaya-kolonka-jbl-go-4': 'jbl-go-4',
  'umnaya-kolonka-s-golosovym-pomoschnikom': 'smart-speaker',
  'besprovodnoy-zaryadnyy-stend-3-v-1': 'charging-stand',
  'massazhyor-dlya-shei-i-plech': 'neck-massager',
  'nabor-uhodovoy-kosmetiki': 'cosmetics-kit',
  'parfyum-miniatyura-15-ml': 'perfume-mini',
  'nabor-dlya-grilya-v-keyse': 'grill-set',
  'multitul-15-v-1': 'multitool',
  'termokruzhka-s-podogrevom': 'heated-mug',
  'umnaya-lampa-s-16-mln-tsvetov': 'smart-lamp',
  'teplyy-pled-s-rukavami': 'sleeved-blanket',
  'kofeynyy-nabor-4-sorta': 'coffee-set',
  'fitnes-braslet-s-amoled': 'fitness-amazfit',
  'nabor-espanderov-5-sht': 'expander-set',
  'butylka-so-shkaloy-vremeni': 'water-bottle',
  'sertifikat-na-kvest-dlya-dvoih': 'quest-cert',
  'master-klass-po-goncharnomu-delu': 'pottery-class',
  'polyot-v-aerotrube': 'wind-tunnel',
}

/** Возвращает URL фото товара (если есть alias или предсказуемый слаг). */
export function productImage(title: string): string | undefined {
  if (!title) return undefined
  const slug = productSlug(title)
  const file = ALIASES[slug] ?? slug
  return `/img/products/${file}.jpg`
}
