import { z } from 'zod';
import * as authService from '../services/auth.service.js';
const registerSchema = z.object({
    email: z.string().email("Formato de email inválido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
    role: z.enum(['CLIENT', 'FREELANCER']),
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").optional(),
});
export const register = async (req, res) => {
    try {
        const { email, password, username, role, name } = registerSchema.parse(req.body);
        const authData = await authService.registerNewUser(email, password, username, role, name);
        res.status(201).json({
            status: 'success',
            message: 'Usuario registrado. Por favor verifica tu correo.',
            data: authData,
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ status: 'error', errors: error.issues.map((e) => e.message) });
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
const loginSchema = z.object({
    email: z.string().email("Formato de email inválido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});
export const login = async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const authData = await authService.loginUser(email, password);
        res.status(200).json({
            status: 'success',
            message: 'Inicio de sesión exitoso',
            data: authData,
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ status: 'error', errors: error.issues.map((e) => e.message) });
            return;
        }
        if (error.message === 'INVALID_CREDENTIALS') {
            res.status(401).json({ status: 'error', message: 'Correo o contraseña incorrectos' });
            return;
        }
        console.error('[Auth Controller Error]:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};
