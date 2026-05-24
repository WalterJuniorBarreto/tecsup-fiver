import { Request, Response } from 'express';
import { earningService } from '../services/earning.service.js';

export const earningController = {
  getSummary: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id || (req as any).user.sub;
      const data = await earningService.getSummary(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getTransactions: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id || (req as any).user.sub;
      const data = await earningService.getTransactions(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  requestWithdrawal: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id || (req as any).user.sub;
      const { amount, destination } = req.body;
      const data = await earningService.requestWithdrawal(userId, amount, destination);
      res.status(200).json({ success: true, data, message: 'Retiro en proceso' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};