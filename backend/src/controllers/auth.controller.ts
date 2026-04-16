import { Request, Response } from 'express';
import { z } from 'zod';
import * as authService from '../services/auth.service.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import prisma from '../config/db.js';


const registerSchema = z.object({
  name: z.string().min(2, "El nombre completo es obligatorio"),
  email: z.string().email("Formato de email inválido"),
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  role: z.enum(['CLIENT', 'FREELANCER']),
  
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número")
});
const forgotPasswordSchema = z.object({
  email: z.string().email("Formato de email inválido"),
});
const resetPasswordSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  code: z.string().length(6, "El código debe tener exactamente 6 dígitos"),
  newPassword: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
});

const googleLoginSchema = z.object({
  token: z.string().min(1, "El token de Google es obligatorio"),
  role: z.enum(['CLIENT', 'FREELANCER']).optional() 
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
    if (error.message === 'USE_GOOGLE_LOGIN') {
      res.status(400).json({ 
        status: 'error', 
        message: 'Esta cuenta fue creada con Google. Por favor, usa el botón de "Continuar con Google".' 
      });
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


export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, role } = googleLoginSchema.parse(req.body);

    const result = await authService.loginWithGoogle(token, role);

    res.status(200).json({
      status: 'success',
      message: 'Autenticación con Google exitosa',
      data: result
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ status: 'error', issues: error.issues.map((e: any) => e.message) });
      return;
    }

    if (error.message === 'INVALID_GOOGLE_TOKEN') {
      res.status(401).json({ status: 'error', message: 'Token de Google inválido o expirado' });
      return;
    }

    console.error('[Google Auth Error]:', error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const result = await authService.requestPasswordReset(email);

    res.status(200).json({ status: 'success', data: result });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ status: 'error', issues: error.issues.map((e: any) => e.message) }); return;
    }
    if (error.message === 'USER_NOT_FOUND') {
      res.status(404).json({ status: 'error', message: 'No existe una cuenta con este correo' }); return;
    }
    if (error.message === 'USE_GOOGLE_LOGIN') {
      res.status(400).json({ status: 'error', message: 'Esta cuenta usa Google. Inicia sesión con Google.' }); return;
    }
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code, newPassword } = resetPasswordSchema.parse(req.body);
    const result = await authService.resetPassword(email, code, newPassword);

    res.status(200).json({ status: 'success', data: result });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ status: 'error', issues: error.issues.map((e: any) => e.message) }); return;
    }
    if (error.message === 'USER_NOT_FOUND') {
      res.status(404).json({ status: 'error', message: 'Usuario no encontrado' }); return;
    }
    if (error.message === 'INVALID_CODE') {
      res.status(401).json({ status: 'error', message: 'Código incorrecto' }); return;
    }
    if (error.message === 'CODE_EXPIRED') {
      res.status(410).json({ status: 'error', message: 'El código ha expirado, solicita uno nuevo' }); return;
    }
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

export const verifyResetCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code } = z.object({
      email: z.string().email(),
      code: z.string().length(6)
    }).parse(req.body);

    await authService.verifyResetCode(email, code);
    res.status(200).json({ status: 'success', message: 'Código verificado' });
  } catch (error: any) {
    res.status(401).json({ status: 'error', message: error.message });
  }
};