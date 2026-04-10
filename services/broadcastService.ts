import { apiClient } from './apiClient';
import { MarketplaceCategory, NewsOffer } from '../types';

const mapBackendToFrontend = (res: any): NewsOffer => ({
    id: res.id,
    title: res.title,
    offerInfo: res.offer_info,
    category: res.category as MarketplaceCategory,
    validityPeriod: res.validity_period || 'Permanent',
    createdAt: res.created_at
});

const mapFrontendToBackend = (offer: Partial<NewsOffer>) => ({
    title: offer.title,
    offer_info: offer.offerInfo,
    category: offer.category,
    validity_period: offer.validityPeriod
});

export const broadcastService = {
    async getBroadcasts(): Promise<NewsOffer[]> {
        const data = await apiClient('/broadcasts/');
        return (data.items || data).map(mapBackendToFrontend);
    },

    async saveBroadcast(offer: Partial<NewsOffer>): Promise<NewsOffer> {
        const isNew = !offer.id;
        const method = isNew ? 'POST' : 'PUT';
        const url = isNew ? '/broadcasts/' : `/broadcasts/${offer.id}`;

        const payload = mapFrontendToBackend(offer);
        const res = await apiClient(url, {
            method,
            body: JSON.stringify(payload)
        });

        return mapBackendToFrontend(res);
    },

    async deleteBroadcast(id: string): Promise<void> {
        await apiClient(`/broadcasts/${id}`, {
            method: 'DELETE'
        });
    }
};
