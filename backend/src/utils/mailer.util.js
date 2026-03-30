import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
export const sendVerificationEmail = async (to, code) => {
    try {
        const mailOptions = {
            from: `"Fiverr Clone Admin" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Verifica tu cuenta - Código de Seguridad',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2>¡Bienvenido a nuestro Marketplace!</h2>
          <p>Para activar tu cuenta y empezar a comprar o vender, ingresa este código:</p>
          <h1 style="color: #4F46E5; letter-spacing: 5px; font-size: 40px;">${code}</h1>
          <p>Este código expira en 15 minutos.</p>
        </div>
      `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado exitosamente a ${to}`);
    }
    catch (error) {
        console.error('Error enviando el correo:', error);
        throw new Error('ERROR_SENDING_EMAIL');
    }
};
