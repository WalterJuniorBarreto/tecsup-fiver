import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to: string, code: string) => {
  try {
    const mailOptions = {
      from: `"Tecsup Academy" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Código de verificación - Tecsup Academy',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000; padding: 40px 20px;">
            <tr>
              <td align="center">
                
                <table width="100%" max-width="500" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; background-color: #0c0c0e; border: 1px solid #27272a; border-radius: 16px; overflow: hidden;">
                  
                  <tr>
                    <td align="center" style="padding: 30px 20px; border-bottom: 1px solid #27272a;">
                      <span style="background-color: #00e676; color: #000000; font-weight: 900; padding: 4px 12px; border-radius: 4px; font-size: 14px; letter-spacing: 1px;">TA</span>
                      <h2 style="margin: 15px 0 0 0; font-size: 20px; color: #ffffff; letter-spacing: -0.5px;">TECSUP - ACADEMY</h2>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="padding: 40px 30px;">
                      <h3 style="margin: 0 0 15px 0; color: #ffffff; font-size: 24px;">Verifica tu identidad</h3>
                      <p style="margin: 0 0 25px 0; color: #a1a1aa; font-size: 15px; line-height: 1.6;">
                        Estás a un paso de unirte a nuestra plataforma. Ingresa el siguiente código de seguridad de 6 dígitos para activar tu cuenta.
                      </p>

                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="center" style="background-color: #121212; border: 1px solid #27272a; border-radius: 12px; padding: 25px 20px;">
                            <h1 style="margin: 0; color: #00e676; letter-spacing: 12px; font-size: 38px; font-weight: 800; text-align: center;">${code}</h1>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 30px 0 0 0; color: #71717a; font-size: 13px;">
                         Por seguridad, este código expirará en <strong style="color: #a1a1aa;">15 minutos</strong>.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="padding: 20px; background-color: #050505; border-top: 1px solid #27272a;">
                      <p style="margin: 0; color: #52525b; font-size: 12px; line-height: 1.5;">
                        Si no solicitaste este código o no intentaste registrarte en Tecsup Academy, puedes ignorar este correo electrónico de forma segura.
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email Service]: Correo de verificación enviado exitosamente a ${to}`);
  } catch (error) {
    console.error('[Email Service Error]:', error);
    throw new Error('ERROR_SENDING_EMAIL');
  }
};