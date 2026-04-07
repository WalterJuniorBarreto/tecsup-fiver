import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, 
    });
    
    return ticket.getPayload();
  } catch (error) {
    console.error('Error verificando el Token de Google:', error);
    throw new Error('INVALID_GOOGLE_TOKEN');
  }
};