import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { chatService } from '../services/chat.service.js';
import prisma from '../config/db.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

export const getMyChats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any).sub || (req.user as any).id;
    const chats = await chatService.getMyConversations(userId);
    res.status(200).json({ status: 'success', data: chats });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any).sub || (req.user as any).id;
    const conversationId = req.params.conversationId as string;
    const messages = await chatService.getConversationHistory(conversationId, userId);
    res.status(200).json({ status: 'success', data: messages });
  } catch (error: any) {
    res.status(403).json({ status: 'error', message: error.message });
  }
};

export const deleteChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any).sub || (req.user as any).id;
    const conversationId = req.params.conversationId as string;
    await chatService.deleteConversation(conversationId, userId);
    res.status(200).json({ status: 'success', message: 'Chat eliminado' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


export const searchGlobalUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      res.status(200).json({ status: 'success', data: [] });
      return;
    }

    const users = await prisma.user.findMany({
      where: {
        name: { contains: q, mode: 'insensitive' }
      },
      select: { id: true, name: true, avatar: true }, 
      take: 5 
    });

    res.status(200).json({ status: 'success', data: users });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any).sub || (req.user as any).id;
    const conversationId = req.params.conversationId as string;
    await chatService.markConversationAsRead(conversationId, userId);
    res.status(200).json({ status: 'success' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


export const uploadAttachment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log("Petición de subida recibida. Archivo:", req.file ? req.file.originalname : "¡NINGUNO!");
    if (!req.file) {
      res.status(400).json({ status: 'error', message: 'No se envió ningún archivo' });
      return;
    }

    const streamUpload = (req: any) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "chat_attachments", resource_type: "auto" },
        
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result: any = await streamUpload(req);
    console.log("Archivo subido con éxito a Cloudinary:", result.secure_url);

    res.status(200).json({ 
      status: 'success', 
      fileUrl: result.secure_url 
    });

  } catch (error: any) {
    console.error("ERROR FATAL EN SUBIDA:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};