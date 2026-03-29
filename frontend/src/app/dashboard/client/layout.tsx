// src/app/dashboard/client/layout.tsx
import ClientSidebar from './components/ClientSidebar'; // Importación relativa simplificada

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar Fijo - Ahora vive dentro de la misma carpeta del cliente */}
      <ClientSidebar />

      {/* Contenido Dinámico */}
      <main className="flex-1 ml-64 p-10 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}