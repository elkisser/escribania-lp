"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { User, Users, Loader2, Trash2, Edit3, Search, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Cliente } from '@/hooks/useClientSearch';

interface ClientsManagerProps {
  userId: string;
}

export default function ClientsManager({ userId }: ClientsManagerProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchClientes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching clientes:', error);
      toast.error('Error al cargar clientes');
    } else {
      setClientes(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void fetchClientes();
  }, [userId]);

  const deleteCliente = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) return;
    
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Error al eliminar: ' + error.message);
    } else {
      toast.success('Cliente eliminado');
      setClientes(clientes.filter(c => c.id !== id));
    }
  };

  const filteredClientes = clientes.filter(cliente => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cliente.nombre?.toLowerCase().includes(searchLower) ||
      cliente.apellido?.toLowerCase().includes(searchLower) ||
      cliente.dni?.includes(searchTerm.replace(/[.\-\s]/g, '')) ||
      cliente.cuit?.includes(searchTerm.replace(/[.\-\s]/g, ''))
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-brand-mint animate-spin" />
        <p className="text-gray-500 font-medium">Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
          Gestión de <span className="text-brand-mint">Clientes</span>
        </h1>
        <p className="text-gray-500 font-medium text-lg">
          Administra tu base de datos de clientes para autocompletar formularios.
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white rounded-[2rem] p-6 mb-6 border border-gray-100 shadow-lg shadow-gray-200/40">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar cliente por nombre, DNI o CUIT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-mint focus:ring-2 focus:ring-brand-mint/20 outline-none transition-all"
          />
        </div>
        
        <div className="mt-4 text-sm text-gray-500 font-medium">
          {filteredClientes.length} cliente{filteredClientes.length !== 1 ? 's' : ''} encontrado{filteredClientes.length !== 1 ? 's' : ''}
        </div>
      </div>

      {filteredClientes.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-gray-100 shadow-xl shadow-gray-200/50">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
            <UserPlus size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {clientes.length === 0 ? 'No hay clientes registrados' : 'No se encontraron resultados'}
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {clientes.length === 0 
              ? 'Los clientes se guardarán automáticamente al completar formularios.'
              : 'Intenta ajustar el término de búsqueda.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredClientes.map((cliente) => (
            <motion.div
              key={cliente.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/40 hover:shadow-brand-mint/10 hover:border-brand-mint/30 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-brand-mint/10 rounded-2xl flex items-center justify-center text-brand-mint shrink-0 group-hover:scale-110 transition-transform">
                    {cliente.tipo_persona === 'juridica' ? <Users size={28} /> : <User size={28} />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {cliente.nombre} {cliente.apellido}
                      </h3>
                      {cliente.tipo_persona === 'juridica' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
                          Jurídica
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      {cliente.dni && (
                        <div>
                          <span className="font-semibold">DNI:</span> {cliente.dni}
                        </div>
                      )}
                      {cliente.cuit && (
                        <div>
                          <span className="font-semibold">CUIT:</span> {cliente.cuit}
                        </div>
                      )}
                      {cliente.email && (
                        <div>
                          <span className="font-semibold">Email:</span> {cliente.email}
                        </div>
                      )}
                      {cliente.telefono && (
                        <div>
                          <span className="font-semibold">Teléfono:</span> {cliente.telefono}
                        </div>
                      )}
                      {cliente.domicilio_real && (
                        <div>
                          <span className="font-semibold">Domicilio:</span>{' '}
                          {cliente.domicilio_real} {cliente.domicilio_real_numero}
                          {cliente.domicilio_real_piso && `, Piso ${cliente.domicilio_real_piso}`}
                          {cliente.domicilio_real_depto && ` ${cliente.domicilio_real_depto}`}
                          {cliente.domicilio_real_localidad && `, ${cliente.domicilio_real_localidad}`}
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-xs text-gray-400">
                      Última actualización: {new Date(cliente.updated_at).toLocaleString('es-AR')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteCliente(cliente.id)}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Eliminar cliente"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
