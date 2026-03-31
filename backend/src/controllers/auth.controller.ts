import { Request, Response } from 'express';
import { z } from 'zod';
import * as authService from '../services/auth.service.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import prisma from '../config/db.js';


const registerSchema = z.object({
  name: z.string().min(2, "El nombre completo es obligatorio"),
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  role: z.enum(['CLIENT', 'FREELANCER'])
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username, name, role } = registerSchema.parse(req.body);

    const user = await authService.registerNewUser(email, password, username, name, role);

    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado. Por favor verifica tu correo con el código de 6 dígitos.',
      data: user,
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ status: 'error', issues: error.issues.map((e: any) => e.message) });
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



const verifyOtpSchema = z.object({
  email: z.string().email("Email inválido"),
  code: z.string().length(6, "El código debe tener exactamente 6 dígitos"),
});

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code } = verifyOtpSchema.parse(req.body);

    const result = await authService.verifyEmailOTP(email, code);

    res.status(200).json({
      status: 'success',
      message: '¡Cuenta verificada con éxito!',
      data: result
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ status: 'error', issues: error.issues.map((e: any) => e.message) });
      return;
    }

    const errorMapping: Record<string, { status: number, msg: string }> = {
      'USER_NOT_FOUND': { status: 404, msg: 'El usuario no existe' },
      'USER_ALREADY_VERIFIED': { status: 400, msg: 'Esta cuenta ya ha sido verificada' },
      'INVALID_CODE': { status: 401, msg: 'Código incorrecto' },
      'CODE_EXPIRED': { status: 410, msg: 'El código ha expirado, solicita uno nuevo' }
    };

    const mapped = errorMapping[error.message];
    if (mapped) {
      res.status(mapped.status).json({ status: 'error', message: mapped.msg });
      return;
    }

    res.status(500).json({ status: 'error', message: 'Error interno en el servidor' });
  }
};


const loginSchema = z.object({
  email: z.string().email("El formato del email es inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"), 
});

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      status: 'success',
      message: 'Inicio de sesión exitoso',
      data: result
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ status: 'error', issues: error.issues.map((e: any) => e.message) });
      return;
    }

    if (error.message === 'INVALID_CREDENTIALS') {
      res.status(401).json({ status: 'error', message: 'Correo o contraseña incorrectos' });
      return;
    }

    if (error.message === 'USER_NOT_VERIFIED') {
      res.status(403).json({ status: 'error', message: 'Debes verificar tu correo antes de iniciar sesión' });
      return;
    }

    console.error('[Login Error]:', error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};


export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.sub; 

    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        bio: true,     
        avatar: true,  
        createdAt: true
      }
    });

    if (!userProfile) {
      res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: userProfile
    });

  } catch (error) {
    console.error('[Profile Error]:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener el perfil' });
  }
};