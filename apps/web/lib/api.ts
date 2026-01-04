import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_URL,
});

export const signup = async (email: string, orgName: string, password?: string) => {
    const response = await api.post('/auth/signup', { email, orgName, password });
    return response.data;
};

export const login = async (email: string, password?: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const createToken = async (userId: string, name: string) => {
    const response = await api.post('/auth/token', { userId, name });
    return response.data;
};

export const deleteToken = async (id: string, token: string) => {
    // We need to pass the session token header
    const response = await api.delete(`/auth/tokens/${id}`, {
        headers: { Authorization: token }
    });
    return response.data;
};

export const listComponents = async (orgName: string) => {
    const response = await api.get(`/components/${orgName}`);
    return response.data;
};

export const githubLogin = async (code: string) => {
    const response = await api.post('/auth/github', { code });
    return response.data;
};

// Helper to get token
const getToken = () => {
    if (typeof window === 'undefined') return '';
    const stored = localStorage.getItem('tricox_user');
    if (!stored) return '';
    try {
        const u = JSON.parse(stored);
        return u.token || '';
    } catch { return ''; }
};

export const listUsers = async () => {
    const token = getToken();
    const response = await api.get('/auth/users', { headers: { Authorization: token } });
    return response.data;
};

export const deleteUser = async (id: string) => {
    const token = getToken();
    const response = await api.delete(`/auth/users/${id}`, { headers: { Authorization: token } });
    return response.data;
};

export const listAllComponents = async () => {
    const token = getToken();
    const response = await api.get('/components', { headers: { Authorization: token } });
    return response.data;
};

export const changePassword = async (userId: string, oldPass: string, newPass: string) => {
    const response = await api.post('/auth/change-password', { userId, oldPass, newPass });
    return response.data;
};

export const listTokens = async (userId: string) => {
    const response = await api.get(`/auth/tokens/${userId}`);
    return response.data;
};

export const deleteComponent = async (id: string, token: string) => {
    const response = await api.delete(`/components/${id}`, {
        headers: { Authorization: token }
    });
    return response.data;
};

export const getComponentDetails = async (id: string) => {
    const response = await api.get(`/components/details/${id}`);
    return response.data;
};

export const updateComponent = async (id: string, content: string) => {
    // Need auth header? api instance doesn't have it by default unless set.
    // We should pass it or rely on global interceptor.
    // For now, let's pass token manually?
    // Actually, `api.ts` initialized `axios.create` without headers.
    // The previous calls didn't need it except `ship` usually.
    // Wait, `ship` command is CLI based. 
    // `listComponents` is public.
    // `deleteComponent` SHOULD be protected but isn't checked in controller (comment says "In prod check permissions").
    // `updateComponent` IS protected now.

    // We need to retrieve token from localStorage.
    const token = getToken();
    const response = await api.post(`/components/${id}`, { content }, {
        headers: { Authorization: token }
    });
    return response.data;
};

export const getSystemStats = async () => {
    const token = getToken();
    const response = await api.get('/components/dashboard/stats', { headers: { Authorization: token } });
    return response.data;
};
