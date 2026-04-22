import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { profileService } from '../services/profile.service.js';
import cloudinary from '../config/cloudinary.js';

const updateProfileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
  avatar: z.string().url("Debe ser una URL válida").nullable().optional(),
  professionalTitle: z.string().max(100).nullable().optional(),
  location: z.string().max(100).nullable().optional(),
  bio: z.string().max(1000).nullable().optional(),
  
  rateType: z.enum(['HOURLY', 'FIXED', 'NEGOTIABLE']).optional(),
  hourlyRate: z.number().min(1, "La tarifa no puede ser 0").nullable().optional(),
  
  languages: z.array(z.object({
    name: z.string(),
    level: z.enum(['BÁSICO', 'INTERMEDIO', 'AVANZADO', 'NATIVO'])
  })).nullable().optional(),

  skills: z.array(z.string()).optional(),
  yearsOfExperience: z.number().min(0, "No puede ser negativo").nullable().optional(),
  education: z.array(z.string()).nullable().optional(),
  portfolioUrl: z.string().url("Debe ser una URL válida").nullable().optional()
});

export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id || (req.user as any).sub;

    if (!userId) {
    res.status(400).json({ status: 'error', message: 'ID de usuario no encontrado en el token' });
    return;
    }
    const profile = await profileService.getMyProfile(userId);
    
    res.status(200).json({ status: 'success', data: profile });
  } catch (error: any) {
    res.status(404).json({ status: 'error', message: 'Perfil no encontrado' });
  }
};

export const updateMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any).sub || (req.user as any).id;
    if (!userId) {
      res.status(401).json({ status: 'error', message: 'Token inválido: No se encontró el ID del usuario' });
      return;
    }
    const validatedData = updateProfileSchema.parse(req.body);

    const updatedProfile = await profileService.updateMyProfile(userId, validatedData);

    res.status(200).json({ 
      status: 'success', 
      message: 'Perfil actualizado exitosamente',
      data: updatedProfile 
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ status: 'error', issues: error.issues.map(e => e.message) });
      return;
    }
    
    console.error('[CRASH EN UPDATE PROFILE]:', error); 

    res.status(500).json({ 
      status: 'error', 
      message: 'Error interno del servidor',
      dev_error: error.message 
    });
  }
};


export const getUploadSignature = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any).sub || (req.user as any).id;

    if (!userId) {
      res.status(401).json({ status: 'error', message: 'No autorizado' });
      return;
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'tecsup_academy/avatars'; 

    const paramsToSign = {
      timestamp: timestamp,
      folder: folder,
      eager: 'w_400,h_400,c_fill,g_face,f_auto,q_auto', 
      public_id: `avatar_${userId}`, 
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    res.status(200).json({
      status: 'success',
      data: {
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder,
        eager: paramsToSign.eager,
        publicId: paramsToSign.public_id
      },
    });
  } catch (error) {
    console.error('Error generando firma de Cloudinary:', error);
    res.status(500).json({ status: 'error', message: 'Error interno al generar autorización de subida' });
  }
};