import apiClient from './client';

export const getMonthlySummary = (month) => apiClient.get('/summary', { params: { month } });
