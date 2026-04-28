import Image from 'next/image';
import logo from '../../../logo.png';

export default function Footer() {
  return (
    <footer className="theme-page theme-border border-t pt-16 pb-8 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src={logo}
              alt="DevMarket logo"
              className="h-10 w-10 rounded-xl object-cover"
            />
            <span className="theme-text text-xl font-bold">DevMarket</span>
          </div>
          <p className="theme-secondary text-sm">La plataforma líder para freelancers.</p>
        </div>
        <div>
          <h4 className="theme-text font-bold mb-6">Categorías</h4>
          <ul className="theme-secondary space-y-3 text-sm italic">
            <li>Diseño, Programación, Video, Marketing</li>
          </ul>
        </div>
        <div>
          <h4 className="theme-text font-bold mb-6">Soporte</h4>
          <ul className="theme-secondary space-y-3 text-sm">
            <li>Ayuda, Términos, Privacidad</li>
          </ul>
        </div>
        <div className="theme-muted text-sm">© 2026 DevMarket</div>
      </div>
    </footer>
  );
}
