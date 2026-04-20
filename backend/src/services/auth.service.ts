import bcrypt from 'bcrypt';
import prisma from '../config/db.js';
import { sendVerificationEmail } from '../utils/mailer.util.js';
import { generateVerificationCode } from '../utils/otp.util.js';
import { generateAuthToken } from '../utils/jwt.util.js';
import { verifyGoogleToken } from '../utils/google.util.js';
import axios from 'axios';


type RoleType = 'CLIENT' | 'FREELANCER';


export const registerNewUser = async (email: string, password: string, username: string, name: string, role: RoleType) => {
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { username }]
        }
    });

    if (existingUser) {
        if (existingUser.isVerified) {
            if (existingUser.email === email) throw new Error('EMAIL_IN_USE');
            if (existingUser.username === username) throw new Error('USERNAME_IN_USE');
        } else {
        
            await prisma.user.delete({ where: { id: existingUser.id } });
        }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const otpCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const newUser = await prisma.user.create({
        data: {
            email,
            username,
            name,
            role, 
            password: hashedPassword,
            verificationCode: otpCode,
            codeExpiresAt: expiresAt,
            isVerified: false 
        }
    });

    void sendVerificationEmail(email, otpCode).catch((error) => {
        console.warn('No se pudo enviar el correo de verificación.', error);
    });

    return {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        message: 'Usuario creado a la espera de verificación.'
    };
};


export const verifyEmailOTP = async (email: string, code: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error('USER_NOT_FOUND');
  if (user.isVerified) throw new Error('USER_ALREADY_VERIFIED');

  const cleanCode = code.trim();

  if (user.verificationCode !== cleanCode) {
    throw new Error('INVALID_CODE');
  }

  if (user.codeExpiresAt && new Date() > user.codeExpiresAt) {
    throw new Error('CODE_EXPIRED');
  }
  
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      isVerified: true,
      verificationCode: null, 
      codeExpiresAt: null    
    }
  });

  const token = generateAuthToken(updatedUser); 

  return {
    token,
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      name: updatedUser.name,
      role: updatedUser.role
    }
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  if (user.provider === 'GOOGLE' || !user.password) {
    throw new Error('USE_GOOGLE_LOGIN'); 
  }

  if (!user.isVerified) {
    throw new Error('USER_NOT_VERIFIED');
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const token = generateAuthToken(user);

  
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      provider: user.provider
    }
  };
};

export const loginWithGoogle = async (googleToken: string, roleRequested: 'CLIENT' | 'FREELANCER' = 'CLIENT') => {
  const payload = await verifyGoogleToken(googleToken);
  
  if (!payload || !payload.email) {
    throw new Error('INVALID_GOOGLE_TOKEN');
  }

  let user = await prisma.user.findUnique({
    where: { email: payload.email }
  });

  if (!user) {
    const baseUsername = payload.email.split('@')[0];
    const uniqueUsername = `${baseUsername}_${Math.floor(Math.random() * 10000)}`;

    user = await prisma.user.create({
      data: {
        email: payload.email,
        username: uniqueUsername,
        name: payload.name || 'Usuario de Google',
        avatar: payload.picture, 
        provider: 'GOOGLE',      
        role: roleRequested,
        isVerified: true,       
      }
    });
  }

  if (!user.isVerified) {
    user = await prisma.user.update({
      where: { email: user.email },
      data: { isVerified: true, verificationCode: null, codeExpiresAt: null }
    });
  }

  const token = generateAuthToken(user);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      provider: user.provider
    }
  };
};


export const  requestPasswordReset =  async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error('USER_NOT_FOUND');

    if (user.provider === 'GOOGLE') throw new Error('USE_GOOGLE_LOGIN');

    const otpCode = generateVerificationCode(); 
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 

    await prisma.user.update({
      where: { email },
      data: {
        verificationCode: otpCode,
        codeExpiresAt: expiresAt,
      }
    });

    void sendVerificationEmail(email, otpCode).catch((error) => {
      console.warn('No se pudo enviar el correo de recuperación.', error);
    });

    return { message: 'Código de recuperación enviado al correo.' };
  };

export const  resetPassword = async (email: string, code: string, newPassword: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error('USER_NOT_FOUND');

    if (user.verificationCode !== code) {
      throw new Error('INVALID_CODE');
    }
    if (user.codeExpiresAt && new Date() > user.codeExpiresAt) {
      throw new Error('CODE_EXPIRED');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        verificationCode: null,
        codeExpiresAt: null
      }
    });

    return { message: 'Contraseña actualizada correctamente.' };
  };

export const verifyResetCode = async (email: string, code: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('USER_NOT_FOUND');
  if (user.verificationCode !== code) throw new Error('INVALID_CODE');
  if (user.codeExpiresAt && new Date() > user.codeExpiresAt) throw new Error('CODE_EXPIRED');
  
  return { message: 'Código válido' };
};

export interface AuthResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      username: string;
      name: string;
      role: string;
      provider: string;
    };
  };
}
export const githubLogin = async (code: string, roleRequested: 'CLIENT' | 'FREELANCER' = 'CLIENT'): Promise<AuthResponse> => {
    try {
      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error('Las credenciales de GitHub no están configuradas en el servidor.');
      }

      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: clientId,
          client_secret: clientSecret,
          code,
        },
        { headers: { Accept: 'application/json' } }
      );

      const accessToken = tokenResponse.data.access_token;
      if (!accessToken) {
        throw new Error('GitHub no devolvió un token de acceso válido.');
      }

      const userResponse = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const githubUser = userResponse.data;

      const emailsResponse = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      const primaryEmailObj = emailsResponse.data.find((e: any) => e.primary && e.verified);
      const email = primaryEmailObj ? primaryEmailObj.email : githubUser.email;

      if (!email) {
        throw new Error('No se pudo obtener un correo electrónico verificado de tu cuenta de GitHub.');
      }

      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            username: githubUser.login, 
            name: githubUser.name || githubUser.login,
            avatar: githubUser.avatar_url,
            provider: 'GITHUB', 
            role: roleRequested,
            isVerified: true, 
          }
        });
      }

      if (!user.isVerified) {
        user = await prisma.user.update({
          where: { email: user.email },
          data: { isVerified: true, verificationCode: null, codeExpiresAt: null }
        });
      }

      const token = generateAuthToken(user);

      return {
        status: 'success',
        message: 'Autenticación con GitHub exitosa',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            username: user.username ?? '',
            name: user.name ?? 'Usuario', 
            role: user.role,
            provider: user.provider
          }
        }
      };

    } catch (error: any) {
      console.error('[GitHub Auth Error]:', error.response?.data || error.message);
      throw new Error('Error al autenticar con GitHub');
    }
  }