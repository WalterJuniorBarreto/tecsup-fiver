import type { Metadata } from 'next';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Script from 'next/script';
import { MessagesProvider } from '../context/MessagesContext'; 
import './globals.css';

export const metadata: Metadata = {
  title: 'DevMarket | Tu plataforma de servicios',
  description: 'Encuentra a los mejores profesionales para tu próximo proyecto.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              const storedTheme = localStorage.getItem('theme');
              const theme = storedTheme === 'light' ? 'light' : 'dark';
              document.documentElement.dataset.theme = theme;
            })();
          `}
        </Script>
        
        <GoogleOAuthProvider clientId={googleClientId}>
          
         
          <MessagesProvider>
            {children}
          </MessagesProvider>
          
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
