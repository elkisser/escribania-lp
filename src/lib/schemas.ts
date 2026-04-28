import { z } from 'zod';

export const PersonaSchema = z.object({
  tipo_persona: z.enum(['fisica', 'juridica']).default('fisica'),
  nombre: z.string().optional().or(z.literal('')),
  pais: z.string().optional().or(z.literal('')),
  sexo: z.string().optional().or(z.literal('')),
  dni: z.string().optional().or(z.literal('')),
  cuit: z.string().optional().or(z.literal('')),
  domicilio: z.string().optional().or(z.literal('')),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefono: z.string().optional().or(z.literal('')),

  // Campos detallados para el Formulario 08 - Legales
  domicilio_legal: z.string().optional().or(z.literal('')),
  domicilio_legal_numero: z.string().optional().or(z.literal('')),
  domicilio_legal_piso: z.string().optional().or(z.literal('')),
  domicilio_legal_depto: z.string().optional().or(z.literal('')),
  domicilio_legal_cp: z.string().optional().or(z.literal('')),
  domicilio_legal_localidad: z.string().optional().or(z.literal('')),

  // Campos detallados para el Formulario 08 - Reales
  domicilio_real: z.string().optional().or(z.literal('')),
  domicilio_real_numero: z.string().optional().or(z.literal('')),
  domicilio_real_piso: z.string().optional().or(z.literal('')),
  domicilio_real_depto: z.string().optional().or(z.literal('')),
  domicilio_real_cp: z.string().optional().or(z.literal('')),
  domicilio_real_localidad: z.string().optional().or(z.literal('')),

  // Otros
  autoridad_o_pais_expidio: z.string().optional().or(z.literal('')),
  domicilio_departamento_o_partido: z.string().optional().or(z.literal('')),
  domicilio_provincia: z.string().optional().or(z.literal('')),
  lugar_nacimiento: z.string().optional().or(z.literal('')),
  fecha_nacimiento: z.string().optional().or(z.literal('')),
  nombre_conyugue: z.string().optional().or(z.literal('')),
  personeria: z.string().optional().or(z.literal('')), 
  n_datos_inscripcion: z.string().optional().or(z.literal('')),
  fecha_inscripcion: z.string().optional().or(z.literal('')),
  profesion: z.string().optional().or(z.literal('')),
  
  porcentaje_entero: z.string().optional().or(z.literal('')).refine((val) => !val || /^\d+$/.test(val), 'Debe ser un número').refine((val) => !val || Number(val) <= 100, 'Máximo 100'),
  porcentaje_decimal: z.string().optional().or(z.literal('')).refine((val) => !val || /^\d{1,2}$/.test(val), 'Máximo 2 dígitos').refine((val) => !val || Number(val) <= 99, 'Máximo 99'),
});



export const VehiculoSchema = z.object({
  tipo: z.string().min(1, 'El tipo de vehículo es requerido'),
  marca: z.string().optional().or(z.literal('')),
  modelo: z.string().optional().or(z.literal('')),
  dominio: z.string().optional().or(z.literal('')).refine((val) => !val || val.length >= 3, 'Patente/Dominio inválido'),
  motor: z.string().optional().or(z.literal('')),
  chasis: z.string().optional().or(z.literal('')), 
  n_motor: z.string().optional().or(z.literal('')),
  n_chasis: z.string().optional().or(z.literal('')),
  uso: z.string().optional().or(z.literal('')),
});



export const PersonaOpcionalSchema = z.object({
  tipo_persona: z.enum(['fisica', 'juridica']).optional(),
  nombre: z.string().optional().or(z.literal('')),
  dni: z.string().optional().or(z.literal('')),
  cuit: z.string().optional().or(z.literal('')),
  fecha_nacimiento: z.string().optional().or(z.literal('')),
  domicilio: z.string().optional().or(z.literal('')),
  email: z.string().optional().or(z.literal('')),
  telefono: z.string().optional().or(z.literal('')),
  domicilio_legal: z.string().optional().or(z.literal('')),
  domicilio_legal_numero: z.string().optional().or(z.literal('')),
  domicilio_legal_piso: z.string().optional().or(z.literal('')),
  domicilio_legal_depto: z.string().optional().or(z.literal('')),
  domicilio_legal_cp: z.string().optional().or(z.literal('')),
  domicilio_legal_localidad: z.string().optional().or(z.literal('')),
  domicilio_real: z.string().optional().or(z.literal('')),
  domicilio_real_numero: z.string().optional().or(z.literal('')),
  domicilio_real_piso: z.string().optional().or(z.literal('')),
  domicilio_real_depto: z.string().optional().or(z.literal('')),
  domicilio_real_cp: z.string().optional().or(z.literal('')),
  domicilio_real_localidad: z.string().optional().or(z.literal('')),
  domicilio_departamento_o_partido: z.string().optional().or(z.literal('')),
  domicilio_provincia: z.string().optional().or(z.literal('')),
  lugar_nacimiento: z.string().optional().or(z.literal('')),

  autoridad_o_pais_expidio: z.string().optional().or(z.literal('')),
  pais: z.string().optional().or(z.literal('')),
  sexo: z.string().optional().or(z.literal('')),
  nombre_conyugue: z.string().optional().or(z.literal('')),
  personeria: z.string().optional().or(z.literal('')),
  n_datos_inscripcion: z.string().optional().or(z.literal('')),
  fecha_inscripcion: z.string().optional().or(z.literal('')),
  profesion: z.string().optional().or(z.literal('')),
  
  porcentaje_entero: z.string().optional().or(z.literal('')).refine((val) => !val || /^\d+$/.test(val), 'Debe ser un número').refine((val) => !val || Number(val) <= 100, 'Máximo 100'),
  porcentaje_decimal: z.string().optional().or(z.literal('')).refine((val) => !val || /^\d{1,2}$/.test(val), 'Máximo 2 dígitos').refine((val) => !val || Number(val) <= 99, 'Máximo 99'),
});

export const TramiteSchema = z.object({
  vendedor: PersonaSchema,
  vendedor_condominio: PersonaOpcionalSchema.optional(),
  comprador: PersonaSchema,
  comprador_condominio: PersonaOpcionalSchema.optional(),
  vehiculo: VehiculoSchema,
  precio: z.string().optional().or(z.literal('')),
  fecha: z.string().optional().or(z.literal('')),
  lugar: z.string().optional().or(z.literal('')),
  observaciones: z.string().optional().or(z.literal('')),
});



export type Persona = z.infer<typeof PersonaSchema>;
export type Vehiculo = z.infer<typeof VehiculoSchema>;
export type TramiteFormValues = z.input<typeof TramiteSchema> & {
  id?: string;
  status?: string;
};

export type TramiteData = z.output<typeof TramiteSchema> & {
  id?: string;
  status?: string;
};
