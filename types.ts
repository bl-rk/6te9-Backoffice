export enum MarketplaceCategory {
  TECH = 'TECH',
  MEDIA = 'MEDIA',
  CULINARY = 'CULINARY'
}

export enum ItemStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export interface SpecValue {
  value: string;
  amount?: number;
}

export interface SpecEntry extends SpecValue {
  key: string;
}

export interface KeyValueMap {
  [key: string]: string | number | boolean | SpecValue;
}

export interface AuditTrail {
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  publishedAt?: string;
  publishedBy?: string;
}

export interface BaseItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  isOffer: boolean;
  description: string;
  baseCategory: string;
  status: ItemStatus;
  images: string[];
  freeDeliveryLagos: boolean;
  originalPackaging: boolean;
  audit: AuditTrail;
}

export interface TechItem extends BaseItem {
  marketplace: MarketplaceCategory.TECH;
  categories: string[];
  type: string;
  condition: 'New' | 'Refurbished' | 'Used' | 'For Parts';
  brand: string;
  color: string;
  size: string;
  screenSize?: number;
  weight: number;
  warranty: {
    hasWarranty: boolean;
    duration?: string;
    warranty_months?: number;
  };
  specs: SpecEntry[];
}

export interface MediaItem extends BaseItem {
  marketplace: MarketplaceCategory.MEDIA;
  categories: string[];
  subType: string;
  brandOrg?: string;
  material: string;
  finish: string;
  color: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  weight: number;
  customizable: boolean;
  productionMethod: string;
  printArea?: string;
  customizationOptions: string[];
  minOrderQuantity: number;
  leadTime: number;
  packagingType: string;
  specs: SpecEntry[];
}

export interface CulinaryItem extends BaseItem {
  marketplace: MarketplaceCategory.CULINARY;
  categories: string[];
  cuisineType: string;
  dietaryTags: string[];
  preparationType: 'Ready-to-Eat' | 'Raw' | 'Frozen';
  spiceLevel: 'None' | 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  portionSize: string;
  ingredients: string[];
  allergens: string[];
  nutritionalInfo: KeyValueMap;
  weightVolume: string;
  shelfLife: string;
  storageInstructions: string;
  preparationInstructions: string;
  availabilityWindow: string;
  deliveryConstraints: string;
}

export type MarketplaceItem = TechItem | MediaItem | CulinaryItem;

export type ViewType = 'DASHBOARD' | 'INVENTORY' | 'ANALYTICS' | 'SETTINGS' | 'LEADS' | 'WHATSAPP' | 'NEWS';

export enum LeadStage {
  INGESTION = 'INGESTION',
  CONTACTED = 'CONTACTED',
  FOLLOW_UP = 'FOLLOW_UP',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST'
}

export type Brand = 'MON BIENS' | 'TECH' | 'MEDIA' | 'BLXRK';

export interface Lead {
  id: string;
  mobile: string;
  email: string;
  brand: Brand;
  category: string;
  stage: LeadStage;
  info: string;
  createdAt: string;
}

export interface NewsOffer {
  id: string;
  title: string;
  offerInfo: string;
  category: MarketplaceCategory;
  validityPeriod: string;
  createdAt: string;
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface User {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EDITOR';
  name: string;
  status: UserStatus;
  dateAdded: string;
}