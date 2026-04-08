
import { MarketplaceCategory } from './types';

export const CATEGORY_FILTERS = {
  [MarketplaceCategory.TECH]: [
    'Gaming', 'Office Laptop', 'Developer', 'Mobile', 'Networking', 'Peripherals'
  ],
  [MarketplaceCategory.MEDIA]: [
    'Print', 'Stationery', 'Apparel', 'Branded ID', 'Promotional Items'
  ],
  [MarketplaceCategory.CULINARY]: [
    'Meals', 'Ingredients', 'Beverages', 'Snacks'
  ]
};

export const TECH_TYPES = ['Phone', 'Laptop', 'Tablet', 'Desktop', 'Console', 'Accessory'];
export const TECH_CONDITIONS = ['New', 'Refurbished', 'Used'];

export const MEDIA_SUBTYPES = {
  Print: ['Poster', 'Flyer', 'Brochure', 'Booklet', 'Banner'],
  Stationery: ['Notebook', 'Pen', 'Envelope', 'Sticker'],
  Apparel: ['T-Shirt', 'Hoodie', 'Cap'],
  BrandedID: ['ID Card', 'Lanyard', 'Badge Holder']
};

export const CULINARY_CUISINES = ['Local', 'Continental', 'Asian', 'Mediterranean', 'Intercontinental'];
export const CULINARY_DIETARY = ['Vegan', 'Halal', 'Gluten-Free', 'Keto', 'Vegetarian', 'Paleo'];
export const SPICE_LEVELS = ['None', 'Mild', 'Medium', 'Hot', 'Extra Hot'];

export const BRANDS = ['MON BIENS', 'TECH', 'MEDIA', 'BLXRK'];
export const LEAD_STAGES = ['INGESTION', 'CONTACTED', 'FOLLOW_UP', 'CONVERTED', 'LOST'];
