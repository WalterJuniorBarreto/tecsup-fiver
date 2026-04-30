import ClientSidebar from './components/ClientSidebar'; 

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black">
      <ClientSidebar />

      <main className="flex-1 ml-64 p-10 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}