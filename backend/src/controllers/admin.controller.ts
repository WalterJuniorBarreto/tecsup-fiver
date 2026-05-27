import { Request, Response } from 'express';
import { adminService } from '../services/admin.service.js';

export const adminController = {
  // Middleware/Helper interno para verificar si es ADMIN
  checkAdmin: (req: Request, res: Response) => {
    const userRole = (req as any).user?.role;
    if (userRole !== 'ADMIN') {
      res.status(403).json({ success: false, error: 'Acceso denegado. Se requieren permisos de Administrador.' });
      return false;
    }
    return true;
  },

  getUsers: async (req: Request, res: Response) => {
    if (!adminController.checkAdmin(req, res)) return;
    try {
      const users = await adminService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createUser: async (req: Request, res: Response) => {
    if (!adminController.checkAdmin(req, res)) return;
    try {
      const newUser = await adminService.createUser(req.body);
      res.status(201).json({ success: true, message: 'Usuario creado', data: newUser });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    if (!adminController.checkAdmin(req, res)) return;
    try {
      const updatedUser = await adminService.updateUser(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Usuario actualizado', data: updatedUser });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  toggleStatus: async (req: Request, res: Response) => {
    if (!adminController.checkAdmin(req, res)) return;
    try {
      const user = await adminService.toggleUserStatus(req.params.id);
      res.status(200).json({ success: true, message: `Usuario ${user.isActive ? 'reactivado' : 'suspendido'}`, data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },


  // Agregar dentro de adminController:
  getServices: async (req: Request, res: Response) => {
    if (!adminController.checkAdmin(req, res)) return;
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;
      const search = req.query.search as string || '';

      const data = await adminService.getServicesPaginated(page, limit, search);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  toggleService: async (req: Request, res: Response) => {
    if (!adminController.checkAdmin(req, res)) return;
    try {
      const service = await adminService.toggleServiceStatus(req.params.id);
      res.status(200).json({ success: true, message: `Servicio ${service.isPublished ? 'activado' : 'suspendido'}`, data: service });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },


  getFinances: async (req: Request, res: Response) => {
    if (!adminController.checkAdmin(req, res)) return;
    try {
      const data = await adminService.getFinancialSummary();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },


  getDashboardStats: async (req: Request, res: Response) => {
    if (!adminController.checkAdmin(req, res)) return;
    try {
      const data = await adminService.getDashboardStats();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};