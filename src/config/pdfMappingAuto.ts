export interface PDFMapItem {
  field: string;
  page: number; // 0: Frente Original, 1: Dorso Original, 2: Frente Duplicado, 3: Dorso Duplicado
  x: number;
  y: number;
  size?: number;
  isCheckbox?: boolean;
  maxWidth?: number;
  lineHeight?: number;
}

const generateMirror = (items: PDFMapItem[]): PDFMapItem[] => {
  const mirrored: PDFMapItem[] = [];
  for (const item of items) {
    if (item.page === 0) mirrored.push({ ...item, page: 2 });
    if (item.page === 1) mirrored.push({ ...item, page: 3 });
  }
  return mirrored;
};

const BASE_AUTO_MAPPING: PDFMapItem[] = [
  // ----------- PÁGINA 1: FRENTE ORIGINAL (0) -----------
  // SECCIÓN A: LUGAR Y FECHA
  { field: '_lugar_fecha', page: 0, x: 185, y: 728 },
  { field: 'precio', page: 0, x: 145, y: 706 },
  { field: 'vehiculo.dominio', page: 0, x: 291, y: 706 },

  // SECCIÓN D: COMPRADOR
  { field: 'comprador.porcentaje_entero', page: 0, x: 127, y: 653 },
  { field: 'comprador.porcentaje_decimal', page: 0, x: 155, y: 653 },
  { field: 'comprador.nombre', page: 0, x: 150, y: 639 },
  { field: 'comprador._pais_sexo', page: 0, x: 140, y: 620 },

  { field: 'comprador_condominio.porcentaje_entero', page: 0, x: 347, y: 647 },
  { field: 'comprador_condominio.porcentaje_decimal', page: 0, x: 373, y: 647 },
  { field: 'comprador_condominio.nombre', page: 0, x: 370, y: 633 },
  { field: 'comprador_condominio._pais_sexo', page: 0, x: 360, y: 618 },

  { field: 'comprador.email', page: 0, x: 160, y: 606 },
  { field: 'comprador_condominio.email', page: 0, x: 376, y: 604 },

  { field: 'comprador.telefono', page: 0, x: 170, y: 592 },
  { field: 'comprador_condominio.telefono', page: 0, x: 388, y: 592 },

  { field: 'comprador.domicilio_legal', page: 0, x: 190, y: 578 },
  { field: 'comprador_condominio.domicilio_legal', page: 0, x: 420, y: 579 },

  { field: 'comprador.domicilio_legal_numero', page: 0, x: 142, y: 559 },
  { field: 'comprador_condominio.domicilio_legal_numero', page: 0, x: 363, y: 561 },
  { field: 'comprador.domicilio_legal_piso', page: 0, x: 193, y: 559 },
  { field: 'comprador_condominio.domicilio_legal_piso', page: 0, x: 413, y: 561 },
  { field: 'comprador.domicilio_legal_depto', page: 0, x: 248, y: 559 },
  { field: 'comprador_condominio.domicilio_legal_depto', page: 0, x: 465, y: 561 },
  { field: 'comprador.domicilio_legal_cp', page: 0, x: 284, y: 559 },
  { field: 'comprador_condominio.domicilio_legal_cp', page: 0, x: 504, y: 561 },

  { field: 'comprador.domicilio_legal_localidad', page: 0, x: 180, y: 539 },
  { field: 'comprador_condominio.domicilio_legal_localidad', page: 0, x: 410, y: 540 },

  { field: 'comprador.domicilio_departamento_o_partido', page: 0, x: 127, y: 524 },
  { field: 'comprador_condominio.domicilio_departamento_o_partido', page: 0, x: 347, y: 525 },
  { field: 'comprador.domicilio_provincia', page: 0, x: 265, y: 524 },
  { field: 'comprador_condominio.domicilio_provincia', page: 0, x: 485, y: 525 },

  { field: 'comprador.domicilio_real', page: 0, x: 160, y: 506 },
  { field: 'comprador_condominio.domicilio_real', page: 0, x: 390, y: 507 },

  { field: 'comprador.domicilio_real_numero', page: 0, x: 142, y: 488 },
  { field: 'comprador_condominio.domicilio_real_numero', page: 0, x: 363, y: 489 },
  { field: 'comprador.domicilio_real_piso', page: 0, x: 193, y: 488 },
  { field: 'comprador_condominio.domicilio_real_piso', page: 0, x: 413, y: 489 },
  { field: 'comprador.domicilio_real_depto', page: 0, x: 248, y: 488 },
  { field: 'comprador_condominio.domicilio_real_depto', page: 0, x: 465, y: 489 },
  { field: 'comprador.domicilio_real_cp', page: 0, x: 284, y: 488 },
  { field: 'comprador_condominio.domicilio_real_cp', page: 0, x: 504, y: 489 },

  { field: 'comprador.domicilio_real_localidad', page: 0, x: 160, y: 468 },
  { field: 'comprador_condominio.domicilio_real_localidad', page: 0, x: 390, y: 469 },

  { field: 'comprador.domicilio_departamento_o_partido', page: 0, x: 127, y: 447 },
  { field: 'comprador_condominio.domicilio_departamento_o_partido', page: 0, x: 347, y: 449 },
  { field: 'comprador.domicilio_provincia', page: 0, x: 265, y: 447 },
  { field: 'comprador_condominio.domicilio_provincia', page: 0, x: 485, y: 449 },

  { field: 'comprador.dni', page: 0, x: 130, y: 379 },
  { field: 'comprador_condominio.dni', page: 0, x: 350, y: 381 },

  { field: 'comprador.autoridad_o_pais_expidio', page: 0, x: 220, y: 379 },
  { field: 'comprador_condominio.autoridad_o_pais_expidio', page: 0, x: 440, y: 381 },

  { field: 'comprador.cuit', page: 0, x: 190, y: 355 },
  { field: 'comprador_condominio.cuit', page: 0, x: 410, y: 357 },

  { field: 'comprador.lugar_nacimiento', page: 0, x: 202, y: 340 },
  { field: 'comprador_condominio.lugar_nacimiento', page: 0, x: 422, y: 341 },

  { field: 'comprador.fecha_nacimiento_day', page: 0, x: 126, y: 309, size: 8 },
  { field: 'comprador.fecha_nacimiento_month', page: 0, x: 149, y: 309, size: 8 },
  { field: 'comprador.fecha_nacimiento_year', page: 0, x: 166, y: 309, size: 8 },

  { field: 'comprador_condominio.fecha_nacimiento_day', page: 0, x: 346, y: 310, size: 8 },
  { field: 'comprador_condominio.fecha_nacimiento_month', page: 0, x: 369, y: 310, size: 8 },
  { field: 'comprador_condominio.fecha_nacimiento_year', page: 0, x: 389, y: 310, size: 8 },

  { field: 'comprador.nombre_conyugue', page: 0, x: 150, y: 284 },
  { field: 'comprador_condominio.nombre_conyugue', page: 0, x: 370, y: 285 },

  { field: 'comprador.personeria', page: 0, x: 150, y: 264 },
  { field: 'comprador.n_datos_inscripcion', page: 0, x: 150, y: 237 },
  { field: 'comprador.fecha_inscripcion_day', page: 0, x: 258, y: 238 },
  { field: 'comprador.fecha_inscripcion_month', page: 0, x: 283, y: 238 },
  { field: 'comprador.fecha_inscripcion_year', page: 0, x: 304, y: 238 },

  { field: 'comprador_condominio.personeria', page: 0, x: 370, y: 266 },
  { field: 'comprador_condominio.n_datos_inscripcion', page: 0, x: 370, y: 239 },
  { field: 'comprador_condominio.fecha_inscripcion_day', page: 0, x: 478, y: 240 },
  { field: 'comprador_condominio.fecha_inscripcion_month', page: 0, x: 502, y: 240 },
  { field: 'comprador_condominio.fecha_inscripcion_year', page: 0, x: 524, y: 240 },

  // SECCIÓN F: VEHÍCULO
  { field: 'vehiculo.dominio', page: 0, x: 260, y: 123 },
  { field: 'vehiculo.marca', page: 0, x: 170, y: 110 },
  { field: 'vehiculo.tipo', page: 0, x: 158, y: 96 },
  { field: 'vehiculo.modelo', page: 0, x: 170, y: 82 },

  { field: 'vehiculo.motor', page: 0, x: 420, y: 138 },
  { field: 'vehiculo.n_motor', page: 0, x: 410, y: 125 },
  { field: 'vehiculo.marca', page: 0, x: 430, y: 112 },
  { field: 'vehiculo.n_chasis', page: 0, x: 415, y: 98 },
  { field: 'vehiculo.uso', page: 0, x: 385, y: 84 },

  // ----------- PÁGINA 2: DORSO ORIGINAL (1) -----------
  // SECCIÓN I: VENDEDOR
  { field: 'vendedor.porcentaje_entero', page: 1, x: 32, y: 783 },
  { field: 'vendedor.porcentaje_decimal', page: 1, x: 53, y: 783 },

  { field: 'vendedor.nombre', page: 1, x: 40, y: 765 },
  { field: 'vendedor.dni', page: 1, x: 50, y: 629 },
  { field: 'vendedor.autoridad_o_pais_expidio', page: 1, x: 138, y: 629 },

  { field: 'vendedor.nombre_conyugue', page: 1, x: 40, y: 559 },
  { field: 'vendedor.dni_conyugue', page: 1, x: 50, y: 458 },
  { field: 'vendedor.autoridad_o_pais_expidio_conyugue', page: 1, x: 140, y: 458 },

  // SECION J: CONDOMINIO VENDEDOR (Dorso)
  { field: 'vendedor_condominio.porcentaje_entero', page: 1, x: 248, y: 779 },
  { field: 'vendedor_condominio.porcentaje_decimal', page: 1, x: 272, y: 779 },

  { field: 'vendedor_condominio.nombre', page: 1, x: 260, y: 764 },
  { field: 'vendedor_condominio.dni', page: 1, x: 260, y: 629 },
  { field: 'vendedor_condominio.autoridad_o_pais_expidio', page: 1, x: 358, y: 629 },

  { field: 'vendedor_condominio.nombre_conyugue', page: 1, x: 260, y: 560 },
  { field: 'vendedor_condominio.dni_conyugue', page: 1, x: 260, y: 459 },
  { field: 'vendedor_condominio.autoridad_o_pais_expidio_conyugue', page: 1, x: 350, y: 459 },

  // SECCION E: CONDOMINIO COMPRADOR (Frente)
  { field: 'comprador.nombre', page: 1, x: 40, y: 342 },
  { field: 'comprador.dni', page: 1, x: 50, y: 286 },
  { field: 'comprador.autoridad_o_pais_expidio', page: 1, x: 140, y: 286 },

  { field: 'comprador_condominio.nombre', page: 1, x: 260, y: 343 },
  { field: 'comprador_condominio.dni', page: 1, x: 260, y: 287 },
  { field: 'comprador_condominio.autoridad_o_pais_expidio', page: 1, x: 350, y: 287 },

  // OBSERVACIONES
  { field: 'observaciones', page: 1, x: 50, y: 205, maxWidth: 380, lineHeight: 12 },
];


export const AUTO_MAPPING: PDFMapItem[] = [
  ...BASE_AUTO_MAPPING,
  ...generateMirror(BASE_AUTO_MAPPING)
];
