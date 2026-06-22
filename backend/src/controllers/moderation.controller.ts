import { Request, Response } from 'express';
import { moderationService } from '../services/moderation.service.js';

export const moderationController = {
  
  submitReport: async (req: Request, res: Response) => {
    try {
      const reporterId = (req as any).user?.id || (req as any).user?.sub;
      const { reason, targetType, targetId } = req.body;

      if (!reporterId) return res.status(401).json({ success: false, error: 'No autorizado' });
      if (!reason || !targetType || !targetId) return res.status(400).json({ success: false, error: 'Faltan datos obligatorios' });

      const report = await moderationService.createReport(reporterId, reason, targetType, targetId);
      res.status(201).json({ success: true, message: 'Reporte enviado al equipo de moderación', data: report });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  getAdminReports: async (req: Request, res: Response) => {
    const userRole = (req as any).user?.role;
    if (userRole !== 'ADMIN') return res.status(403).json({ success: false, error: 'Acceso denegado' });

    try {
      const { status } = req.query;
      const reports = await moderationService.getReports(status as string);
      res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

resolveReport: async (req: Request, res: Response) => {
    const userRole = (req as any).user?.role;
    if (userRole !== 'ADMIN') return res.status(403).json({ success: false, error: 'Acceso denegado' });

    try {
      const { status } = req.body; 
      const updatedReport = await moderationService.updateReportStatus(String(req.params.id), status);
      res.status(200).json({ success: true, message: 'Estado del reporte actualizado', data: updatedReport });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};