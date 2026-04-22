import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  id: string;   
  email: string;
  username: string;
  role: string;    
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        status: 'error', 
        message: 'Acceso denegado. No se proporcionó un token válido.' 
      });
      return;
    }

    const token = authHeader.split(' ')[1];

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