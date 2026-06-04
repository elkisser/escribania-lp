"use client";

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Cliente {
  id: string;
  user_id: string;
  tipo_persona: 'fisica' | 'juridica';
  nombre: string;
  apellido?: string;
  dni?: string;
  cuit?: string;
  pais?: string;
  sexo?: string;
  fecha_nacimiento?: string;
  lugar_nacimiento?: string;
  autoridad_o_pais_expidio?: string;
  telefono?: string;
  profesion?: string;
  nombre_conyugue?: string;
  domicilio_real?: string;
  domicilio_real_numero?: string;
  domicilio_real_piso?: string;
  domicilio_real_depto?: string;
  domicilio_real_cp?: string;
  domicilio_real_localidad?: string;
  domicilio_legal?: string;
  domicilio_legal_numero?: string;
  domicilio_legal_piso?: string;
  domicilio_legal_depto?: string;
  domicilio_legal_cp?: string;
  domicilio_legal_localidad?: string;
  domicilio_departamento_o_partido?: string;
  domicilio_provincia?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export function useClientSearch(userId: string) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Cliente[]>([]);

  // Buscar clientes por término (DNI, CUIT, nombre)
  const searchClients = useCallback(async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const cleanTerm = searchTerm.replace(/[.\-\s]/g, '');
      
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('user_id', userId)
        .or(`dni.ilike.%${cleanTerm}%,cuit.ilike.%${cleanTerm}%,nombre.ilike.%${searchTerm}%`)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      setSearchResults(data || []);
    } catch (err) {
      console.error('Error searching clients:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [userId]);

  // Guardar o actualizar cliente automáticamente
  const saveOrUpdateClient = useCallback(async (clientData: Partial<Cliente>): Promise<boolean> => {
    try {
      // Validar que tenga al menos nombre y DNI
      if (!clientData.nombre || !clientData.dni) {
        return false;
      }

      const cleanDni = clientData.dni.replace(/[.\-\s]/g, '');

      // Buscar si ya existe un cliente con ese DNI
      const { data: existing } = await supabase
        .from('clientes')
        .select('id')
        .eq('user_id', userId)
        .eq('dni', cleanDni)
        .single();

      const dataToSave = {
        ...clientData,
        user_id: userId,
        dni: cleanDni,
        cuit: clientData.cuit?.replace(/[.\-\s]/g, ''),
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        // Actualizar cliente existente
        const { error } = await supabase
          .from('clientes')
          .update(dataToSave)
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Crear nuevo cliente
        const { error } = await supabase
          .from('clientes')
          .insert(dataToSave);

        if (error) throw error;
      }

      return true;
    } catch (err) {
      console.error('Error saving/updating client:', err);
      return false;
    }
  }, [userId]);

  return {
    isSearching,
    searchResults,
    searchClients,
    saveOrUpdateClient,
  };
}
