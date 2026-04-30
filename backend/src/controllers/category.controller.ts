import { Request, Response } from 'express';
import { categoryService } from '../services/category.service.js';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const isAdmin = (req as any).user?.role === 'ADMIN'; 
    const categories = await categoryService.getAllCategories(isAdmin);
    res.status(200).json({ status: 'success', data: categories });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ status: 'success', message: 'Categoría creada', data: category });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const category = await categoryService.updateCategory(id, req.body);
    res.status(200).json({ status: 'success', message: 'Categoría actualizada', data: category });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await categoryService.deleteCategory(id);
    res.status(200).json({ status: 'success', message: 'Categoría gestionada correctamente' });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};