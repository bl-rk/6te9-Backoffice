import { apiClient } from './apiClient';
import { Lead, LeadStage, Brand } from '../types';

const mapBackendToFrontend = (res: any): Lead => ({
    id: res.id,
    mobile: res.mobile,
    email: res.email,
    brand: res.brand as Brand,
    category: res.category,
    stage: res.stage as LeadStage,
    info: res.info || '',
    createdAt: res.created_at
});

const mapFrontendToBackend = (lead: Partial<Lead>) => ({
    mobile: lead.mobile,
    email: lead.email,
    brand: lead.brand,
    category: lead.category,
    stage: lead.stage,
    info: lead.info
});

export const leadService = {
    async getLeads(): Promise<Lead[]> {
        const data = await apiClient('/leads/');
        return (data.items || data).map(mapBackendToFrontend);
    },

    async saveLead(lead: Partial<Lead>): Promise<Lead> {
        const isNew = !lead.id;
        const method = isNew ? 'POST' : 'PUT';
        const url = isNew ? '/leads/' : `/leads/${lead.id}`;

        const payload = mapFrontendToBackend(lead);
        const res = await apiClient(url, {
            method,
            body: JSON.stringify(payload)
        });

        return mapBackendToFrontend(res);
    },

    async updateLeadStage(id: string, stage: LeadStage): Promise<Lead> {
        const res = await apiClient(`/leads/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ stage })
        });
        return mapBackendToFrontend(res);
    },

    async deleteLead(id: string): Promise<void> {
        await apiClient(`/leads/${id}`, {
            method: 'DELETE'
        });
    }
};
