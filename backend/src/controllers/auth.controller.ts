import { Request, Response } from 'express';
import { z } from 'zod';
import * as authService from '../services/auth.service.js';

const registerSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username } = registerSchema.parse(req.body);

    const user = await authService.registerNewUser(email, password, username);

    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado. Por favor verifica tu correo.',
      data: user,
    });

  } catch (error: any) {
   if (error instanceof z.ZodError) {
      res.status(400).json({ status: 'error', errors: error.issues.map((e: any) => e.message) });
      return;
    }
    
    if (error.message === 'EMAIL_IN_USE') {
      res.status(409).json({ status: 'error', message: 'El correo ya está registrado' });
      return;
    }
    if (error.message === 'USERNAME_IN_USE') {
      res.status(409).json({ status: 'error', message: 'El nombre de usuario ya está tomado' });
      return;
    }

    console.error('[Auth Controller Error]:', error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};