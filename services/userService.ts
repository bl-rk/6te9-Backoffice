import { apiClient } from './apiClient';
import { User, UserStatus } from '../types';

export interface CreateUserRequest {
    email: string;
    name: string;
    role: string;
}

export const userService = {
    async getUsers(): Promise<User[]> {
        const data = await apiClient('/auth/admin/users');
        const rawUsers = data.users || [];
        return rawUsers.map((u: any) => ({
            id: u.id,
            email: u.email,
            name: u.name,
            role: (u.role || 'ADMIN').toUpperCase().replace('_', '_'),
            status: u.status.toUpperCase() as UserStatus,
            dateAdded: u.created_at || u.enrolled_at || new Date().toISOString()
        }));
    },

    async createUser(data: CreateUserRequest): Promise<User & { enrollment_token?: string }> {
        const res = await apiClient('/auth/admin/users', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return {
            id: res.id,
            email: res.email,
            name: res.name,
            role: (res.role || data.role || 'ADMIN').toUpperCase().replace('_', '_'),
            status: res.status.toUpperCase() as UserStatus,
            dateAdded: res.created_at || new Date().toISOString(),
            enrollment_token: res.enrollment_token
        };
    },

    async updateStatus(userId: string, status: string): Promise<void> {
        await apiClient(`/auth/admin/users/${userId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: status.toLowerCase() }),
        });
    },

    async deleteUser(userId: string): Promise<void> {
        await apiClient(`/auth/admin/users/${userId}`, {
            method: 'DELETE',
        });
    },

    async resetTOTP(userId: string): Promise<{ enrollment_token: string }> {
        return await apiClient(`/auth/admin/users/${userId}/reset-totp`, {
            method: 'POST',
        });
    },

    async getEnrollmentData(token: string): Promise<{ name: string; email: string; qr_code: string }> {
        return await apiClient(`/auth/enroll?token=${token}`);
    },

    async confirmEnrollment(token: string, pin: string): Promise<void> {
        await apiClient('/auth/enroll/confirm', {
            method: 'POST',
            body: JSON.stringify({ enrollment_token: token, pin }),
        });
    }
};
