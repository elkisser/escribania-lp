import { z } from 'zod';

export const PersonaSchema = z.object({
  nombre: z.string().min(2, 'El nombre/apellido completo es requerido'),
  pais: z.string().min(1, 'El país es requerido'),
  sexo: z.string().min(1, 'El sexo es requerido'),
  dni: z.string().min(7, 'DNI inválido'),
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
});



export const VehiculoSchema = z.object({
  tipo: z.string().min(1, 'El tipo de vehículo es requerido'),
  marca: z.string().min(1, 'La marca es requerida'),
  modelo: z.string().min(1, 'El modelo es requerido'),
  dominio: z.string().min(3, 'Patente/Dominio inválido'),
  motor: z.string().optional().or(z.literal('')), // Campo legado
  chasis: z.string().optional().or(z.literal('')), // Campo legado
  n_motor: z.string().optional().or(z.literal('')),
  n_chasis: z.string().optional().or(z.literal('')),
  uso: z.string().optional().or(z.literal('')),
});



export const PersonaOpcionalSchema = z.object({
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
  nombre_conyugue: z.string().optional().or(z.literal('')),
});

export const TramiteSchema = z.object({
  vendedor: PersonaSchema,
  vendedor_condominio: PersonaOpcionalSchema.optional(),
  comprador: PersonaSchema,
  comprador_condominio: PersonaOpcionalSchema.optional(),
  vehiculo: VehiculoSchema,
  precio: z.string().min(1, 'El precio es requerido'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  lugar: z.string().min(1, 'El lugar de firma es requerido'),
  observaciones: z.string().optional().or(z.literal('')),
});



export type Persona = z.infer<typeof PersonaSchema>;
export type Vehiculo = z.infer<typeof VehiculoSchema>;
export type TramiteData = z.infer<typeof TramiteSchema>;
