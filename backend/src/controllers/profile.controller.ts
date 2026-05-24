import { Response, Request } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { profileService } from '../services/profile.service.js';
import cloudinary from '../config/cloudinary.js';
import prisma from '../config/db.js';

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






export const profileController = {
  
  getProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id || (req as any).user?.sub;
      if (!userId) return res.status(401).json({ error: 'No autorizado' });

      const profile = await profileService.getClientProfile(userId);
      res.status(200).json(profile);
    } catch (error: any) {
      console.error('[GET PROFILE ERROR]:', error.message);
      res.status(500).json({ error: 'Error al obtener el perfil' });
    }
  },

  updateProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id || (req as any).user?.sub;
      if (!userId) return res.status(401).json({ error: 'No autorizado' });

const { username, location, bio, avatar, phone } = req.body;
      const updatedProfile = await profileService.updateClientProfile(userId, {
        username, location, bio, avatar, phone
      });

      res.status(200).json({ success: true, data: updatedProfile });
    } catch (error: any) {
      console.error('[UPDATE PROFILE ERROR]:', error.message);
      res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
  },

  changePassword: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id || (req as any).user?.sub;
      if (!userId) return res.status(401).json({ error: 'No autorizado' });

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Debes enviar la contraseña actual y la nueva' });
      }

      await profileService.changePassword(userId, currentPassword, newPassword);
      res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error: any) {
      console.error('[CHANGE PASSWORD ERROR]:', error.message);
      res.status(400).json({ error: error.message });
    }
  },

  getPublicFreelancer: async (req: Request, res: Response) => {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;
      
      if (!id) {
        return res.status(400).json({ error: 'Debes proporcionar el ID del freelancer' });
      }

      const profile = await profileService.getPublicFreelancerProfile(id);
      
      res.status(200).json({ success: true, data: profile });
    } catch (error: any) {
      console.error('[GET PUBLIC FREELANCER ERROR]:', error.message);
      if (error.message === 'Freelancer no encontrado') {
        return res.status(404).json({ error: 'El freelancer no existe' });
      }
      res.status(500).json({ error: 'Error al obtener el perfil del freelancer' });
    }
  },
  becomeFreelancer: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id || (req as any).user?.sub;

      if (!userId) {
        return res.status(401).json({ error: 'No autorizado' });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: 'FREELANCER' },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          role: true, 
          avatar: true
        }
      });

      res.status(200).json({ 
        success: true, 
        message: '¡Felicidades! Ahora eres Freelancer.',
        user: updatedUser 
      });
    } catch (error) {
      console.error('[BECOME FREELANCER ERROR]:', error);
      res.status(500).json({ error: 'Error al actualizar el rol' });
    }
  }
};
