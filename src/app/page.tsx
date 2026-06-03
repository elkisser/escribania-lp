'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Wizard from '@/components/Wizard';
import HistoryView from '@/components/HistoryView';
import LoginView from '@/components/LoginView';
import { supabase } from '@/lib/supabase';
import { FileText, Shield, Zap, Info, Car, Bike, ArrowLeft, ChevronRight, Clock, Users, LogOut, Loader2 } from 'lucide-react';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showSupportMessage, setShowSupportMessage] = useState(false);
  const [tramiteType, setTramiteType] = useState<'auto' | 'moto' | null>(null);
  const [view, setView] = useState<'home' | 'history' | 'edit'>('home');
  const [editingTramite, setEditingTramite] = useState<any>(null);

  useEffect(() => {
    // Mostrar mensaje de soporte después de 5 segundos si sigue cargando
    const supportTimer = setTimeout(() => {
      if (authLoading) {
        setShowSupportMessage(true);
      }
    }, 5000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      clearTimeout(supportTimer);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, tramiteType]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleGoHome();
  };

  const handleGoHome = () => {
    setTramiteType(null);
    setView('home');
    setEditingTramite(null);
  };

  const handleEdit = (tramite: any) => {
    setEditingTramite({
      ...tramite.data,
      id: tramite.id
    });
    setTramiteType(tramite.data.tipo_tramite || (tramite.data.vehiculo?.tipo?.toLowerCase().includes('moto') ? 'moto' : 'auto'));
    setView('edit');
  };

  const handleUpdateSuccess = () => {
    setView('history');
    setEditingTramite(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-6 max-w-md mx-auto px-6">
          <Loader2 className="w-12 h-12 text-brand-mint animate-spin" />
          <AnimatePresence>
            {showSupportMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Info className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  ¿La carga está tomando mucho tiempo?
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Si la aplicación no responde, puede contactar con soporte técnico
                </p>
                <a 
                  href="https://wa.me/543435086453" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-colors text-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Contactar por WhatsApp
                </a>
                <p className="text-gray-500 text-xs mt-3 font-mono">
                  +54 343 508-6453
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginView />;
  }

  return (
    <main className="relative min-h-screen bg-[#F8FAFC] flex flex-col overflow-x-hidden">
      {/* Header / Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-50 overflow-hidden cursor-pointer" onClick={handleGoHome}>
              <img src="/logo.svg" alt="Logo" className="w-full h-full p-1" />
            </div>
            <span className="text-2xl font-serif font-bold text-brand-black tracking-tight cursor-pointer" onClick={handleGoHome}>
              Escribanía<span className="text-brand-mint ml-1">RM</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
            <button 
              onClick={() => setView('history')} 
              className={`hover:text-brand-mint transition-colors flex items-center gap-2 ${view === 'history' ? 'text-brand-mint' : ''}`}
            >
              <Clock size={18} /> Historial
            </button>
            <a href="mailto:somos.env@gmail.com" className="bg-brand-mint/10 text-brand-mint px-5 py-2.5 rounded-xl hover:bg-brand-mint/20 transition-all">Soporte</a>
            <button 
              onClick={handleLogout}
              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile Support/Logout */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setView('history')}
              className={`p-2.5 rounded-xl transition-all ${view === 'history' ? 'bg-brand-mint/10 text-brand-mint' : 'text-gray-400 bg-gray-50'}`}
              title="Historial"
            >
              <Clock size={20} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2.5 text-gray-400 hover:text-red-500 bg-gray-50 rounded-xl transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="relative pt-20 md:pt-24 pb-20 md:pb-32 flex-1">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <AnimatePresence mode="wait">
            {view === 'history' ? (
              <motion.div 
                key="history-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <button
                  onClick={handleGoHome}
                  className="mb-8 flex items-center gap-2 text-gray-400 hover:text-brand-mint font-bold uppercase text-xs tracking-widest transition-colors"
                >
                  <ArrowLeft size={16} /> Volver al Inicio
                </button>
                <HistoryView onEdit={handleEdit} />
              </motion.div>
            ) : view === 'edit' ? (
              <motion.div 
                key="edit-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => setView('history')}
                      className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-brand-mint hover:shadow-lg transition-all border border-gray-100"
                    >
                      <ArrowLeft size="20" />
                    </button>
                    <div>
                      <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        Editando <span className="text-brand-mint">Borrador</span>
                      </h1>
                      <p className="text-gray-500 font-medium">Modifique los datos necesarios y guarde los cambios</p>
                    </div>
                  </div>
                </div>
                <Wizard 
                  type={tramiteType!} 
                  initialData={editingTramite} 
                  onSuccess={handleUpdateSuccess}
                />
              </motion.div>
            ) : !tramiteType ? (
              <motion.div 
                key="home-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="text-center mb-16">
                  <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                    Gestión de <span className="text-brand-mint">Trámites 08</span>
                  </h1>
                  <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                    Seleccione el tipo de vehículo para iniciar la carga del formulario.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <button
                    onClick={() => setTramiteType('auto')}
                    className="group relative bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-brand-mint/30 hover:border-brand-mint/30 transition-all duration-500 text-left overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-mint/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50" />

                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-brand-mint rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-brand-mint/20 group-hover:scale-110 transition-transform duration-500">
                        <Car size={32} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Automóviles</h3>
                      <p className="text-gray-500 font-medium leading-relaxed mb-6">
                        Trámites para autos, camionetas y vehículos de carga.
                      </p>
                      <div className="flex items-center gap-2 text-brand-mint font-bold uppercase text-xs tracking-widest">
                        Comenzar trámite <ChevronRight size={16} />
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setTramiteType('moto')}
                    className="group relative bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-brand-black/30 hover:border-brand-black/30 transition-all duration-500 text-left overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-black/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50" />

                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-brand-black rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-brand-black/20 group-hover:scale-110 transition-transform duration-500">
                        <Bike size={32} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Motocicletas</h3>
                      <p className="text-gray-500 font-medium leading-relaxed mb-6">
                        Trámites específicos para motovehículos y cuatriciclos.
                      </p>
                      <div className="flex items-center gap-2 text-brand-black font-bold uppercase text-xs tracking-widest">
                        Comenzar trámite <ChevronRight size={16} />
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="wizard-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => setTramiteType(null)}
                      className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-brand-mint hover:shadow-lg transition-all border border-gray-100"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        Formulario 08 - <span className="text-brand-mint">{tramiteType === 'auto' ? 'Automóvil' : 'Motocicleta'}</span>
                      </h1>
                      <p className="text-gray-500 font-medium">Complete los pasos para generar el documento oficial</p>
                    </div>
                  </div>
                  <div className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] border self-start md:self-center ${
                    tramiteType === 'auto' ? 'bg-brand-mint/10 text-brand-mint border-brand-mint/20' : 'bg-brand-black/10 text-brand-black border-brand-black/20'
                  }`}>
                    Trámite {tramiteType}
                  </div>
                </div>

                <Wizard type={tramiteType!} />
              </motion.div>
            )}
        </AnimatePresence>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-40 -left-64 w-96 h-96 bg-brand-mint/10 rounded-full blur-3xl opacity-30 -z-10" />
      <div className="absolute top-1/2 -right-64 w-96 h-96 bg-brand-black/10 rounded-full blur-3xl opacity-30 -z-10" />

      {/* Footer */}
      <footer className="py-12 text-center text-gray-400 text-sm font-bold uppercase tracking-widest mt-auto bg-[#F8FAFC]">
        <p>© 2026 RM Escribanía Argentina</p>
      </footer>
    </main>
  );
}

