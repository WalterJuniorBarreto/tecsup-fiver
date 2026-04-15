import type { Metadata } from 'next';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { MessagesProvider } from '../context/MessagesContext'; 
import './globals.css';

export const metadata: Metadata = {
  title: 'FreelanceHub | Tu plataforma de servicios',
  description: 'Encuentra a los mejores profesionales para tu próximo proyecto.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="es">
      <body className="bg-black text-white antialiased">
        
        <GoogleOAuthProvider clientId={googleClientId}>
          
         
          <MessagesProvider>
            {children}
          </MessagesProvider>
          
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}