import apiClient from './client';

export const getBudgets = (month) => apiClient.get('/budgets', { params: { month } });
export const createBudget = (data) => apiClient.post('/budgets', data);
export const updateBudget = (id, data) => apiClient.put(`/budgets/${id}`, data);
export const deleteBudget = (id) => apiClient.delete(`/budgets/${id}`);