import './globals.css'
// Asegúrate de que la ruta coincida con la carpeta donde creaste el archivo
import { MessagesProvider } from '../context/MessagesContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <MessagesProvider>
          {children}
        </MessagesProvider>
      </body>
    </html>
  )
}