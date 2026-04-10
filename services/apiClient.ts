const BASE_URL = 'http://127.0.0.1:8000/api/v1';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('auth_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
            status: response.status,
            message: errorData.detail || 'API Request Failed',
            detail: errorData.detail
        };
    }

    if (response.status === 204) return null;
    return response.json();
};
