import { apiClient } from './apiClient';
import { MarketplaceItem, MarketplaceCategory, TechItem, MediaItem, CulinaryItem } from '../types';

const mapFrontendToBackend = (item: Partial<MarketplaceItem>, category: MarketplaceCategory) => {
    const common = {
        name: item.name,
        price: item.price,
        sale_price: item.salePrice,
        status: item.status,
        base_category: item.baseCategory || category,
        is_offer: item.isOffer,
        description: item.description,
        images: item.images,
        vertical_type: category.toLowerCase(),
    };

    let vertical_data = {};

    if (category === MarketplaceCategory.TECH) {
        const tech = item as TechItem;
        vertical_data = {
            brand: tech.brand,
            type: tech.type,
            condition: tech.condition,
            warranty: {
                has_warranty: tech.warranty?.hasWarranty,
                warranty_months: tech.warranty?.warranty_months
            },
            specs: tech.specs || [],
            categories: tech.categories || []
        };
    } else if (category === MarketplaceCategory.MEDIA) {
        const media = item as MediaItem;
        vertical_data = {
            material: media.material,
            customizable: media.customizable,
            lead_time: media.leadTime,
            specs: media.specs || [],
            categories: media.categories || []
        };
    } else if (category === MarketplaceCategory.CULINARY) {
        const culinary = item as CulinaryItem;
        vertical_data = {
            cuisine_type: culinary.cuisineType,
            spice_level: culinary.spiceLevel,
            ingredients: culinary.ingredients || [],
            categories: culinary.categories || []
        };
    }

    return { ...common, vertical_data };
};

const mapBackendToFrontend = (res: any, category: MarketplaceCategory): MarketplaceItem => {
    const common = {
        ...res,
        salePrice: res.sale_price,
        baseCategory: res.base_category,
        isOffer: res.is_offer,
        marketplace: category,
        audit: {
            createdAt: res.created_at || new Date().toISOString(),
            createdBy: res.created_by || 'Unknown',
            updatedAt: res.updated_at || new Date().toISOString(),
            updatedBy: res.updated_by || 'Unknown'
        }
    };

    if (category === MarketplaceCategory.TECH && res.vertical_data) {
        return {
            ...common,
            ...res.vertical_data,
            warranty: {
                hasWarranty: res.vertical_data.warranty?.has_warranty,
                warranty_months: res.vertical_data.warranty?.warranty_months
            }
        } as TechItem;
    }

    if (category === MarketplaceCategory.MEDIA && res.vertical_data) {
        return {
            ...common,
            ...res.vertical_data,
            leadTime: res.vertical_data.lead_time
        } as MediaItem;
    }

    if (category === MarketplaceCategory.CULINARY && res.vertical_data) {
        return {
            ...common,
            ...res.vertical_data,
            cuisineType: res.vertical_data.cuisine_type,
            spiceLevel: res.vertical_data.spice_level
        } as CulinaryItem;
    }

    return common as MarketplaceItem;
};

export const inventoryService = {
    async getItems(category: MarketplaceCategory): Promise<MarketplaceItem[]> {
        const vertical = category.toLowerCase();
        const data = await apiClient(`/items/vertical/${vertical}`);
        return (data.items || data).map((item: any) => mapBackendToFrontend(item, category));
    },

    async getAllItems(): Promise<MarketplaceItem[]> {
        const data = await apiClient(`/items/`);
        // Note: The /items/ endpoint returns generic data, we map based on its vertical_type
        return (data.items || data).map((item: any) => {
            const cat = item.vertical_type?.toUpperCase() as MarketplaceCategory || MarketplaceCategory.TECH;
            return mapBackendToFrontend(item, cat);
        });
    },

    async saveItem(item: Partial<MarketplaceItem>, category: MarketplaceCategory): Promise<MarketplaceItem> {
        const isNew = !item.id || item.id.length < 10;
        const method = isNew ? 'POST' : 'PUT';
        const url = isNew ? `/items/` : `/items/${item.id}`;

        const payload = mapFrontendToBackend(item, category);
        const res = await apiClient(url, {
            method,
            body: JSON.stringify(payload),
        });

        return mapBackendToFrontend(res, category);
    },

    async deleteItem(id: string, _category: MarketplaceCategory): Promise<void> {
        await apiClient(`/items/${id}`, {
            method: 'DELETE',
        });
    },

    async deleteImage(itemId: string, imageUrl: string): Promise<void> {
        await apiClient(`/items/${itemId}/images?image_url=${encodeURIComponent(imageUrl)}`, {
            method: 'DELETE',
        });
    }
};
