import { apiClient } from './apiClient';

export interface TokenResponse {
    access_token: string;
    token_type: string;
    role: string;
}

export const authService = {
    async login(email: string, pin: string): Promise<TokenResponse> {
        return apiClient('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, pin }),
        });
    },

    async superAdminLogin(email: string, pin: string): Promise<TokenResponse> {
        return apiClient('/auth/login/super-admin', {
            method: 'POST',
            body: JSON.stringify({ email, pin }),
        });
    },

    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('auth_token');
    },

    getRole(): string | null {
        return localStorage.getItem('user_role');
    }
};
