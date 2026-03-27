"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UseFormReturn } from 'react-hook-form';

export function usePersonSearch(methods: UseFormReturn<any>, prefix: string) {
  const [isSearching, setIsSearching] = useState(false);

  const searchPerson = async () => {
    const dni = methods.getValues(`${prefix}dni`);
    if (!dni || dni.length < 7) {
      alert('Por favor ingrese un DNI válido para buscar.');
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .eq('dni', dni)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          alert('Persona no encontrada en la base de datos.');
        } else {
          throw error;
        }
      } else if (data) {
        // Map data to form fields
        methods.setValue(`${prefix}nombre`, data.nombre);
        methods.setValue(`${prefix}apellido`, data.apellido);
        methods.setValue(`${prefix}cuit`, data.cuit);
        methods.setValue(`${prefix}fecha_nacimiento`, data.fecha_nacimiento);
        methods.setValue(`${prefix}estado_civil`, data.estado_civil);
        methods.setValue(`${prefix}domicilio`, data.domicilio);
        methods.setValue(`${prefix}email`, data.email);
        methods.setValue(`${prefix}telefono`, data.telefono);
        
        alert(`Datos de ${data.nombre} ${data.apellido} cargados correctamente.`);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      alert('Error en la búsqueda: ' + err.message);
    } finally {
      setIsSearching(false);
    }
  };

  return { searchPerson, isSearching };
}
