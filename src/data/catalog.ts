import { normalize } from '../lib/normalize'

export interface ExactSpec {
  query: string
  title: string
  brand: string
  price: number
  icon: string
  features: string[]
  pros: string[]
}

/** Детальные данные для точных товаров (первый — hero-сценарий) */
export const EXACT_SPECS: ExactSpec[] = [
  {
    query: 'honor magic 7 pro',
    title: 'Смартфон HONOR Magic 7 Pro 12/512 ГБ',
    brand: 'HONOR',
    price: 74990,
    icon: 'Smartphone',
    features: ['12/512 ГБ', 'Snapdragon 8 Elite', 'Камера 200 Мп', 'Зарядка 100 Вт'],
    pros: ['камера ночью', 'автономность', 'яркий экран'],
  },
  {
    query: 'airpods pro 3',
    title: 'Наушники Apple AirPods Pro 3',
    brand: 'Apple',
    price: 24990,
    icon: 'Headphones',
    features: ['Шумоподавление ×2', 'До 30 ч с кейсом', 'USB-C', 'Защита IP54'],
    pros: ['шумоподавление', 'посадка', 'микрофон'],
  },
  {
    query: 'sony wh-1000xm5',
    title: 'Наушники Sony WH-1000XM5',
    brand: 'Sony',
    price: 29990,
    icon: 'Headphones',
    features: ['Топовое ANC', '30 ч работы', 'Hi-Res Audio', '8 микрофонов'],
    pros: ['звук', 'шумоподавление', 'комфорт'],
  },
  {
    query: 'робот-пылесос roborock q7 max+',
    title: 'Робот-пылесос Roborock Q7 Max+',
    brand: 'Roborock',
    price: 39990,
    icon: 'Bot',
    features: ['Станция самоочистки', 'Лидар-навигация', 'До 180 мин', '4200 Па'],
    pros: ['навигация', 'сила всасывания', 'приложение'],
  },
  {
    query: 'iphone 16 pro 256gb',
    title: 'Смартфон Apple iPhone 16 Pro 256 ГБ',
    brand: 'Apple',
    price: 119990,
    icon: 'Smartphone',
    features: ['A18 Pro', 'Камера 48 Мп', 'Титановый корпус', 'USB-C'],
    pros: ['камера', 'производительность', 'экран 120 Гц'],
  },
  {
    query: 'ноутбук asus vivobook 15',
    title: 'Ноутбук ASUS Vivobook 15',
    brand: 'ASUS',
    price: 54990,
    icon: 'Laptop',
    features: ['Ryzen 5', '16 ГБ ОЗУ', '512 ГБ SSD', '15,6" IPS'],
    pros: ['скорость работы', 'тихий', 'лёгкий'],
  },
  {
    query: 'телевизор lg 55 4k',
    title: 'Телевизор LG 55" 4K UHD',
    brand: 'LG',
    price: 49990,
    icon: 'Tv',
    features: ['4K UHD', 'webOS', 'HDR10', 'Динамики 20 Вт'],
    pros: ['картинка', 'умный ТВ', 'тонкий'],
  },
  {
    query: 'монитор samsung 27 ips',
    title: 'Монитор Samsung 27" IPS',
    brand: 'Samsung',
    price: 18990,
    icon: 'Monitor',
    features: ['IPS 75 Гц', 'Full HD', 'Тонкие рамки', 'Flicker-Free'],
    pros: ['цвета', 'не устают глаза', 'сборка'],
  },
  {
    query: 'кофемашина delonghi magnifica',
    title: "Кофемашина De'Longhi Magnifica",
    brand: "De'Longhi",
    price: 42990,
    icon: 'Coffee',
    features: ['Зерновая', 'Капучинатор', '1450 Вт', 'Капельный поддон'],
    pros: ['вкус кофе', 'простая чистка', 'надёжность'],
  },
  {
    query: 'щетка oral-b pro 3',
    title: 'Электрическая щётка Oral-B Pro 3',
    brand: 'Oral-B',
    price: 6490,
    icon: 'Brush',
    features: ['3 режима', 'Датчик давления', 'До 14 дней без зарядки'],
    pros: ['чистит заметно лучше', 'мягкий режим', 'таймер'],
  },
  {
    query: 'фен dyson supersonic',
    title: 'Фен Dyson Supersonic',
    brand: 'Dyson',
    price: 42990,
    icon: 'Wind',
    features: ['Быстрая сушка', 'Без перегрева', '5 насадок', 'Ионизация'],
    pros: ['скорость сушки', 'не сушит волосы', 'тихий'],
  },
  {
    query: 'playstation 5 slim',
    title: 'Игровая приставка PlayStation 5 Slim',
    brand: 'Sony',
    price: 52990,
    icon: 'Gamepad2',
    features: ['1 ТБ SSD', '4K до 120 Гц', 'Меньше на 30%', 'Дисковод'],
    pros: ['загрузки мгновенные', 'тихая', 'игры в 4K'],
  },
  {
    query: 'видеокарта rtx 4070 super',
    title: 'Видеокарта GeForce RTX 4070 SUPER 12 ГБ',
    brand: 'NVIDIA',
    price: 69990,
    icon: 'Cpu',
    features: ['12 ГБ GDDR6X', 'DLSS 3.5', '2,5 ГГц', 'HDMI 2.1'],
    pros: ['тянет 2K-игры', 'холодная', 'тихая'],
  },
  {
    query: 'книга pocketbook 632',
    title: 'Электронная книга PocketBook 632',
    brand: 'PocketBook',
    price: 19990,
    icon: 'BookOpen',
    features: ['E-Ink 6,8"', 'Подсветка SMARTlight', 'IPX8', 'Читает всё'],
    pros: ['экран как бумага', 'влагозащита', 'живёт месяц'],
  },
  {
    query: 'часы amazfit gts 4',
    title: 'Смарт-часы Amazfit GTS 4',
    brand: 'Amazfit',
    price: 11990,
    icon: 'Watch',
    features: ['AMOLED', 'GPS', 'До 8 дней', '150+ режимов спорта'],
    pros: ['батарея', 'экран', 'точный GPS'],
  },
  {
    query: 'шуруповерт bosch 12v',
    title: 'Шуруповёрт Bosch 12V с двумя АКБ',
    brand: 'Bosch',
    price: 9490,
    icon: 'Wrench',
    features: ['2 аккумулятора', '20+1 ступень', 'В кейсе', 'Подсветка'],
    pros: ['мощный для дома', 'лёгкий', 'кейс'],
  },
  {
    query: 'смесь nan 2',
    title: 'Детская смесь NAN 2, 800 г',
    brand: 'NAN',
    price: 1190,
    icon: 'Baby',
    features: ['С 6 месяцев', '800 г', 'С пробиотиками', 'Без пальмового масла'],
    pros: ['хорошо переносится', 'растворяется легко'],
  },
  {
    query: 'корм monge 10 кг',
    title: 'Корм для собак Monge, курица, 10 кг',
    brand: 'Monge',
    price: 6990,
    icon: 'Dog',
    features: ['Для взрослых собак', 'Курица', '10 кг', 'С витаминами'],
    pros: ['собаки едят охотно', 'шерсть лучше'],
  },
  {
    query: 'шины michelin 205/55 r16',
    title: 'Шины Michelin Primacy 4 205/55 R16',
    brand: 'Michelin',
    price: 8490,
    icon: 'Car',
    features: ['Летние', 'Индекс 91V', 'Тихие', 'Мокрое торможение A'],
    pros: ['тихие', 'торможение', 'износ'],
  },
  {
    query: 'dior sauvage 100ml',
    title: 'Парфюм Dior Sauvage, 100 мл',
    brand: 'Dior',
    price: 11990,
    icon: 'Sparkles',
    features: ['Eau de Parfum', '100 мл', 'Стойкость 8+ ч', 'Защитный код'],
    pros: ['стойкость', 'шлейф', 'оригинальный код'],
  },
]

export function findExactSpec(query: string): ExactSpec | undefined {
  const q = normalize(query)
  return EXACT_SPECS.find((s) => q.includes(s.query) || s.query.includes(q))
}

export const STORES = ['Ozon', 'Яндекс Маркет', 'Wildberries', 'DNS', 'М.Видео', 'Ситилинк'] as const

export interface CategorySpec {
  match: RegExp
  label: string
  icon: string
  criteria: string[]
  reject: string
  useOptions: string[]
  items: { name: string; brand: string; price: number; feats: string[] }[]
}

const GENERIC_USE = ['Для дома', 'Для работы', 'Для спорта', 'Универсально']

export const CATEGORY_SPECS: CategorySpec[] = [
  {
    match: /наушник/,
    label: 'Беспроводные наушники',
    icon: 'Headphones',
    criteria: ['автономность от 20 ч', 'микрофон с шумодавом', 'стабильный Bluetooth', 'реальные отзывы от 4.5'],
    reject: 'модели без фото покупателей и с жалобами на рассинхрон',
    useOptions: ['Музыка и подкасты', 'Звонки и работа', 'Спорт', 'Игры и видео'],
    items: [
      { name: 'Baseus Bowie MA10', brand: 'Baseus', price: 2190, feats: ['ANC до −48 дБ', '36 ч с кейсом', 'Bluetooth 5.3'] },
      { name: 'QCY T13 ANC', brand: 'QCY', price: 1490, feats: ['Шумоподавление', '30 ч с кейсом', '4 микрофона'] },
      { name: 'Redmi Buds 4 Lite', brand: 'Xiaomi', price: 1690, feats: ['Лёгкие: 3,9 г', '20 ч с кейсом', 'Быстрая зарядка'] },
      { name: 'realme Buds T110', brand: 'realme', price: 1290, feats: ['38 ч с кейсом', 'Драйвер 10 мм', 'IPX5'] },
      { name: 'JBL Wave Beam', brand: 'JBL', price: 2990, feats: ['Фирменный бас', '32 ч с кейсом', 'Приложение JBL'] },
      { name: 'CMF Buds (Nothing)', brand: 'Nothing', price: 2690, feats: ['ANC 42 дБ', '35,5 ч', 'Низкая задержка'] },
    ],
  },
  {
    match: /мини[- ]?пк|сервер/,
    label: 'Мини-ПК для домашнего сервера',
    icon: 'Server',
    criteria: ['тихая работа 24/7', 'от 16 ГБ ОЗУ', 'два слота под диск', 'потребление до 35 Вт'],
    reject: 'модели с одним слотом памяти и перегревом в отзывах',
    useOptions: ['Файлы и бэкапы', 'Домашний кинотеатр', 'Умный дом', 'Всё сразу'],
    items: [
      { name: 'GMKtec NucBox G3 Plus', brand: 'GMKtec', price: 16990, feats: ['Intel N150', '16 ГБ ОЗУ', '512 ГБ SSD'] },
      { name: 'Beelink Mini S12 Pro', brand: 'Beelink', price: 18990, feats: ['N100', '16 ГБ ОЗУ', 'Тихое охлаждение'] },
      { name: 'XCY X30 без вентилятора', brand: 'XCY', price: 12490, feats: ['Пассивное охлаждение', '0 дБ', '2×LAN'] },
      { name: 'ASUS PN42', brand: 'ASUS', price: 21490, feats: ['N200', 'Безвентиляторный', 'VESA-крепление'] },
      { name: 'Chatreey T9 Plus', brand: 'Chatreey', price: 14490, feats: ['N100', '8 ГБ → 32 ГБ', 'Три дисплея'] },
    ],
  },
  {
    match: /мультиварк/,
    label: 'Мультиварки для семьи',
    icon: 'ChefHat',
    criteria: ['чаша от 5 л', '3D-нагрев', 'расширенные программы', 'съёмный клапан'],
    reject: 'модели с тонким антипригарным покрытием',
    useOptions: ['Каши и гарниры', 'Выпечка', 'Тушёное', 'Всё понемногу'],
    items: [
      { name: 'REDMOND RMC-M90', brand: 'REDMOND', price: 7490, feats: ['5 л', '17 программ', 'Мультиповар'] },
      { name: 'Philips HD3136', brand: 'Philips', price: 5990, feats: ['4 л', '3D-нагрев', 'Отсрочка старта'] },
      { name: 'Polaris PMC 0517AD', brand: 'Polaris', price: 6490, feats: ['5 л', 'Wi-Fi управление', 'Томление'] },
      { name: 'Garlyn MR-D10', brand: 'Garlyn', price: 5490, feats: ['5 л', '16 программ', 'Керамическая чаша'] },
      { name: 'Moulinex CE500E32', brand: 'Moulinex', price: 8990, feats: ['5 л', 'Скороварка', '55 программ'] },
    ],
  },
  {
    match: /скейтборд|пенни ?борд/,
    label: 'Скейтборды для новичков',
    icon: 'Zap',
    criteria: ['стабильная доска', 'мягкие колёса 78A', 'выдерживает 100 кг', 'не скользкое покрытие'],
    reject: 'доски с «пластиковыми» подшипниками и без отзывов',
    useOptions: ['Городские поездки', 'Трюки', 'Для ребёнка', 'Просто покататься'],
    items: [
      { name: 'Penny Board 22"', brand: 'Penny', price: 3990, feats: ['Классика для города', 'Мягкие колёса', 'Весит 2 кг'] },
      { name: 'Tech Team Switch', brand: 'Tech Team', price: 2990, feats: ['Клен 9 слоёв', 'ABEC-7', 'Для новичков'] },
      { name: 'Oxelo Mid500', brand: 'Oxelo', price: 4990, feats: ['Устойчивый', 'Детский/подростковый', 'Гарантия 2 года'] },
      { name: 'RIDEX Cruiser', brand: 'RIDEX', price: 5990, feats: ['Лонгборд-крузёр', 'Мягкий ход', 'Алюм. подвески'] },
      { name: 'Union Board Classic', brand: 'Union', price: 3490, feats: ['Компактный', 'Яркие расцветки', 'ABEC-9'] },
    ],
  },
  {
    match: /ноутбук.*(учеб|работ)|ноутбук/,
    label: 'Ноутбуки для учёбы и работы',
    icon: 'Laptop',
    criteria: ['от 16 ГБ ОЗУ', 'SSD от 512 ГБ', 'экран IPS', 'вес до 1,8 кг'],
    reject: 'модели с 8 ГБ без возможности апгрейда',
    useOptions: ['Учёба и документы', 'Программирование', 'Дизайн', 'Всё понемногу'],
    items: [
      { name: 'Lenovo IdeaPad Slim 3', brand: 'Lenovo', price: 49990, feats: ['Ryzen 5 7520U', '16 ГБ', '512 ГБ SSD'] },
      { name: 'ASUS Vivobook Go 15', brand: 'ASUS', price: 47990, feats: ['Core i3-N305', '16 ГБ', 'IPS 15,6"'] },
      { name: 'HP 15s-eq3034', brand: 'HP', price: 52990, feats: ['Ryzen 5 5500U', '16 ГБ', 'Быстрая зарядка'] },
      { name: 'Acer Aspire 3 A315', brand: 'Acer', price: 44990, feats: ['Ryzen 5', '16 ГБ', 'Ethernet-порт'] },
      { name: 'DEXP Aquilon', brand: 'DEXP', price: 29990, feats: ['N100', '8 ГБ', 'Самый лёгкий бюджет'] },
    ],
  },
  {
    match: /наполнител/,
    label: 'Наполнители без запаха',
    icon: 'Cat',
    criteria: ['удерживает запах', 'не липнет к лапам', 'экономичный расход', 'без пыли'],
    reject: 'наполнители с «химозным» парфюмом в отзывах',
    useOptions: ['Силикагелевый', 'Древесный', 'Минеральный', 'Тофу'],
    items: [
      { name: 'Cat Step силикагелевый, 7,6 л', brand: 'Cat Step', price: 990, feats: ['До 3 недель', 'Без пыли', 'Видно влагу'] },
      { name: 'Fresh Step Extreme', brand: 'Fresh Step', price: 1290, feats: ['Уголь в составе', 'Комкующийся', '12 кг'] },
      { name: 'Кузя древесный, 8 кг', brand: 'Кузя', price: 890, feats: ['Натуральный', 'Можно в канализацию', 'Экономичный'] },
      { name: 'Pi-Pi-Bent «Классик», 10 кг', brand: 'Pi-Pi-Bent', price: 750, feats: ['Бентонит', 'Сильный комок', 'Без отдушки'] },
      { name: 'Homecat тофу, 6 л', brand: 'Homecat', price: 1090, feats: ['Растительный', 'Растворимый', 'Почти без пыли'] },
    ],
  },
  {
    match: /робот.?пылесос.*шерст|пылесос.*(шерст|животн)/,
    label: 'Роботы-пылесосы для шерсти',
    icon: 'Bot',
    criteria: ['сила от 4000 Па', 'турбощётка без наматывания', 'контейнер от 450 мл', 'зоны запрета'],
    reject: 'модели, где шерсть наматывается на ось — по отзывам',
    useOptions: ['Квартира с котом', 'С собакой', 'Ковры', 'Ламинат и плитка'],
    items: [
      { name: 'Dreame D9 Max', brand: 'Dreame', price: 24990, feats: ['4000 Па', 'Лидар', 'Карты этажей'] },
      { name: 'Roborock Q5 Pro', brand: 'Roborock', price: 29990, feats: ['5500 Па', 'Щётка DuoRoller', 'До 240 мин'] },
      { name: 'Xiaomi Robot Vacuum S12', brand: 'Xiaomi', price: 17990, feats: ['4000 Па', 'Влажная уборка', 'LiDAR'] },
      { name: 'iBoto Smart C815W', brand: 'iBoto', price: 15990, feats: ['4500 Па', 'Ковры turbo', 'Тихий режим'] },
      { name: 'Polaris PVCR 1226', brand: 'Polaris', price: 13990, feats: ['3200 Па', 'Wi-Fi', 'Бюджетный'] },
    ],
  },
  {
    match: /кроссовк.*бег|бег.*кроссовк/,
    label: 'Кроссовки для бега',
    icon: 'Footprints',
    criteria: ['амортизация пятки', 'вес до 300 г', 'дышащий верх', 'цепкая подошва'],
    reject: 'модели с жёсткой стелькой и натиранием — по отзывам',
    useOptions: ['Асфальт', 'Беговая дорожка', 'Парк/грунт', 'Кроссфит'],
    items: [
      { name: 'Anta Speed Lite', brand: 'Anta', price: 3490, feats: ['Пена A-FLASH', '255 г', 'Сетка air-mesh'] },
      { name: 'Demix Stratus', brand: 'Demix', price: 1999, feats: ['Бюджетный бег', 'Мягкая стелька', 'Светоотражатели'] },
      { name: 'Kappa Runner X', brand: 'Kappa', price: 3990, feats: ['Гибкая подошва', 'Анатомическая стелька'] },
      { name: 'Jogel Airlite', brand: 'Jogel', price: 2790, feats: ['Лёгкие', 'Для зала и парка'] },
      { name: 'Outventure Wave', brand: 'Outventure', price: 2499, feats: ['Усиленная пятка', 'До −5°C'] },
    ],
  },
  {
    match: /пуховик/,
    label: 'Пуховики до −20°C',
    icon: 'Shirt',
    criteria: ['наполнитель 80/20 пух', 'мембрана от ветра', 'капюшон с регулировкой', 'тёплые карманы'],
    reject: 'модели, где пух лезет из швов — по отзывам',
    useOptions: ['Город', 'Прогулки с ребёнком', 'Авто', 'Дачные дела'],
    items: [
      { name: 'Finn Flare Arctic', brand: 'Finn Flare', price: 9990, feats: ['До −25°C', 'Пух 90/10', 'Ветрозащита'] },
      { name: 'Baon Heavy', brand: 'Baon', price: 7990, feats: ['До −20°C', 'Большие размеры', 'Двойная молния'] },
      { name: "O'STIN Studio", brand: "O'STIN", price: 5990, feats: ['Био-пух', 'Компактный', 'Капюшон'] },
      { name: 'Zolla Urban', brand: 'Zolla', price: 6490, feats: ['До −18°C', 'Водоотталкивающий', 'Стильный крой'] },
      { name: 'Modis Warm+', brand: 'Modis', price: 3990, feats: ['Бюджетный', 'До −15°C', 'Лёгкий'] },
    ],
  },
  {
    match: /блендер.*смузи|блендер/,
    label: 'Блендеры для смузи',
    icon: 'CupSoda',
    criteria: ['мощность от 900 Вт', 'нож для льда', 'чаша из стекла или Tritan', 'легко мыть'],
    reject: 'модели с запахом пластика при работе',
    useOptions: ['Смузи утром', 'Спортивные коктейли', 'Детское питание', 'Соусы и супы'],
    items: [
      { name: 'RAWMID Dream Greenery', brand: 'RAWMID', price: 5990, feats: ['1500 Вт', 'Лёд в снег', 'Tritan 1,5 л'] },
      { name: 'Gemlux GL-BL880', brand: 'Gemlux', price: 4490, feats: ['1200 Вт', '2 бутылки с собой', 'Пульс-режим'] },
      { name: 'Kitfort KT-1385', brand: 'Kitfort', price: 2990, feats: ['1000 Вт', 'Спортивная бутылка', 'Компактный'] },
      { name: 'Redmond RHB-2933', brand: 'Redmond', price: 3490, feats: ['Погружной + чаша', '5 скоростей'] },
      { name: 'Xiaomi Blender BHR', brand: 'Xiaomi', price: 3990, feats: ['Стильный', '20 000 об/мин', 'Тихий'] },
    ],
  },
  {
    match: /видеорегистратор/,
    label: 'Видеорегистраторы с ночным режимом',
    icon: 'Video',
    criteria: ['ночная съёмка WDR', 'Full HD 60 к/с', 'конденсатор вместо АКБ', 'GPS'],
    reject: 'модели с «замыливанием» ночью — проверены тесты',
    useOptions: ['Городские поездки', 'Трасса', 'Такси', 'Новый водитель'],
    items: [
      { name: '70mai A500S', brand: '70mai', price: 6990, feats: ['2К + WDR', 'GPS', 'Ночная оптика Sony'] },
      { name: 'Neoline G-Tech X77', brand: 'Neoline', price: 5990, feats: ['Full HD 60 fps', 'Радар-детект.', 'Магнитное крепление'] },
      { name: 'Mio MiVue 792', brand: 'Mio', price: 8990, feats: ['Ночной режим Pro', 'Wi-Fi', 'GPS-метки'] },
      { name: 'Xiaomi Smart Dash 2', brand: 'Xiaomi', price: 4990, feats: ['2K', 'Голосовое упр.', 'Компактный'] },
      { name: 'Dunobil Quantum', brand: 'Dunobil', price: 7990, feats: ['Два объектива', 'Конденсатор', 'WDR'] },
    ],
  },
  {
    match: /смартфон.*школьник|телефон.*школьник/,
    label: 'Смартфоны для школьника',
    icon: 'Smartphone',
    criteria: ['от 128 ГБ памяти', 'батарея от 5000 мА·ч', 'прочный корпус', 'быстрая зарядка'],
    reject: 'модели с 64 ГБ и без обновлений системы',
    useOptions: ['Учёба и чаты', 'Игры', 'Фото/видео', 'Первый телефон'],
    items: [
      { name: 'POCO M6 8/256', brand: 'POCO', price: 12990, feats: ['90 Гц экран', '5030 мА·ч', 'NFC'] },
      { name: 'Redmi 13C 8/256', brand: 'Xiaomi', price: 8990, feats: ['Камера 50 Мп', '5000 мА·ч', '18 Вт'] },
      { name: 'Samsung Galaxy A06', brand: 'Samsung', price: 9490, feats: ['Простой режим', 'Обновления 2 года', '5000 мА·ч'] },
      { name: 'realme C61', brand: 'realme', price: 7990, feats: ['Прочный корпус', '120 Гц', 'IP54'] },
      { name: 'Infinix Hot 40i', brand: 'Infinix', price: 9990, feats: ['256 ГБ', '90 Гц', 'Громкий динамик'] },
    ],
  },
  {
    match: /дрель|шуруповерт/,
    label: 'Дрели-шуруповёрты для дома',
    icon: 'Wrench',
    criteria: ['аккумулятор от 12 В', 'два АКБ в комплекте', 'реверс и ограничитель', 'кейс'],
    reject: 'модели без индикатора заряда и с тугой кнопкой',
    useOptions: ['Повесить полки', 'Сборка мебели', 'Ремонт', 'Дача'],
    items: [
      { name: 'Makita DF331D', brand: 'Makita', price: 9990, feats: ['Проф-класс', '2 АКБ', 'Быстрая зарядка 30 мин'] },
      { name: 'Зубр ЗДЛ-12К', brand: 'Зубр', price: 4290, feats: ['12 В', '2 скорости', 'Кейс и биты'] },
      { name: 'Interskol ДА-13/18ВК', brand: 'Interskol', price: 5490, feats: ['18 В', '30 Н·м', 'Металл. редуктор'] },
      { name: 'Champion DD1201', brand: 'Champion', price: 3990, feats: ['2 АКБ', 'Подсветка', 'Лёгкий'] },
      { name: 'Kolner KCD 12MS', brand: 'Kolner', price: 3490, feats: ['Бюджетный', 'Набор оснастки'] },
    ],
  },
  {
    match: /кресло.*спин|кресло/,
    label: 'Кресла для спины',
    icon: 'Armchair',
    criteria: ['поясничная поддержка', 'регулировка по высоте', 'дышащая спинка', 'грузоподъёмность 120+ кг'],
    reject: 'модели со скрипом газлифта — по отзывам',
    useOptions: ['Работа за ПК', 'Учёба', 'Игры', 'Домашний офис'],
    items: [
      { name: 'Metta SU-B-8', brand: 'Metta', price: 6990, feats: ['Поясничный валик', 'Сетка', 'Качание'] },
      { name: 'Bureaucrat T-9950', brand: 'Bureaucrat', price: 8990, feats: ['Эргономика', 'Подголовник', '120 кг'] },
      { name: 'TetChair Twin', brand: 'TetChair', price: 7490, feats: ['Двойная спинка', 'Дышащая', 'Регулировки'] },
      { name: 'Brabix Ego EX-800', brand: 'Brabix', price: 5990, feats: ['Бюджетный', 'Сетка', 'Подлокотники 3D'] },
      { name: 'Chairman 450 grey', brand: 'Chairman', price: 9990, feats: ['Плотный поясничный упор', 'Мягкие подлокотники'] },
    ],
  },
  {
    match: /увлажнител/,
    label: 'Увлажнители в детскую',
    icon: 'Droplets',
    criteria: ['тихий: до 30 дБ', 'бак от 3 л', 'авто-выкл. без воды', 'легко мыть бак'],
    reject: 'модели с белым налётом и трудной чисткой',
    useOptions: ['Детская', 'Спальня', 'Рабочий стол', 'Вся квартира'],
    items: [
      { name: 'Xiaomi Humidifier 2 Lite', brand: 'Xiaomi', price: 2990, feats: ['4 л', '32 дБ', 'Верхний залив'] },
      { name: 'Boneco U300', brand: 'Boneco', price: 8990, feats: ['Ультразвук', 'Гигростат', 'Очень тихий'] },
      { name: 'Ballu UHB-300', brand: 'Ballu', price: 2490, feats: ['3 л', 'Ароматизация', 'Ночник'] },
      { name: 'Leberg LH-803', brand: 'Leberg', price: 1990, feats: ['Бюджетный', 'Простое управление'] },
      { name: 'Electrolux EHU-3810D', brand: 'Electrolux', price: 5990, feats: ['4,5 л', 'Дисплей влажности'] },
    ],
  },
  {
    match: /термопот|термос.*рыбалк/,
    label: 'Термопоты и термосы',
    icon: 'Thermometer',
    criteria: ['держит тепло 12+ ч', 'устойчивое дно', 'ручка для переноски', 'объём от 1 л'],
    reject: 'модели, протекающие при наклоне — по отзывам',
    useOptions: ['Рыбалка', 'Дача', 'Офис', 'Дорога'],
    items: [
      { name: 'CENTEK CT-1081', brand: 'CENTEK', price: 1990, feats: ['3,8 л', 'Держит тепло 10 ч', 'Насос-налив'] },
      { name: 'Endever Skyline TP-40', brand: 'Endever', price: 3490, feats: ['4 л', 'Нержавейка', 'Три режима'] },
      { name: 'Scarlett SC-ET10D02', brand: 'Scarlett', price: 2490, feats: ['5 л', 'Блокировка от детей'] },
      { name: 'Biostal NB-1000C', brand: 'Biostal', price: 2890, feats: ['Термос 1 л', 'Держит 26 ч', 'Не протекает'] },
      { name: 'Marta MT-1085', brand: 'Marta', price: 2790, feats: ['4,2 л', 'Индикатор нагрева'] },
    ],
  },
  {
    match: /коляск/,
    label: 'Коляски для новорождённого',
    icon: 'Baby',
    criteria: ['люлька с жёстким дном', 'амортизация', 'вес до 12 кг', 'вентиляция люльки'],
    reject: 'модели с хлипкими креплениями колёс',
    useOptions: ['Городские прогулки', 'Лифт в доме', 'Авто-поездки', 'Зима'],
    items: [
      { name: 'Indigo Maximo 2 в 1', brand: 'Indigo', price: 24990, feats: ['2 в 1', 'Амортизация', 'Накидка зимняя'] },
      { name: 'Riko Basic Sport', brand: 'Riko', price: 29990, feats: ['Люлька XL', 'Сумка', 'Дождевик'] },
      { name: 'Navington Caravel', brand: 'Navington', price: 39990, feats: ['Рама-росомаха', 'Надувные колёса'] },
      { name: 'Sweet Baby Combina', brand: 'Sweet Baby', price: 19990, feats: ['Лёгкая: 11 кг', 'Капор XXL'] },
      { name: 'Marimex Classic', brand: 'Marimex', price: 27990, feats: ['Классика', 'Москитная сетка'] },
    ],
  },
  {
    match: /роутер|маршрутизатор/,
    label: 'Роутеры для квартиры',
    icon: 'Wifi',
    criteria: ['Wi-Fi 6', '4 антенны', 'покрытие 80+ м²', 'гигабитные порты'],
    reject: 'модели, греющиеся до отключений — по отзывам',
    useOptions: ['Работа из дома', 'Игры', '4K-видео', 'Умный дом'],
    items: [
      { name: 'Keenetic Sprinter', brand: 'Keenetic', price: 4490, feats: ['Wi-Fi 6', 'Mesh-готов', 'Приложение'] },
      { name: 'TP-Link Archer C64', brand: 'TP-Link', price: 3990, feats: ['AC1200', '4 антенны', 'MU-MIMO'] },
      { name: 'Xiaomi Router AX1500', brand: 'Xiaomi', price: 2590, feats: ['Wi-Fi 6', 'Компактный', 'Простая настройка'] },
      { name: 'ASUS RT-AC57U', brand: 'ASUS', price: 4990, feats: ['Стабильность', 'AiRadar', 'Гостевая сеть'] },
      { name: 'Tenda AC10', brand: 'Tenda', price: 2990, feats: ['4×5 дБи', 'Быстрый старт'] },
    ],
  },
  {
    match: /микроволнов|свч/,
    label: 'Микроволновки с грилем',
    icon: 'Microwave',
    criteria: ['объём от 20 л', 'гриль от 1000 Вт', 'равномерный разогрев', 'лёгкая чистка'],
    reject: 'модели с «холодными» зонами — проверено обзорами',
    useOptions: ['Разогрев', 'Готовка', 'Разморозка', 'Быстрые завтраки'],
    items: [
      { name: 'Samsung GE83KRS', brand: 'Samsung', price: 9990, feats: ['23 л', 'Керамика', 'Гриль 1100 Вт'] },
      { name: 'BBK 23MWG-850T', brand: 'BBK', price: 7990, feats: ['23 л', '8 авто-меню', 'Блокировка'] },
      { name: 'Midea AM820CWW', brand: 'Midea', price: 8990, feats: ['20 л', 'Гриль', 'Простые кнопки'] },
      { name: 'LG MH6535GIS', brand: 'LG', price: 13990, feats: ['25 л', 'Smart Inverter', 'Кварцевый гриль'] },
      { name: 'REDMOND RM-2005D', brand: 'REDMOND', price: 7490, feats: ['20 л', 'Дисплей', '8 программ'] },
    ],
  },
  {
    match: /фитнес.?браслет|тонометр/,
    label: 'Фитнес-браслеты',
    icon: 'Activity',
    criteria: ['измерение давления (с оговоркой)', 'автономность 10+ дней', '5ATM', 'сон и пульс'],
    reject: 'модели с «прыгающим» пульсом — по отзывам',
    useOptions: ['Спорт', 'Здоровье', 'Уведомления', 'Сон'],
    items: [
      { name: 'Amazfit Band 7', brand: 'Amazfit', price: 3990, feats: ['AMOLED 1,47"', '18 дней', '120 режимов'] },
      { name: 'Xiaomi Smart Band 9', brand: 'Xiaomi', price: 3490, feats: ['Яркий AMOLED', '21 день', '5ATM'] },
      { name: 'HUAWEI Band 9', brand: 'HUAWEI', price: 3790, feats: ['Тонкий', 'Точный сон', '14 дней'] },
      { name: 'Honor Band 9', brand: 'Honor', price: 2990, feats: ['Большой экран', '96 режимов'] },
      { name: 'Jet Sport FT-7C', brand: 'Jet', price: 2490, feats: ['Тонометр*', 'IP68', 'Бюджетный'] },
    ],
  },
  {
    match: /.?ледяной.?крем|для серверной/,
    label: 'generic',
    icon: 'Package',
    criteria: [],
    reject: '',
    useOptions: GENERIC_USE,
    items: [],
  },
]

export function findCategorySpec(query: string): CategorySpec | undefined {
  const q = normalize(query)
  return CATEGORY_SPECS.find((s) => s.items.length > 0 && s.match.test(q))
}

/* ------------------------------- ПОДАРКИ ------------------------------- */

export interface GiftDirectionSpec {
  key: string
  title: string
  blurb: string
  icon: string
  items: { name: string; brand: string; price: number; feats: string[] }[]
}

export const GIFT_BANK: GiftDirectionSpec[] = [
  {
    key: 'tech',
    title: 'Умные гаджеты',
    blurb: 'Техника, которой реально пользуются каждый день',
    icon: 'Cpu',
    items: [
      { name: 'Портативная колонка JBL Go 4', brand: 'JBL', price: 2990, feats: ['7 ч музыки', 'IP67: не боится воды'] },
      { name: 'Умная колонка с голосовым помощником', brand: 'Яндекс', price: 3490, feats: ['Музыка, будильник, умный дом'] },
      { name: 'Беспроводной зарядный стенд 3-в-1', brand: 'Arty', price: 1590, feats: ['Телефон + часы + наушники'] },
    ],
  },
  {
    key: 'style',
    title: 'Уход и стиль',
    blurb: 'Про заботу о себе — то, что редко покупают себе сами',
    icon: 'Sparkles',
    items: [
      { name: 'Массажёр для шеи и плеч', brand: 'NeckRelax', price: 2490, feats: ['Прогрев', '3 режима'] },
      { name: 'Набор уходовой косметики', brand: 'Mixit', price: 1990, feats: ['Крем + скраб + маска'] },
      { name: 'Парфюм-миниатюра, 15 мл', brand: 'Select', price: 2890, feats: ['Формат «попробовать»'] },
    ],
  },
  {
    key: 'hobby',
    title: 'Для его хобби',
    blurb: 'Инструменты и штуки для любимых занятий',
    icon: 'Wrench',
    items: [
      { name: 'Набор для гриля в кейсе', brand: 'GrillLab', price: 3490, feats: ['12 предметов', 'Нержавейка'] },
      { name: 'Мультитул 15-в-1', brand: 'RockBlade', price: 1990, feats: ['Кусачки, нож, отвёртки'] },
      { name: 'Термокружка с подогревом', brand: 'HotCup', price: 1790, feats: ['Держит 55°C', 'USB-C'] },
    ],
  },
  {
    key: 'cozy',
    title: 'Дом и уют',
    blurb: 'Тёплое и атмосферное — для дома и спокойных вечеров',
    icon: 'House',
    items: [
      { name: 'Умная лампа с 16 млн цветов', brand: 'Glow', price: 1490, feats: ['Управление с телефона'] },
      { name: 'Тёплый плед с рукавами', brand: 'CosyHome', price: 1490, feats: ['Флис 260 г/м²'] },
      { name: 'Кофейный набор: 4 сорта', brand: 'RoastBro', price: 2190, feats: ['Зерно + молотый'] },
    ],
  },
  {
    key: 'sport',
    title: 'Спорт и движение',
    blurb: 'Мотивация двигаться — без «купи абонемент»',
    icon: 'Dumbbell',
    items: [
      { name: 'Фитнес-браслет с AMOLED', brand: 'Amazfit', price: 3490, feats: ['120 режимов', 'Сон и пульс'] },
      { name: 'Набор эспандеров, 5 шт', brand: 'FlexPro', price: 1490, feats: ['Разная нагрузка', 'Сумка'] },
      { name: 'Бутылка со шкалой времени', brand: 'Hydro', price: 1290, feats: ['2 л', 'Tritan, не бьётся'] },
    ],
  },
  {
    key: 'impress',
    title: 'Впечатления',
    blurb: 'Эмоции запоминаются дольше вещей',
    icon: 'PartyPopper',
    items: [
      { name: 'Сертификат на квест для двоих', brand: 'QuestCity', price: 3000, feats: ['Хоррор/детектив на выбор'] },
      { name: 'Мастер-класс по гончарному делу', brand: 'ГлинаПлюс', price: 3500, feats: ['2 часа + изделие с собой'] },
      { name: 'Полёт в аэротрубе', brand: 'AeroFly', price: 4000, feats: ['2 полёта', 'Инструктор'] },
    ],
  },
]

/* ------------------------------- УСЛУГИ ------------------------------- */

export interface NicheSpec {
  match: RegExp
  label: string
  unit?: string
  min: number
  max: number
  termOptions: string[]
  question1Options: string[]
}

export const SERVICE_NICHES: NicheSpec[] = [
  { match: /остекл|балкон|лодж/, label: 'Остекление балкона', min: 68000, max: 120000, termOptions: ['2–3 недели', '3–5 недель'], question1Options: ['Только остекление', 'Остекление с отделкой', 'Под ключ'] },
  { match: /переезд|грузчик/, label: 'Переезд с грузчиками', min: 8000, max: 25000, termOptions: ['за 1 день', '1–2 дня'], question1Options: ['Квартира', 'Офис', 'Дача'] },
  { match: /фотограф/, label: 'Фотограф на праздник', min: 3000, max: 12000, unit: 'за 2 часа съёмки', termOptions: ['в выходные', 'по договорённости'], question1Options: ['Репортаж', 'Постановочная', 'Семейная'] },
  { match: /холст|картин/, label: 'Печать на холсте', min: 1500, max: 5000, termOptions: ['2–4 дня', 'за 1 день'], question1Options: ['Фото на холсте', 'Репродукция', 'Коллаж'] },
  { match: /мебель|собрать/, label: 'Сборка мебели', min: 1200, max: 4500, termOptions: ['в день обращения', '1–2 дня'], question1Options: ['Шкаф/комод', 'Кухня', 'Несколько предметов'] },
  { match: /ремонт квартир|под ключ/, label: 'Ремонт квартиры под ключ', min: 450000, max: 1500000, termOptions: ['1,5–3 месяца', '3–5 месяцев'], question1Options: ['Косметический', 'Капитальный', 'Дизайнерский'] },
  { match: /окна|пвх/, label: 'Пластиковые окна', min: 28000, max: 65000, unit: 'за окно с установкой', termOptions: ['2–4 недели', 'от 1 недели'], question1Options: ['Одно окно', 'Два-три окна', 'Вся квартира'] },
  { match: /сантехник/, label: 'Вызов сантехника', min: 1500, max: 5000, termOptions: ['сегодня–завтра', 'в течение дня'], question1Options: ['Смеситель/кран', 'Унитаз', 'Трубы'] },
  { match: /проводк|электрик/, label: 'Замена проводки', min: 15000, max: 60000, termOptions: ['2–5 дней', 'неделя'], question1Options: ['Одна комната', 'Вся квартира', 'Частично'] },
  { match: /уборк|клининг/, label: 'Уборка после ремонта', min: 4000, max: 12000, termOptions: ['за 1 день', '1–2 дня'], question1Options: ['Стандартная', 'Генеральная', 'После ремонта'] },
  { match: /торт/, label: 'Торт на заказ', min: 2000, max: 6000, unit: 'за торт 2–3 кг', termOptions: ['3–5 дней', 'к дате'], question1Options: ['Детский', 'Свадебный', 'Авторский дизайн'] },
  { match: /штор/, label: 'Пошив штор', min: 6000, max: 25000, termOptions: ['1–2 недели', '2–3 недели'], question1Options: ['Стандартные', 'С ламбрекеном', 'Римские/роллеты'] },
  { match: /кондиционер/, label: 'Установка кондиционера', min: 28000, max: 70000, unit: 'вместе с техникой', termOptions: ['2–4 дня', 'неделя'], question1Options: ['Только монтаж', 'Техника + монтаж', 'Демонтаж старого'] },
  { match: /стиральн/, label: 'Ремонт стиральной машины', min: 1500, max: 5000, termOptions: ['сегодня–завтра', '1–2 дня'], question1Options: ['Не сливает/не греет', 'Течёт', 'Не включается'] },
  { match: /сайт/, label: 'Сайт для малого бизнеса', min: 30000, max: 150000, termOptions: ['2–4 недели', '1–1,5 месяца'], question1Options: ['Сайт-визитка', 'Интернет-магазин', 'Лендинг'] },
  { match: /контекстн.*реклам|директ/, label: 'Настройка контекстной рекламы', min: 25000, max: 90000, unit: 'в месяц, ведение', termOptions: ['запуск за 5–7 дней', 'запуск за 2 недели'], question1Options: ['Только запуск', 'Запуск + ведение', 'Аудит текущей'] },
  { match: /логотип/, label: 'Дизайн логотипа', min: 5000, max: 40000, termOptions: ['5–10 дней', '2 недели'], question1Options: ['Только логотип', 'Логотип + фирменный стиль', 'Редизайн'] },
  { match: /репетитор/, label: 'Репетитор по математике', min: 900, max: 2500, unit: 'за занятие 60 мин', termOptions: ['2–3 раза в неделю', 'интенсив к экзамену'], question1Options: ['ОГЭ', 'ЕГЭ', 'Подтянуть школьную программу'] },
  { match: /маникюр/, label: 'Маникюр с выездом', min: 1500, max: 3500, termOptions: ['сегодня–завтра', 'в выходные'], question1Options: ['Классический', 'С покрытием', 'Дизайн'] },
  { match: /ландшафт/, label: 'Ландшафтный дизайн участка', min: 90000, max: 400000, termOptions: ['1–2 месяца', 'сезон'], question1Options: ['Проект', 'Проект + реализация', 'Частичное благоустройство'] },
]

export const DEFAULT_NICHE: NicheSpec = {
  match: /$^/,
  label: 'Услуга',
  min: 5000,
  max: 40000,
  termOptions: ['1–2 недели', '2–4 недели'],
  question1Options: ['Минимальный объём', 'Стандартный объём', 'Под ключ'],
}

export function findNiche(query: string): NicheSpec {
  const q = normalize(query)
  return SERVICE_NICHES.find((n) => n.match.test(q)) ?? DEFAULT_NICHE
}

export const COMPANY_POOL: string[] = [
  'Мастер Плюс',
  'Домашние Решения',
  'ПрофиГрад',
  'Сервис One',
  'Уют и Порядок',
  'Гарант Сервис',
  'ТехноДом',
  'Люди Дела',
  'Аккурат',
  'Порядок Про',
  'Городская Служба',
  'Атлас',
  'Домовой',
  'РеМонтаж',
  'Команда 9',
  'Твой Мастер',
  'Формат',
  'Основа',
  'Свежий Взгляд',
  'Надёжные Руки',
]
