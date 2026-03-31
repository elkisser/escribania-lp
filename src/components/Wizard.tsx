"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Save, FileText, CheckCircle, User, Users, Car, CreditCard, Loader2 } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { TramiteSchema, TramiteData } from '@/lib/schemas';
import { generate08 } from '@/lib/pdf/generator';
import { supabase } from '@/lib/supabase';

// Steps components will be imported or defined here
import { StepPerson, StepVehicle, StepOperation } from '@/components/FormSteps';

const steps = [
  { id: 'vendedor', title: 'Vendedor', icon: <User className="w-6 h-6" /> },
  { id: 'vendedor_condominio', title: 'Condominio Vendedor', icon: <Users className="w-6 h-6" /> },
  { id: 'comprador', title: 'Comprador', icon: <User className="w-6 h-6" /> },
  { id: 'comprador_condominio', title: 'Condominio Comprador', icon: <Users className="w-6 h-6" /> },
  { id: 'vehiculo', title: 'Vehículo', icon: <Car className="w-6 h-6" /> },
  { id: 'operacion', title: 'Operación', icon: <CreditCard className="w-6 h-6" /> },
];

interface WizardProps {
  type: 'auto' | 'moto';
  initialData?: TramiteData;
  onSuccess?: () => void;
}

export default function Wizard({ type, initialData, onSuccess }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const methods = useForm<TramiteData>({
    resolver: zodResolver(TramiteSchema) as any,
    mode: 'onBlur',
    values: initialData || {
      vehiculo: {
        tipo: type === 'auto' ? 'AUTOMOVIL' : 'MOTOCICLETA',
        uso: 'Privado',
        marca: '',
        modelo: '',
        dominio: '',
        motor: '',
        chasis: '',
        n_motor: '',
        n_chasis: ''
      },
      vendedor: {
        nombre: '', dni: '', cuit: '', fecha_nacimiento: '', domicilio: '', email: '', telefono: '',
        domicilio_legal: '', domicilio_legal_numero: '', domicilio_legal_piso: '', domicilio_legal_depto: '', domicilio_legal_cp: '', domicilio_legal_localidad: '',
        domicilio_real: '', domicilio_real_numero: '', domicilio_real_piso: '', domicilio_real_depto: '', domicilio_real_cp: '', domicilio_real_localidad: '',
        domicilio_departamento_o_partido: '', domicilio_provincia: '', lugar_nacimiento: '', nombre_conyugue: '',
        pais: 'Argentina', sexo: '', porcentaje_entero: '100', porcentaje_decimal: '00'
      },
      vendedor_condominio: {
        nombre: '', dni: '', cuit: '', fecha_nacimiento: '', domicilio: '', email: '', telefono: '',
        domicilio_legal: '', domicilio_legal_numero: '', domicilio_legal_piso: '', domicilio_legal_depto: '', domicilio_legal_cp: '', domicilio_legal_localidad: '',
        domicilio_real: '', domicilio_real_numero: '', domicilio_real_piso: '', domicilio_real_depto: '', domicilio_real_cp: '', domicilio_real_localidad: '',
        domicilio_departamento_o_partido: '', domicilio_provincia: '', lugar_nacimiento: '', nombre_conyugue: '',
        pais: 'Argentina', sexo: '', porcentaje_entero: '0', porcentaje_decimal: '00'
      },
      comprador: {
        nombre: '', dni: '', cuit: '', fecha_nacimiento: '', domicilio: '', email: '', telefono: '',
        domicilio_legal: '', domicilio_legal_numero: '', domicilio_legal_piso: '', domicilio_legal_depto: '', domicilio_legal_cp: '', domicilio_legal_localidad: '',
        domicilio_real: '', domicilio_real_numero: '', domicilio_real_piso: '', domicilio_real_depto: '', domicilio_real_cp: '', domicilio_real_localidad: '',
        domicilio_departamento_o_partido: '', domicilio_provincia: '', lugar_nacimiento: '', nombre_conyugue: '',
        pais: 'Argentina', sexo: '', porcentaje_entero: '100', porcentaje_decimal: '00'
      },
      comprador_condominio: {
        nombre: '', dni: '', cuit: '', fecha_nacimiento: '', domicilio: '', email: '', telefono: '',
        domicilio_legal: '', domicilio_legal_numero: '', domicilio_legal_piso: '', domicilio_legal_depto: '', domicilio_legal_cp: '', domicilio_legal_localidad: '',
        domicilio_real: '', domicilio_real_numero: '', domicilio_real_piso: '', domicilio_real_depto: '', domicilio_real_cp: '', domicilio_real_localidad: '',
        domicilio_departamento_o_partido: '', domicilio_provincia: '', lugar_nacimiento: '', nombre_conyugue: '',
        pais: 'Argentina', sexo: '', porcentaje_entero: '0', porcentaje_decimal: '00'
      },
      fecha: new Date().toISOString().split('T')[0],
      lugar: '',
      precio: ''
    }
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const next = async () => {
      const fields = getFieldsForStep(currentStep);
      const isValid = await methods.trigger(fields as any);
      
      if (isValid) {
        setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
      } else {
        // Encontrar el primer campo con error y hacer scroll hacia él
        setTimeout(() => {
          const firstErrorField = document.querySelector('[aria-invalid="true"], .text-red-500');
          if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    };

  const prev = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0: return ['vendedor'];
      case 1: return ['vendedor_condominio'];
      case 2: return ['comprador'];
      case 3: return ['comprador_condominio'];
      case 4: return ['vehiculo'];
      case 5: return ['precio', 'fecha', 'lugar'];
      default: return [];
    }
  };


  const onSaveDraft = async () => {
    setIsSaving(true);
    const formData = methods.getValues();
    const data = { ...formData, tipo_tramite: type };
    try {
      let result;
      if (initialData && (initialData as any).id) {
        // Update existing
        result = await supabase
          .from('tramites_08')
          .update({
            data: data,
            status: 'borrador'
          })
          .eq('id', (initialData as any).id);
      } else {
        // Insert new
        result = await supabase
          .from('tramites_08')
          .insert([{
            data: data,
            status: 'borrador'
          }])
          .select();
      }

      if (result.error) throw result.error;

      toast.success('Borrador guardado correctamente.');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error('Error guardando borrador: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const onGeneratePDF = async () => {
    const isValid = await methods.trigger();
    if (!isValid) {
      toast.error('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }

    setIsGenerating(true);
    const data = methods.getValues();
    try {
      // Usamos el 'type' del componente (prop) para elegir el PDF base (auto/moto)
      // Pero los datos del formulario (data) llevan lo que el usuario escribió
      const pdfBytes = await generate08(data, type);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      window.open(url, '_blank');
      toast.success('PDF generado correctamente.');
    } catch (error: any) {
      toast.error('Error generando PDF: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-8 mb-20 animate-in fade-in duration-700">
      {/* Progress Bar */}
      <div className="mb-8 md:mb-14 px-2">
        <div className="flex justify-between items-center relative gap-2 md:gap-4">
          <div className="absolute top-1/2 left-0 w-full h-[2px] md:h-[3px] bg-gray-100 -z-10 -translate-y-1/2 rounded-full" />
          <motion.div 
            className="absolute top-1/2 left-0 h-[2px] md:h-[3px] bg-brand-mint -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center group cursor-pointer flex-1" onClick={() => setCurrentStep(idx)}>
              <div 
                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                  idx < currentStep ? 'bg-brand-mint text-white border-brand-mint shadow-lg' : 
                  idx === currentStep ? 'bg-white text-brand-mint border-brand-mint shadow-xl scale-110' : 
                  'bg-white text-gray-300 border-gray-100 shadow-sm'
                }`}
              >
                {idx < currentStep ? <CheckCircle className="w-5 h-5 md:w-6 md:h-6" /> : <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">{step.icon}</div>}
              </div>

              <span className={`mt-2 md:mt-3 text-[8px] md:text-[10px] font-black uppercase tracking-tight text-center leading-none transition-colors max-w-[60px] md:max-w-[80px] h-3 md:h-4 flex items-center justify-center ${
                idx <= currentStep ? 'text-brand-mint' : 'text-gray-400'
              } ${idx === currentStep ? 'opacity-100' : 'opacity-60 md:opacity-100'}`}>
                <span className="hidden md:inline">{step.title}</span>
                <span className="md:hidden">{idx + 1}</span>
              </span>
            </div>
          ))}
        </div>
      </div>


      <FormProvider {...methods}>
        <form 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
              e.preventDefault();
              next();
            }
          }}
          className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-6 md:p-14 border border-gray-50 min-h-[400px] md:min-h-[500px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-brand-mint/10 rounded-bl-full -z-0 opacity-40 translate-x-6 -translate-y-6 md:translate-x-8 md:translate-y-8" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="relative z-10"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 md:mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3 md:gap-4">
                  <span className="bg-brand-mint/10 p-2 md:p-3 rounded-xl md:rounded-2xl text-brand-mint">{steps[currentStep].icon}</span>
                  {steps[currentStep].title}
                </h2>
                <p className="text-gray-500 mt-1 md:mt-2 text-base md:text-lg font-medium">Por favor completa los datos correspondientes.</p>
              </div>

              <div className="min-h-[250px] md:min-h-[350px]">
                {currentStep === 0 && <StepPerson type="vendedor" />}
                {currentStep === 1 && <StepPerson type="vendedor_condominio" />}
                {currentStep === 2 && <StepPerson type="comprador" />}
                {currentStep === 3 && <StepPerson type="comprador_condominio" />}
                {currentStep === 4 && <StepVehicle type={type} />}
                {currentStep === 5 && <StepOperation />}
              </div>

              {/* Navigation Buttons - Desktop */}
              <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-6 mt-16 pt-10 border-t border-gray-100">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={prev}
                    disabled={currentStep === 0}
                    className="flex-1 md:flex-none px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-gray-200 text-gray-400 hover:text-brand-mint hover:border-brand-mint hover:shadow-lg"
                  >
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </button>
                  <button
                    type="button"
                    onClick={onSaveDraft}
                    disabled={isSaving}
                    className="flex-1 md:flex-none px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all bg-white border border-gray-200 text-gray-400 hover:text-brand-black hover:border-brand-black hover:shadow-lg"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Borrador
                  </button>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  {currentStep === steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={onGeneratePDF}
                      disabled={isGenerating}
                      className="w-full md:w-auto px-10 py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-3 transition-all bg-brand-black text-white hover:bg-gray-800 shadow-xl shadow-gray-200"
                    >
                      {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />} Generar Formulario
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={next}
                      className="w-full md:w-auto px-10 py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-3 transition-all bg-brand-mint text-white hover:bg-emerald-600 shadow-xl shadow-brand-mint/20"
                    >
                      Siguiente <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </form>
      </FormProvider>

      {/* Mobile Navigation - Fixed Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 pb-6 z-[9999] shadow-[0_-10px_40px_rgba(0,0,0,0.12)]">
        <div className="grid grid-cols-[48px_1fr_1.2fr] gap-3 w-full max-w-lg mx-auto">
          <button
            type="button"
            onClick={prev}
            disabled={currentStep === 0}
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all disabled:opacity-10 bg-slate-100 text-slate-600 border border-slate-200 active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="h-12 rounded-xl font-bold uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5 transition-all bg-white border-2 border-brand-mint/30 text-slate-600 active:scale-95 shadow-sm px-1"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-brand-mint" /> : <Save className="w-4 h-4 text-brand-mint" />} Borrador
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              type="button"
              onClick={onGeneratePDF}
              disabled={isGenerating}
              className="h-12 rounded-xl font-black uppercase tracking-wider text-[9px] flex items-center justify-center gap-1.5 transition-all bg-brand-black text-white shadow-xl active:scale-95 px-1"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />} Generar
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              className="h-12 rounded-xl font-black uppercase tracking-wider text-[9px] flex items-center justify-center gap-1.5 transition-all bg-brand-mint text-white shadow-lg shadow-brand-mint/30 active:scale-95 px-1"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
