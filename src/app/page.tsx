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
  const [tramiteType, setTramiteType] = useState<'auto' | 'moto' | null>(null);
  const [view, setView] = useState<'home' | 'history' | 'edit'>('home');
  const [editingTramite, setEditingTramite] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
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
    setTramiteType(tramite.data.vehiculo?.tipo?.toLowerCase().includes('moto') ? 'moto' : 'auto');
    setView('edit');
  };

  const handleUpdateSuccess = () => {
    setView('history');
    setEditingTramite(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 text-brand-mint animate-spin" />
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
              Escribanía<span className="text-brand-mint ml-1">LP</span>
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
        <p>© 2026 LP Escribanía Argentina</p>
      </footer>
    </main>
  );
}

