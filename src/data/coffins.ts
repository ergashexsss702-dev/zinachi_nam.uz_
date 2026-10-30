import { CoffinDesign } from '../types';

export const NAMANGAN_COFFIN_DESIGNS: CoffinDesign[] = [
  {
    id: 'tobut-namangan-standart',
    nameUz: 'Namangancha Standart Yog‘och Tobut',
    nameEn: 'Namangan Traditional Standard Wooden Coffin',
    nameRu: 'Традиционный наманганский стандартный деревянный тобут',
    category: 'tobut',
    descriptionUz: 'Namangan viloyatida azaldan qo‘llanib kelinayotgan an’anaviy qat’iy me’yorlar asosida tayyorlangan, mustahkam tutqichli tobut.',
    descriptionEn: 'Handcrafted strictly according to traditional Namangan woodcraft standards with reinforced carrying handles.',
    descriptionRu: 'Изготовлен строго по традиционным наманганским канонам с усиленными несущими ручками.',
    isNamanganVerified: true,
    imagePlaceholderNote: 'Namangancha tobut rasmi administrator tomonidan qo‘shiladi.',
    materialOptionsUz: ['Quritilgan terak yog‘ochi', 'Tabiiy qarag‘ay', 'Yong‘oq detallari'],
  },
  {
    id: 'tobut-namangan-qalin',
    nameUz: 'Namangancha Qalin Mustahkam Yog‘och Tobut',
    nameEn: 'Namangan Reinforced Heavy Timber Coffin',
    nameRu: 'Наманганский усиленный деревянный тобут из отборного бруса',
    category: 'tobut',
    descriptionUz: 'Qalin va sifatli quritilgan yog‘ochdan ishlangan, og‘ir vaznga chidamli, an’anaviy toza silliqlangan tobut.',
    descriptionEn: 'Crafted from seasoned heavy timber with double-pegged joinery for long-distance respectful transfer.',
    descriptionRu: 'Усиленная конструкция из плотной высушенной древесины с надежными шиповыми соединениями.',
    isNamanganVerified: true,
    imagePlaceholderNote: 'Namangancha tobut rasmi administrator tomonidan qo‘shiladi.',
    materialOptionsUz: ['Qalin qayin va terak', 'Tog‘ qarag‘ayi', 'Qayta ishlangan yong‘oq'],
  },
  {
    id: 'tobut-namangan-yengil',
    nameUz: 'Namangancha Yengil va Silliq Yog‘och Tobut',
    nameEn: 'Namangan Lightweight Seasoned Poplar Coffin',
    nameRu: 'Наманганский облегченный шлифованный тобут',
    category: 'tobut',
    descriptionUz: 'Yengil, qo‘lda olib yurishga o‘ta qulay, barcha burchaklari ehtiyotkorlik bilan yumaloqlangan an’anaviy model.',
    descriptionEn: 'Lightweight seasoned wood construction designed for ease of carrying with carefully rounded ergonomic edges.',
    descriptionRu: 'Легкая и удобная конструкция со сглаженными углами, облегчающая бережное перемещение.',
    isNamanganVerified: true,
    imagePlaceholderNote: 'Namangancha tobut rasmi administrator tomonidan qo‘shiladi.',
    materialOptionsUz: ['Maxsus saralangan yengil terak', 'Qarag‘ay'],
  },
  {
    id: 'tobut-namangan-an’anaviy-ustaxonasi',
    nameUz: 'Namangancha Maxsus Buyurtma Yog‘och Tobut',
    nameEn: 'Namangan Custom Bespoke Traditional Coffin',
    nameRu: 'Наманганский традиционный тобут по индивидуальному заказу',
    category: 'tobut',
    descriptionUz: 'Masjid, mahalla yoki oilaviy ehtiyojlar uchun aniq o‘lcham va maxsus talablar asosida tayyorlanadi.',
    descriptionEn: 'Custom built for mosques, community mahallas, or family requirements to exact dimensions.',
    descriptionRu: 'Изготовление под индивидуальные размеры для махалли или мечети по строгим традиционным нормам.',
    isNamanganVerified: true,
    imagePlaceholderNote: 'Namangancha tobut rasmi administrator tomonidan qo‘shiladi.',
    materialOptionsUz: ['Yong‘oq', 'Terak', 'Qarag‘ay'],
  },
];

export const COFFIN_WOOD_OPTIONS = [
  { id: 'wood-terak', nameUz: 'Terak yog‘ochi (Eng an’anaviy va yengil)', nameEn: 'Seasoned Poplar (Traditional & Lightweight)', nameRu: 'Высушенный тополь (Традиционный и легкий)' },
  { id: 'wood-qoragay', nameUz: 'Qarag‘ay yog‘ochi (Xushbo‘y va mustahkam)', nameEn: 'Nordic Pine (Resilient and fragrant)', nameRu: 'Сосна (Прочная и долговечная)' },
  { id: 'wood-yongoq', nameUz: 'Yong‘oq yog‘ochi (Maxsus buyurtma, o‘ta mustahkam)', nameEn: 'Walnut Hardwood (Custom order, ultra-dense)', nameRu: 'Массив ореха (Премиум заказ, наивысшая прочность)' },
];

export const COFFIN_FINISH_OPTIONS = [
  { id: 'fin-natural', nameUz: 'Tabiiy silliqlangan (Hech qanday bo‘yoqsiz)', nameEn: 'Natural Fine-Sanded (Unfinished)', nameRu: 'Естественная тонкая шлифовка' },
  { id: 'fin-protective', nameUz: 'Maxsus himoya qoplamali (Tabiiy moy bilan)', nameEn: 'Protective Organic Oil Rub', nameRu: 'Защитная органическая пропитка' },
  { id: 'fin-amber', nameUz: 'An’anaviy sarg‘ish-jigarrang tus', nameEn: 'Traditional Warm Amber Hue', nameRu: 'Традиционный золотисто-янтарный оттенок' },
  { id: 'fin-matte-wax', nameUz: 'Mat tabiiy mum bilan ishlov berilgan', nameEn: 'Matte Natural Beeswax Rub', nameRu: 'Матовое покрытие натуральным воском' },
];
