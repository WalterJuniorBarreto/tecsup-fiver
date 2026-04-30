import { api } from '../config/axios';
import { getAuthHeader } from '../lib/auth';
import { CategoryData, CreateCategoryDTO, UpdateCategoryDTO } from '../types/category.types';

export const categoryService = {
  getAllCategories: async (): Promise<CategoryData[]> => {
    const response = await api.get('/api/categories');
    return response.data.data;
  },

  createCategory: async (data: CreateCategoryDTO): Promise<CategoryData> => {
    const response = await api.post('/api/categories', data, { headers: getAuthHeader() });
    return response.data.data;
  },

  updateCategory: async (id: string, data: UpdateCategoryDTO): Promise<CategoryData> => {
    const response = await api.put(`/api/categories/${id}`, data, { headers: getAuthHeader() });
    return response.data.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/api/categories/${id}`, { headers: getAuthHeader() });
  }
};