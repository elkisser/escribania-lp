"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { FileText, Calendar, User, Car, ArrowRight, Loader2, Trash2, Download, Bike, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import { generate08 } from '@/lib/pdf/generator';

interface Tramite {
  id: string;
  data: any;
  status: string;
  created_at: string;
}

interface HistoryViewProps {
  onEdit: (tramite: Tramite) => void;
}

export default function HistoryView({ onEdit }: HistoryViewProps) {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTramites();
  }, []);

  const fetchTramites = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tramites_08')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tramites:', error);
    } else {
      setTramites(data || []);
    }
    setLoading(false);
  };

  const deleteTramite = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este trámite?')) return;
    
    const { error } = await supabase
      .from('tramites_08')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Error al eliminar: ' + error.message);
    } else {
      toast.success('Trámite eliminado');
      setTramites(tramites.filter(t => t.id !== id));
    }
  };

  const downloadPDF = async (tramite: Tramite) => {
    try {
      const type = tramite.data.vehiculo?.tipo?.toLowerCase().includes('moto') ? 'moto' : 'auto';
      const pdfBytes = await generate08(tramite.data, type as 'auto' | 'moto');
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      toast.success('PDF generado correctamente');
    } catch (error: any) {
      toast.error('Error generando PDF: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-brand-mint animate-spin" />
        <p className="text-gray-500 font-medium">Cargando historial...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
          Historial de <span className="text-brand-mint">Trámites</span>
        </h1>
        <p className="text-gray-500 font-medium text-lg">Visualiza y gestiona los formularios generados anteriormente.</p>
      </div>

      {tramites.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-gray-100 shadow-xl shadow-gray-200/50">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
            <FileText size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No hay trámites registrados</h3>
          <p className="text-gray-500 max-w-sm mx-auto">Comienza a cargar un nuevo formulario 08 para verlo aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tramites.map((tramite) => {
            const isMoto = tramite.data.tipo_tramite === 'moto' || 
                          tramite.data.vehiculo?.tipo?.toLowerCase().includes('moto');
            return (
              <motion.div
                key={tramite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/40 hover:shadow-brand-mint/10 hover:border-brand-mint/30 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                  <div className="flex items-center md:items-start gap-4 md:gap-5">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-mint/10 rounded-xl md:rounded-2xl flex items-center justify-center text-brand-mint shrink-0 group-hover:scale-110 transition-transform">
                      {isMoto ? <Bike size={24} className="md:w-7 md:h-7" /> : <Car size={24} className="md:w-7 md:h-7" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight truncate max-w-[150px] md:max-w-none">
                          {tramite.data.vendedor?.nombre || 'Sin nombre'}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-wider ${
                          tramite.status === 'borrador' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                          {tramite.status === 'borrador' ? 'Borrador' : 'Finalizado'}
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-y-1 md:gap-y-2 md:gap-x-6 text-xs md:text-sm text-gray-400 font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-brand-mint" />
                          <span className="truncate">{new Date(tramite.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isMoto ? <Bike size={14} className="text-brand-mint" /> : <Car size={14} className="text-brand-mint" />}
                          <span className="truncate">{tramite.data.vehiculo?.dominio || 'S/D'} - {tramite.data.vehiculo?.marca}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-2 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-gray-50">
                    <div className="flex items-center gap-1 md:gap-3">
                      <button
                        onClick={() => deleteTramite(tramite.id)}
                        className="p-2.5 md:p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={18} className="md:w-5 md:h-5" />
                      </button>
                      <button
                        onClick={() => onEdit(tramite)}
                        className="p-2.5 md:p-3 text-gray-400 hover:text-brand-mint hover:bg-brand-mint/5 rounded-xl transition-all"
                        title={tramite.status === 'borrador' ? 'Editar borrador' : 'Editar trámite'}
                      >
                        <Edit3 size={18} className="md:w-5 md:h-5" />
                      </button>
                    </div>
                    <button
                      onClick={() => downloadPDF(tramite)}
                      className="flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-brand-black text-white rounded-xl font-bold text-xs md:text-sm hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                    >
                      <Download size={16} className="md:w-4 md:h-4" /> <span className="md:inline">PDF</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
