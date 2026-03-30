import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { sendVerificationEmail } from '../utils/mailer.util.js';
import { generateVerificationCode } from '../utils/otp.util.js';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const buildAuthPayload = (user) => {
    const token = jwt.sign({
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
    }, JWT_SECRET, { expiresIn: '7d' });
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            role: user.role,
        },
    };
};
export const registerNewUser = async (email, password, username, role, name) => {
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { username }]
        }
    });
    if (existingUser) {
        if (existingUser.email === email)
            throw new Error('EMAIL_IN_USE');
        if (existingUser.username === username)
            throw new Error('USERNAME_IN_USE');
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
        console.warn('No se pudo enviar el correo de verificacion, pero el usuario fue creado.', error);
    });
    return buildAuthPayload(newUser);
};
export const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        throw new Error('INVALID_CREDENTIALS');
    }
    return buildAuthPayload(user);
};
