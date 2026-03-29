export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900 pt-16 pb-8 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#00e676] text-black font-extrabold px-1.5 py-0.5 rounded text-sm">FH</div>
            <span className="text-xl font-bold text-white">FreelanceHub</span>
          </div>
          <p className="text-zinc-500 text-sm">La plataforma líder para freelancers.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Categorías</h4>
          <ul className="text-zinc-500 space-y-3 text-sm italic">
            <li>Diseño, Programación, Video, Marketing</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Soporte</h4>
          <ul className="text-zinc-500 space-y-3 text-sm">
            <li>Ayuda, Términos, Privacidad</li>
          </ul>
        </div>
        <div className="text-zinc-600 text-sm">© 2026 FreelanceHub</div>
      </div>
    </footer>
  );
}