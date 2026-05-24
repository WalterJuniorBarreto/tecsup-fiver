import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

export interface JwtPayload {
  id: string;   
  sub?: string;
  email: string;
  username: string;
  role: string;    
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } 
    // 🚀 2. SI NO ESTÁ EN EL HEADER, BUSCAMOS EN LA COOKIE (fh_auth_token)
    else if (req.cookies && req.cookies.fh_auth_token) {
      token = req.cookies.fh_auth_token;
    }

    if (!token) {
      res.status(401).json({ 
        status: 'error', 
        message: 'Acceso denegado. No se proporcionó un token válido.' 
      });
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error('JWT_SECRET no configurado en el servidor');

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;

    next();

  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ status: 'error', message: 'El token ha expirado. Inicia sesión nuevamente.' });
      return;
    }
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ status: 'error', message: 'Token inválido o corrupto.' });
      return;
    }

    res.status(500).json({ status: 'error', message: 'Error interno al validar credenciales' });
  }
};

export const requireAdmin = async (req: any, res: any, next: any): Promise<void> => {  
  try {
    const userId = req.user?.id || req.user?.sub;
    if (!userId) {
      res.status(401).json({ status: 'error', message: 'Token inválido o usuario no identificado.' });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true } 
    });
    if (!user || user.role !== 'ADMIN') {
      res.status(403).json({ 
        status: 'error', 
        message: 'Acceso denegado. Se requieren privilegios de Administrador.' 
      });
      return;
    }
    
    next(); 
  } catch (error) {
    console.error("Error en requireAdmin:", error);
    res.status(500).json({ status: 'error', message: 'Error verificando permisos' });
  }
};
