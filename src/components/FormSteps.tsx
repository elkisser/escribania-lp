"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { MapPin, DollarSign, Calendar, Loader2 } from 'lucide-react';


interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  icon?: React.ReactNode;
}

const formatDNI = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}`;
};

const formatCUIL = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10, 11)}`;
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
};

const formatCurrency = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const amount = parseInt(digits) / 100;
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(amount);
};

export function FormInput({ label, name, icon, ...props }: FormInputProps) {
  const { register, setValue, formState: { errors } } = useFormContext();
  const error = (errors as any)[name.split('.')[0]]?.[name.split('.')[1]] || (errors as any)[name];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Si hay un onChange personalizado en props, lo llamamos primero
    if (props.onChange) {
      props.onChange(e);
    }

    let val = e.target.value;
    
    if (name.includes('dni')) val = formatDNI(val);
    else if (name.includes('cuit')) val = formatCUIL(val);
    else if (name.includes('precio')) val = formatCurrency(val);
    
    setValue(name, val, { shouldValidate: true });
  };

  return (
    <div className="w-full group">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1 transition-colors group-focus-within:text-brand-mint flex items-center gap-2">
        {icon} {label}
      </label>
      <input
        {...register(name)}
        {...props}
        aria-invalid={error ? "true" : "false"}
        onChange={handleChange}
        className={`w-full px-4 py-2.5 rounded-xl border bg-white transition-all outline-none text-base text-slate-900 placeholder:text-slate-300 font-medium ${
          error ? 'border-red-300 ring-4 ring-red-50 focus:ring-red-100' : 'border-slate-200 focus:border-brand-mint focus:ring-4 focus:ring-brand-mint/10'
        }`}
      />
      {error && <p className="mt-1.5 text-[10px] font-bold text-red-500 ml-1 uppercase tracking-wider">{error.message}</p>}
    </div>
  );
}

export function StepPerson({ type }: { type: 'vendedor' | 'comprador' | 'vendedor_condominio' | 'comprador_condominio' }) {
  const prefix = `${type}.`;
  const { watch, setValue } = useFormContext();
  const tipoPersona = watch(`${prefix}tipo_persona`) || 'fisica';
  const porcentajeEntero = watch(`${prefix}porcentaje_entero`);

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
      <div className="flex gap-2 p-1 bg-brand-mint/5 rounded-2xl w-fit mb-2 md:mb-6 border border-brand-mint/10">
        <button
          type="button"
          onClick={() => setValue(`${prefix}tipo_persona`, 'fisica')}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
            tipoPersona === 'fisica' ? 'bg-brand-mint text-white shadow-lg shadow-brand-mint/20' : 'text-slate-400 hover:text-brand-mint hover:bg-brand-mint/5'
          }`}
        >
          Persona Física
        </button>
        <button
          type="button"
          onClick={() => setValue(`${prefix}tipo_persona`, 'juridica')}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
            tipoPersona === 'juridica' ? 'bg-brand-mint text-white shadow-lg shadow-brand-mint/20' : 'text-slate-400 hover:text-brand-mint hover:bg-brand-mint/5'
          }`}
        >
          Sociedad (Jurídica)
        </button>
      </div>

      <div className={`grid grid-cols-1 gap-6 md:gap-10 ${tipoPersona === 'fisica' ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        <FormInput 
          label={tipoPersona === 'fisica' ? "Nombre y apellido completo" : "Denominación"} 
          name={`${prefix}nombre`} 
          placeholder={tipoPersona === 'fisica' ? "Ej: Juan Perez" : "Ej: Escribanía RM S.A."} 
        />
        {tipoPersona === 'fisica' && (
          <FormInput label="DNI" name={`${prefix}dni`} placeholder="Ej: 30.123.456" />
        )}
        <FormInput 
          label={tipoPersona === 'fisica' ? "CUIL/CUIT" : "CUIT"} 
          name={`${prefix}cuit`} 
          placeholder="Ej: 20-30123456-7" 
        />
      </div>

      {tipoPersona === 'fisica' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            <FormInput label="País" name={`${prefix}pais`} placeholder="Ej: Argentina" />
            <FormInput label="Sexo" name={`${prefix}sexo`} placeholder="Ej: Masculino" />
            <FormInput label="Fecha Nacimiento" name={`${prefix}fecha_nacimiento`} type="date" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            <FormInput label="Lugar de Nacimiento" name={`${prefix}lugar_nacimiento`} placeholder="Provincia / País" />
            <FormInput label="Autoridad (o País) que lo expidio" name={`${prefix}autoridad_o_pais_expidio`} placeholder="Ej: RNP" />
            <FormInput label="Teléfono" name={`${prefix}telefono`} placeholder="Ej: (11) 1234-5678" />
          </div>

          <div className={`grid grid-cols-1 ${type.includes('comprador') ? 'md:grid-cols-2' : ''} gap-6 md:gap-10`}>
            {type.includes('comprador') && (
              <FormInput label="Profesión" name={`${prefix}profesion`} placeholder="Ej: Escribano, Comerciante, etc." />
            )}
            <FormInput label="Nombre Cónyuge" name={`${prefix}nombre_conyugue`} placeholder="Si corresponde" />
          </div>
        </>
      )}

      <div className="space-y-6 md:space-y-8 pt-6 border-t border-slate-100">
        <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Porcentajes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <FormInput
            label="Porcentaje Entero"
            name={`${prefix}porcentaje_entero`}
            placeholder="Ej: 100"
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, ''); // solo números
              if (value.length > 3) value = value.slice(0, 3);
              let num = Number(value);

              if (num > 100) value = '100';

              e.target.value = value;
            }}
          />
          
          <FormInput
            label="Porcentaje Decimal"
            name={`${prefix}porcentaje_decimal`}
            placeholder="Ej: 00"
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, '');
              if (value.length > 2) value = value.slice(0, 2);
              
              if (porcentajeEntero === '100') {
                // Si es 100, solo permitimos 0 o 00
                if (value !== '0' && value !== '00') {
                  value = value.startsWith('0') ? '0' : '';
                }
              }

              e.target.value = value;
            }}
          />
        </div>
      </div>

      <div className="space-y-6 md:space-y-8 pt-6 border-t border-slate-100">
        <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Datos de Inscripción</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          <FormInput label="Personería" name={`${prefix}personeria`} placeholder="Ej: Persona Física" />
          <FormInput label="N° de Datos de Inscripción" name={`${prefix}n_datos_inscripcion`} placeholder="Ej: 123456" />
          <FormInput label="Fecha de Inscripción" name={`${prefix}fecha_inscripcion`} type="date" />
        </div>
      </div>

      <div className="space-y-6 md:space-y-8 pt-6 border-t border-slate-100">
        <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Domicilio Real</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          <FormInput label="Calle" name={`${prefix}domicilio_real`} placeholder="Nombre de calle" />
          <FormInput label="Número" name={`${prefix}domicilio_real_numero`} placeholder="Ej: 123" />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Piso" name={`${prefix}domicilio_real_piso`} placeholder="2" />
            <FormInput label="Depto" name={`${prefix}domicilio_real_depto`} placeholder="A" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <FormInput label="CP" name={`${prefix}domicilio_real_cp`} placeholder="Ej: 1425" />
          <FormInput label="Localidad" name={`${prefix}domicilio_real_localidad`} placeholder="Ej: CABA" />
        </div>
      </div>

      <div className="space-y-6 md:space-y-8 pt-6 border-t border-slate-100">
        <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Domicilio Legal / Otros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          <FormInput label="Calle / Legal" name={`${prefix}domicilio_legal`} placeholder="Si difiere del real" />
          <FormInput label="Número" name={`${prefix}domicilio_legal_numero`} placeholder="Ej: 123" />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Piso" name={`${prefix}domicilio_legal_piso`} placeholder="2" />
            <FormInput label="Depto" name={`${prefix}domicilio_legal_depto`} placeholder="A" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <FormInput label="CP" name={`${prefix}domicilio_legal_cp`} placeholder="Ej: 1425" />
          <FormInput label="Localidad" name={`${prefix}domicilio_legal_localidad`} placeholder="Ej: CABA" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <FormInput label="Partido / Depto" name={`${prefix}domicilio_departamento_o_partido`} placeholder="Ej: San Isidro" />
          <FormInput label="Provincia" name={`${prefix}domicilio_provincia`} placeholder="Ej: Buenos Aires" />
        </div>
      </div>

      <FormInput label="Email" name={`${prefix}email`} type="email" placeholder="email@ejemplo.com" />
    </div>
  );
}

export function StepVehicle({ type }: { type: 'auto' | 'moto' }) {
  const isMoto = type === 'moto';

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
      {/* IZQUIERDA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <FormInput label="Tipo de Vehículo" name="vehiculo.tipo" placeholder="Ej: SEDAN 4 PUERTAS, MOTOCICLETA, PICK-UP" />
        <FormInput label="Dominio" name="vehiculo.dominio" placeholder="Ej: AA123BB" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <FormInput label="Marca" name="vehiculo.marca" placeholder="Ej: Toyota" />
        <FormInput label="Modelo" name="vehiculo.modelo" placeholder="Ej: Corolla" />
      </div>

      {/* DERECHA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <FormInput label="Marca Motor" name="vehiculo.motor" placeholder="Ej: Honda i-VTEC" />
        <FormInput label="Número de Motor" name="vehiculo.n_motor" placeholder="Requerido" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <FormInput label={isMoto ? "Marca de Cuadro" : "Marca de Chasis"} name="vehiculo.chasis" placeholder="Ej: 2023" />
        <FormInput label={isMoto ? "Número de Cuadro" : "Número de Chasis"} name="vehiculo.n_chasis" placeholder="Requerido" />
      </div>

      <FormInput label="Uso del Vehículo" name="vehiculo.uso" placeholder="Privado, Carga, etc." />
    </div>
  );
}

export function StepOperation() {
  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <FormInput label="Precio de Compra" name="precio" type="text" placeholder="$ 0,00" icon={<DollarSign className="w-5 h-5" />} />
        <FormInput label="Fecha de Operación" name="fecha" type="date" icon={<Calendar className="w-5 h-5" />} />
      </div>
      <FormInput label="Lugar de Firma" name="lugar" placeholder="Ciudad, Provincia" icon={<MapPin className="w-5 h-5" />} />
      <FormInput label="Observaciones" name="observaciones" placeholder="Observaciones adicionales" />
    </div>
  );
}
