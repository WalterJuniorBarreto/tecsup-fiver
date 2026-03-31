import bcrypt from 'bcrypt';
import prisma from '../config/db.js';
import { sendVerificationEmail } from '../utils/mailer.util.js';
import { generateVerificationCode } from '../utils/otp.util.js';
import { generateAuthToken } from '../utils/jwt.util.js';


type RoleType = 'CLIENT' | 'FREELANCER';

export const registerNewUser = async (email: string, password: string, username: string, name: string, role: RoleType) => {
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { username }]
        }
    });

    if (existingUser) {
        if (existingUser.email === email) throw new Error('EMAIL_IN_USE');
        if (existingUser.username === username) throw new Error('USERNAME_IN_USE');
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

  if (user.verificationCode !== code) {
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
      role: user.role
    }
  };
};