"use client";

import React, { useState } from 'react';
import { 
  Settings, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  Save
} from 'lucide-react';
// Importamos tu componente original
import AdminSidebar from "../../../../components/admin/AdminSidebar";

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState('General');
  const [mantenimiento, setMantenimiento] = useState(false);
  const [aprobacionAuto, setAprobacionAuto] = useState(false);

  // Estados para la pestaña de Pagos
  const [metodos, setMetodos] = useState({
    tarjeta: true,
    paypal: true,
    transferencia: true
  });

  // Estados para la pestaña de Notificaciones
  const [notificaciones, setNotificaciones] = useState({
    nuevoUsuario: true,
    nuevoServicio: true,
    nuevaDisputa: true,
    reporteContenido: true,
    pagoRecibido: true
  });

  // Estados para la pestaña de Seguridad
  const [seguridad, setSeguridad] = useState({
    dosFactores: true,
    verificacionEmail: true,
    captcha: true,
    limiteIntentos: true
  });

  return (
    <div className="flex min-h-screen bg-[#080808] text-white font-sans">
      {/* USAMOS TU COMPONENTE REUTILIZABLE */}
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-zinc-500 text-sm">Administra la configuración de la plataforma</p>
        </header>

        {/* Tabs superiores */}
        <div className="bg-zinc-900/30 p-1 rounded-xl border border-zinc-800/50 flex gap-1 mb-8">
          {['General', 'Pagos', 'Notificaciones', 'Seguridad'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab 
                ? 'bg-zinc-800 text-white shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab === 'General' && <Settings size={14} />}
              {tab === 'Pagos' && <CreditCard size={14} />}
              {tab === 'Notificaciones' && <Bell size={14} />}
              {tab === 'Seguridad' && <ShieldCheck size={14} />}
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENIDO DINÁMICO SEGÚN LA PESTAÑA */}
        <div className="bg-[#0c0c0e] border border-zinc-800/60 rounded-[24px] overflow-hidden animate-in fade-in duration-500">
          <div className="p-8">
            
            {/* VISTA: GENERAL */}
            {activeTab === 'General' && (
              <div className="space-y-8">
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-zinc-100">Configuración general</h3>
                  <p className="text-xs text-zinc-500">Ajustes básicos de la plataforma</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">Nombre de la plataforma</label>
                    <input type="text" defaultValue="DevMarket" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">Idioma predeterminado</label>
                    <select className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none cursor-pointer">
                      <option>Español</option>
                      <option>English</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between p-6 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
                    <div>
                      <h4 className="text-sm font-bold">Modo mantenimiento</h4>
                      <p className="text-xs text-zinc-500">Desactiva temporalmente el acceso público</p>
                    </div>
                    <Switch active={mantenimiento} onClick={() => setMantenimiento(!mantenimiento)} />
                  </div>
                  <div className="flex items-center justify-between p-6 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
                    <div>
                      <h4 className="text-sm font-bold">Aprobación automática</h4>
                      <p className="text-xs text-zinc-500">Aprobar servicios sin revisión manual</p>
                    </div>
                    <Switch active={aprobacionAuto} onClick={() => setAprobacionAuto(!aprobacionAuto)} />
                  </div>
                </div>
              </div>
            )}

            {/* VISTA: PAGOS */}
            {activeTab === 'Pagos' && (
              <div className="space-y-8">
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-zinc-100">Configuración de pagos</h3>
                  <p className="text-xs text-zinc-500">Ajustes de comisiones y métodos de pago</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">Comisión de la plataforma (%)</label>
                    <input type="number" defaultValue="15" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">Retiro mínimo ($)</label>
                    <input type="number" defaultValue="50" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">Métodos de pago habilitados</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-5 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
                      <span className="text-sm font-medium text-zinc-300">Tarjeta de crédito</span>
                      <Switch active={metodos.tarjeta} onClick={() => setMetodos({...metodos, tarjeta: !metodos.tarjeta})} />
                    </div>
                    <div className="flex items-center justify-between p-5 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
                      <span className="text-sm font-medium text-zinc-300">PayPal</span>
                      <Switch active={metodos.paypal} onClick={() => setMetodos({...metodos, paypal: !metodos.paypal})} />
                    </div>
                    <div className="flex items-center justify-between p-5 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
                      <span className="text-sm font-medium text-zinc-300">Transferencia</span>
                      <Switch active={metodos.transferencia} onClick={() => setMetodos({...metodos, transferencia: !metodos.transferencia})} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VISTA: NOTIFICACIONES */}
            {activeTab === 'Notificaciones' && (
              <div className="space-y-8">
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-zinc-100">Configuración de notificaciones</h3>
                  <p className="text-xs text-zinc-500">Ajustes de emails y alertas</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-5 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
                    <div>
                      <h4 className="text-sm font-bold">Nuevo usuario registrado</h4>
                      <p className="text-[11px] text-zinc-500">Recibir email cuando un usuario se registra</p>
                    </div>
                    <Switch active={notificaciones.nuevoUsuario} onClick={() => setNotificaciones({...notificaciones, nuevoUsuario: !notificaciones.nuevoUsuario})} />
                  </div>

                  <div className="flex items-center justify-between p-5 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
                    <div>
                      <h4 className="text-sm font-bold">Nuevo servicio publicado</h4>
                      <p className="text-[11px] text-zinc-500">Recibir email cuando se publica un servicio</p>
                    </div>
                    <Switch active={notificaciones.nuevoServicio} onClick={() => setNotificaciones({...notificaciones, nuevoServicio: !notificaciones.nuevoServicio})} />
                  </div>

                  <div className="flex items-center justify-between p-5 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
                    <div>
                      <h4 className="text-sm font-bold">Nueva disputa abierta</h4>
                      <p className="text-[11px] text-zinc-500">Recibir email cuando se abre una disputa</p>
                    </div>
                    <Switch active={notificaciones.nuevaDisputa} onClick={() => setNotificaciones({...notificaciones, nuevaDisputa: !notificaciones.nuevaDisputa})} />
                  </div>

                  <div className="flex items-center justify-between p-5 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
                    <div>
                      <h4 className="text-sm font-bold">Reporte de contenido</h4>
                      <p className="text-[11px] text-zinc-500">Recibir email cuando se reporta contenido</p>
                    </div>
                    <Switch active={notificaciones.reporteContenido} onClick={() => setNotificaciones({...notificaciones, reporteContenido: !notificaciones.reporteContenido})} />
                  </div>

                  <div className="flex items-center justify-between p-5 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
                    <div>
                      <h4 className="text-sm font-bold">Pago recibido</h4>
                      <p className="text-[11px] text-zinc-500">Recibir email cuando se recibe un pago</p>
                    </div>
                    <Switch active={notificaciones.pagoRecibido} onClick={() => setNotificaciones({...notificaciones, pagoRecibido: !notificaciones.pagoRecibido})} />
                  </div>
                </div>
              </div>
            )}

            {/* VISTA: SEGURIDAD */}
            {activeTab === 'Seguridad' && (
              <div className="space-y-8">
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-zinc-100">Configuración de seguridad</h3>
                  <p className="text-xs text-zinc-500">Ajustes de seguridad y acceso</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-5 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
                    <div>
                      <h4 className="text-sm font-bold">Autenticación de dos factores</h4>
                      <p className="text-[11px] text-zinc-500">Requerir 2FA para administradores</p>
                    </div>
                    <Switch active={seguridad.dosFactores} onClick={() => setSeguridad({...seguridad, dosFactores: !seguridad.dosFactores})} />
                  </div>

                  <div className="flex items-center justify-between p-5 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
                    <div>
                      <h4 className="text-sm font-bold">Verificación de email</h4>
                      <p className="text-[11px] text-zinc-500">Requerir verificacion de email para nuevos usuarios</p>
                    </div>
                    <Switch active={seguridad.verificacionEmail} onClick={() => setSeguridad({...seguridad, verificacionEmail: !seguridad.verificacionEmail})} />
                  </div>

                  <div className="flex items-center justify-between p-5 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
                    <div>
                      <h4 className="text-sm font-bold">Captcha en registro</h4>
                      <p className="text-[11px] text-zinc-500">Habilitar captcha en el formulario de registro</p>
                    </div>
                    <Switch active={seguridad.captcha} onClick={() => setSeguridad({...seguridad, captcha: !seguridad.captcha})} />
                  </div>

                  <div className="flex items-center justify-between p-5 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
                    <div>
                      <h4 className="text-sm font-bold">Límite de intentos de login</h4>
                      <p className="text-[11px] text-zinc-500">Bloquear después de 5 intentos fallidos</p>
                    </div>
                    <Switch active={seguridad.limiteIntentos} onClick={() => setSeguridad({...seguridad, limiteIntentos: !seguridad.limiteIntentos})} />
                  </div>
                </div>

                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <p className="text-xs text-orange-400 leading-relaxed">
                    Los cambios en la configuración de seguridad pueden afectar el acceso de los usuarios. Asegúrate de comunicar los cambios antes de aplicarlos.
                  </p>
                </div>
              </div>
            )}

            {/* BOTÓN GUARDAR (Común a todas las pestañas) */}
            <div className="pt-8 mt-8 border-t border-zinc-800/50">
              <button 
                onClick={() => alert('¡Cambios guardados con éxito!')}
                className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
              >
                <Save size={16} /> Guardar cambios
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// COMPONENTE SWITCH REUTILIZABLE
function Switch({ active, onClick }: { active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-11 h-6 rounded-full relative transition-all duration-300 ${active ? 'bg-emerald-500' : 'bg-zinc-800'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${active ? 'left-6' : 'left-1'}`} />
    </button>
  );
}