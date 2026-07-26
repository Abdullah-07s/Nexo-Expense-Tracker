import apiClient from './client';

export const getExpenses = (params = {}) => apiClient.get('/expenses', { params });
export const createExpense = (data) => apiClient.post('/expenses', data);
export const updateExpense = (id, data) => apiClient.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => apiClient.delete(`/expenses/${id}`);