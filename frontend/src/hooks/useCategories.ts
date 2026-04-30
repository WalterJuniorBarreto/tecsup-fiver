import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/category.service';
import { CategoryData, CreateCategoryDTO, UpdateCategoryDTO } from '../types/category.types';

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error cargando categorías");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const addCategory = async (data: CreateCategoryDTO) => {
    await categoryService.createCategory(data);
    await loadCategories(); // Recargamos la lista
  };

  const editCategory = async (id: string, data: UpdateCategoryDTO) => {
    await categoryService.updateCategory(id, data);
    await loadCategories();
  };

  const removeCategory = async (id: string) => {
    await categoryService.deleteCategory(id);
    await loadCategories();
  };

  return {
    categories,
    isLoading,
    error,
    addCategory,
    editCategory,
    removeCategory,
    refreshCategories: loadCategories
  };
};