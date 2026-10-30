export type ProductCategory = 'zina' | 'mdf' | 'tobut';

export type OrderStatus =
  | 'yangi'
  | 'qabul_qilindi'
  | 'jarayonda'
  | 'tayyor'
  | 'yetkazildi'
  | 'bekor_qilindi';

export interface StaircaseDesign {
  id: string;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  category: 'zina';
  descriptionUz: string;
  descriptionEn: string;
  descriptionRu: string;
  image: string;
  badge?: string;
  featuresUz: string[];
  featuresEn: string[];
  isCustomerPortfolio?: boolean;
}

export interface DoorDesign {
  id: string;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  category: 'mdf';
  descriptionUz: string;
  descriptionEn: string;
  descriptionRu: string;
  image: string;
  badge?: string;
  finishes: string[];
}

export interface CoffinDesign {
  id: string;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  category: 'tobut';
  descriptionUz: string;
  descriptionEn: string;
  descriptionRu: string;
  isNamanganVerified: boolean;
  imagePlaceholderNote: string;
  customImage?: string;
  materialOptionsUz: string[];
}

export interface WoodMaterial {
  id: string;
  code: string;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  descriptionUz: string;
  descriptionEn: string;
  descriptionRu: string;
  colorSample: string;
}

export interface ColorFinish {
  id: string;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  colorHex: string;
  woodTexture: string;
}

export interface CustomerOrder {
  id: string;
  category: ProductCategory;
  productTitle: string;
  productDesignId: string;
  woodMaterial?: string;
  selectedColors: string[];
  customerName: string;
  phoneNumber: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  district: string;
  fullAddress: string;
  locationCoordinates?: string;
  measurements?: string;
  quantity?: number;
  doorMaterialFinish?: string;
  additionalNotes?: string;
  status: OrderStatus;
  createdAt: string;
  telegramDelivered: boolean;
}

export interface CountryInfo {
  name: string;
  iso2: string;
  dialCode: string;
  flag: string;
}
