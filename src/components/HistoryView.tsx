"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { FileText, Calendar, Car, Loader2, Trash2, Download, Bike, Edit3, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { generate08 } from '@/lib/pdf/generator';

export interface TramiteRow {
  id: string;
  data: Record<string, unknown>;
  status: string;
  created_at: string;
}

interface HistoryViewProps {
  onEdit: (tramite: TramiteRow) => void;
}

export default function HistoryView({ onEdit }: HistoryViewProps) {
  const [tramites, setTramites] = useState<TramiteRow[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVehicleType, setFilterVehicleType] = useState<'all' | 'auto' | 'moto'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'borrador' | 'finalizado'>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    if (typeof err === 'object' && err !== null && 'message' in err) return String((err as { message: unknown }).message);
    return String(err);
  };

  async function fetchTramites() {
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
  }

  useEffect(() => {
    Promise.resolve().then(() => {
      void fetchTramites();
    });
  }, []);

  // Función auxiliar para extraer información del trámite
  const getTramiteInfo = (tramite: TramiteRow) => {
    const data = tramite.data;
    const tipoTramite = typeof data.tipo_tramite === 'string' ? data.tipo_tramite : '';
    const vehiculo = typeof data.vehiculo === 'object' && data.vehiculo !== null ? (data.vehiculo as Record<string, unknown>) : null;
    const vehiculoTipo = typeof vehiculo?.tipo === 'string' ? vehiculo.tipo : '';
    const isMoto = tipoTramite === 'moto' || vehiculoTipo.toLowerCase().includes('moto');
    const vendedor = typeof data.vendedor === 'object' && data.vendedor !== null ? (data.vendedor as Record<string, unknown>) : null;
    const vendedorNombre = typeof vendedor?.nombre === 'string' && vendedor.nombre.trim() ? vendedor.nombre : 'Sin nombre';
    const dominio = typeof vehiculo?.dominio === 'string' ? vehiculo.dominio : 'S/D';
    const marca = typeof vehiculo?.marca === 'string' ? vehiculo.marca : '';
    
    return { isMoto, vendedorNombre, dominio, marca, vehiculoTipo };
  };

  // Filtrado y búsqueda
  const filteredTramites = useMemo(() => {
    let result = [...tramites];

    // Filtro por búsqueda (nombre o dominio)
    if (searchTerm) {
      result = result.filter(tramite => {
        const { vendedorNombre, dominio } = getTramiteInfo(tramite);
        return vendedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
               dominio.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Filtro por tipo de vehículo
    if (filterVehicleType !== 'all') {
      result = result.filter(tramite => {
        const { isMoto } = getTramiteInfo(tramite);
        return filterVehicleType === 'moto' ? isMoto : !isMoto;
      });
    }

    // Filtro por estado
    if (filterStatus !== 'all') {
      result = result.filter(tramite => tramite.status === filterStatus);
    }

    return result;
  }, [tramites, searchTerm, filterVehicleType, filterStatus]);

  // Paginación
  const totalPages = Math.ceil(filteredTramites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTramites = filteredTramites.slice(startIndex, endIndex);

  // Resetear a página 1 cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterVehicleType, filterStatus]);

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
      
      // Ajustar página si es necesario
      const newFilteredCount = filteredTramites.length - 1;
      const newTotalPages = Math.ceil(newFilteredCount / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  };

  const downloadPDF = async (tramite: TramiteRow) => {
    try {
      const data = tramite.data;
      const vehiculo = typeof data.vehiculo === 'object' && data.vehiculo !== null ? (data.vehiculo as Record<string, unknown>) : null;
      const vehiculoTipo = typeof vehiculo?.tipo === 'string' ? vehiculo.tipo : '';
      const type: 'auto' | 'moto' = vehiculoTipo.toLowerCase().includes('moto') ? 'moto' : 'auto';

      const pdfBytes = await generate08(data, type);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      toast.success('PDF generado correctamente');
    } catch (error: unknown) {
      toast.error('Error generando PDF: ' + getErrorMessage(error));
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

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-[2rem] p-6 mb-6 border border-gray-100 shadow-lg shadow-gray-200/40">
        {/* Barra de búsqueda */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o dominio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-mint focus:ring-2 focus:ring-brand-mint/20 outline-none transition-all text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal"
          />
        </div>

        {/* Botón para mostrar/ocultar filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 hover:text-brand-mint transition-colors bg-gray-50 rounded-lg hover:bg-gray-100"
        >
          <Filter size={16} />
          {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>

        {/* Panel de filtros */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100"
          >
            {/* Filtro por tipo de vehículo */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Tipo de vehículo</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterVehicleType('all')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
                    filterVehicleType === 'all'
                      ? 'bg-brand-mint text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilterVehicleType('auto')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    filterVehicleType === 'auto'
                      ? 'bg-brand-mint text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Car size={16} /> Auto
                </button>
                <button
                  onClick={() => setFilterVehicleType('moto')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    filterVehicleType === 'moto'
                      ? 'bg-brand-mint text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Bike size={16} /> Moto
                </button>
              </div>
            </div>

            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Estado</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
                    filterStatus === 'all'
                      ? 'bg-brand-mint text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilterStatus('borrador')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
                    filterStatus === 'borrador'
                      ? 'bg-brand-mint text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Borrador
                </button>
                <button
                  onClick={() => setFilterStatus('finalizado')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
                    filterStatus === 'finalizado'
                      ? 'bg-brand-mint text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Finalizado
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Contador de resultados */}
        <div className="mt-4 text-sm text-gray-700 font-bold">
          {filteredTramites.length === tramites.length 
            ? `${tramites.length} trámite${tramites.length !== 1 ? 's' : ''} en total`
            : `${filteredTramites.length} de ${tramites.length} trámite${tramites.length !== 1 ? 's' : ''}`
          }
        </div>
      </div>

      {filteredTramites.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-gray-100 shadow-xl shadow-gray-200/50">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
            <FileText size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {tramites.length === 0 ? 'No hay trámites registrados' : 'No se encontraron resultados'}
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {tramites.length === 0 
              ? 'Comienza a cargar un nuevo formulario 08 para verlo aquí.'
              : 'Intenta ajustar los filtros de búsqueda.'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6">
            {currentTramites.map((tramite) => {
              const { isMoto, vendedorNombre, dominio, marca } = getTramiteInfo(tramite);

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
                            {vendedorNombre}
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
                            <span className="truncate">{dominio} - {marca}</span>
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

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                  // Mostrar solo páginas cercanas a la actual
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[40px] px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                          currentPage === page
                            ? 'bg-brand-mint text-white'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="text-gray-400 px-1">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
