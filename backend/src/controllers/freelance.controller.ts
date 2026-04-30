import { AuthRequest } from '../middlewares/auth.middleware.js';
import { freelanceService, CreateServiceDTO } from '../services/freelance.service.js';
import prisma from '../config/db.js';
import { Request, Response } from 'express';

export const createService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sellerId = (req.user as any).sub || (req.user as any).id;
    
    const serviceData: CreateServiceDTO = {
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      deliveryDays: req.body.deliveryDays ? Number(req.body.deliveryDays) : 1,
      image: req.body.image,
      categoryId: req.body.categoryId
    };

    const newService = await freelanceService.createService(sellerId, serviceData);

    res.status(201).json({ 
      status: 'success', 
      message: 'Servicio publicado exitosamente',
      data: newService 
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ 
      status: 'error', 
      code: error.code || 'INTERNAL_ERROR',
      message: error.message 
    });
  }
};

export const getMyServices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sellerId = (req.user as any).sub || (req.user as any).id;
    const services = await freelanceService.getMyServices(sellerId);
    
    res.status(200).json({ status: 'success', data: services });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getServiceStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sellerId = (req.user as any).sub || (req.user as any).id;
    const stats = await freelanceService.getSellerStats(sellerId);
    
    res.status(200).json({ status: 'success', data: stats });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getExploreServices = async (req: any, res: any): Promise<void> => {
  try {
    const services = await prisma.service.findMany({
      where: { isPublished: true }, 
      orderBy: { createdAt: 'desc' },
      include: {
        seller: { 
          select: { name: true, username: true, avatar: true } 
        },
        category: { 
          select: { id: true, name: true, slug: true }
        }
      }
    });
    
    res.status(200).json({ status: 'success', data: services });
  } catch (error: any) {
    console.error("Error en getExploreServices:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};


export const updateService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sellerId = (req.user as any).sub || (req.user as any).id;
    const id = req.params.id as string;
    
    const updatedService = await freelanceService.updateService(id, sellerId, req.body);

    res.status(200).json({ status: 'success', message: 'Servicio actualizado', data: updatedService });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};

export const deleteService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sellerId = (req.user as any).sub || (req.user as any).id;
    const id = req.params.id as string;

    await freelanceService.deleteService(id, sellerId);

    res.status(200).json({ status: 'success', message: 'Servicio eliminado correctamente' });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await freelanceService.getServiceById(req.params.id as string);
    res.status(200).json({ status: 'success', data: service });
  } catch (error: any) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};