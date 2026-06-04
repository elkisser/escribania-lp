"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, User } from 'lucide-react';
import { useClientSearch, Cliente } from '@/hooks/useClientSearch';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { toast } from 'sonner';

interface ClientAutocompleteProps {
  userId: string;
  prefix: string; // 'vendedor' | 'comprador' | 'vendedor_condominio' | 'comprador_condominio'
  methods: UseFormReturn<FieldValues>;
  onClientSelected?: (client: Cliente) => void;
}

export default function ClientAutocomplete({ 
  userId, 
  prefix, 
  methods,
  onClientSelected 
}: ClientAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { isSearching, searchResults, searchClients } = useClientSearch(userId);

  // Buscar mientras el usuario escribe
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        void searchClients(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchClients]);

  // Cerrar resultados al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autocompletar formulario con datos del cliente
  const fillFormWithClient = (client: Cliente) => {
    methods.setValue(`${prefix}.tipo_persona`, client.tipo_persona || 'fisica');
    methods.setValue(`${prefix}.nombre`, client.nombre || '');
    if (client.apellido) methods.setValue(`${prefix}.apellido`, client.apellido);
    if (client.dni) methods.setValue(`${prefix}.dni`, client.dni);
    if (client.cuit) methods.setValue(`${prefix}.cuit`, client.cuit);
    if (client.pais) methods.setValue(`${prefix}.pais`, client.pais);
    if (client.sexo) methods.setValue(`${prefix}.sexo`, client.sexo);
    if (client.fecha_nacimiento) methods.setValue(`${prefix}.fecha_nacimiento`, client.fecha_nacimiento);
    if (client.lugar_nacimiento) methods.setValue(`${prefix}.lugar_nacimiento`, client.lugar_nacimiento);
    if (client.autoridad_o_pais_expidio) methods.setValue(`${prefix}.autoridad_o_pais_expidio`, client.autoridad_o_pais_expidio);
    if (client.telefono) methods.setValue(`${prefix}.telefono`, client.telefono);
    if (client.profesion) methods.setValue(`${prefix}.profesion`, client.profesion);
    
    // Domicilio real
    if (client.domicilio_real) methods.setValue(`${prefix}.domicilio_real`, client.domicilio_real);
    if (client.domicilio_real_numero) methods.setValue(`${prefix}.domicilio_real_numero`, client.domicilio_real_numero);
    if (client.domicilio_real_piso) methods.setValue(`${prefix}.domicilio_real_piso`, client.domicilio_real_piso);
    if (client.domicilio_real_depto) methods.setValue(`${prefix}.domicilio_real_depto`, client.domicilio_real_depto);
    if (client.domicilio_real_cp) methods.setValue(`${prefix}.domicilio_real_cp`, client.domicilio_real_cp);
    if (client.domicilio_real_localidad) methods.setValue(`${prefix}.domicilio_real_localidad`, client.domicilio_real_localidad);
    
    // Domicilio legal
    if (client.domicilio_legal) methods.setValue(`${prefix}.domicilio_legal`, client.domicilio_legal);
    if (client.domicilio_legal_numero) methods.setValue(`${prefix}.domicilio_legal_numero`, client.domicilio_legal_numero);
    if (client.domicilio_legal_piso) methods.setValue(`${prefix}.domicilio_legal_piso`, client.domicilio_legal_piso);
    if (client.domicilio_legal_depto) methods.setValue(`${prefix}.domicilio_legal_depto`, client.domicilio_legal_depto);
    if (client.domicilio_legal_cp) methods.setValue(`${prefix}.domicilio_legal_cp`, client.domicilio_legal_cp);
    if (client.domicilio_legal_localidad) methods.setValue(`${prefix}.domicilio_legal_localidad`, client.domicilio_legal_localidad);
    if (client.domicilio_departamento_o_partido) methods.setValue(`${prefix}.domicilio_departamento_o_partido`, client.domicilio_departamento_o_partido);
    if (client.domicilio_provincia) methods.setValue(`${prefix}.domicilio_provincia`, client.domicilio_provincia);
    
    if (client.email) methods.setValue(`${prefix}.email`, client.email);
    
    setSelectedClient(client);
    setShowResults(false);
    setSearchTerm('');
    toast.success(`Datos de ${client.nombre} cargados correctamente`);
    
    if (onClientSelected) {
      onClientSelected(client);
    }
  };

  return (
    <div ref={containerRef} className="relative mb-8">
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em]">
          Buscar persona existente
        </label>
        
        {/* Barra de búsqueda minimalista */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-mint" size={20} strokeWidth={2} />
          <input
            type="text"
            placeholder="DNI, CUIT o nombre..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-100 focus:border-brand-mint/50 outline-none transition-all bg-white text-gray-900 font-bold text-base placeholder:text-gray-300 placeholder:font-normal"
          />
          
          {isSearching && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-mint animate-spin" size={20} strokeWidth={2} />
          )}
        </div>

        {/* Cliente seleccionado */}
        {selectedClient && (
          <div className="flex items-center gap-2 text-sm bg-brand-mint/5 rounded-lg px-4 py-3 border-l-4 border-brand-mint">
            <User size={16} strokeWidth={2} className="text-brand-mint" />
            <span className="text-gray-700 font-bold">
              ✓ {selectedClient.nombre} {selectedClient.dni && `(${selectedClient.dni})`}
            </span>
          </div>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border-2 border-gray-100 max-h-80 overflow-y-auto">
          {searchResults.map((client) => (
            <button
              key={client.id}
              type="button"
              onClick={() => fillFormWithClient(client)}
              className="w-full px-5 py-4 text-left hover:bg-gray-50 active:bg-brand-mint/5 transition-colors border-b border-gray-50 last:border-0 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-base group-hover:text-brand-mint transition-colors">
                    {client.nombre}
                    {client.tipo_persona === 'juridica' && <span className="ml-2 text-xs text-gray-400 font-normal">(Jurídica)</span>}
                  </div>
                  <div className="text-sm text-gray-500 mt-1 font-medium">
                    {client.dni && <span>DNI {client.dni}</span>}
                    {client.cuit && <span className="ml-3">· CUIT {client.cuit}</span>}
                  </div>
                  {client.domicilio_real && (
                    <div className="text-xs text-gray-400 mt-1.5 font-normal">
                      {client.domicilio_real} {client.domicilio_real_numero}, {client.domicilio_real_localidad}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-300 font-medium ml-4">
                  {new Date(client.updated_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && searchTerm && searchResults.length === 0 && !isSearching && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border-2 border-gray-100 p-5 text-center">
          <p className="text-gray-500 text-sm font-medium">
            No se encontraron personas con ese criterio
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Los datos se guardarán automáticamente al generar el formulario
          </p>
        </div>
      )}
    </div>
  );
}
