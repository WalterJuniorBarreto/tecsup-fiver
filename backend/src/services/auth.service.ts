import bcrypt from 'bcrypt';
import prisma from '../config/db.js';
import { sendVerificationEmail } from '../utils/mailer.util.js';
import { generateVerificationCode } from '../utils/otp.util.js';

export const registerNewUser = async (email: string, password: string, username: string) => {
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
      password: hashedPassword,
      verificationCode: otpCode,
      codeExpiresAt: expiresAt,
      isVerified: false
    }
  });

  await sendVerificationEmail(email, otpCode);
  
  //console.log(`\n EMAIL ENVIADO a: ${email}`);
  //console.log(`Codigo: ${otpCode}\n`);

  return {
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
  };
};