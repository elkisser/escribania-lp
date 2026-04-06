import { PDFMapItem } from './pdfMappingAuto';

const generateMirror = (items: PDFMapItem[]): PDFMapItem[] => {
  const mirrored: PDFMapItem[] = [];
  for (const item of items) {
    if (item.page === 0) mirrored.push({ ...item, page: 2 });
    if (item.page === 1) mirrored.push({ ...item, page: 3 });
  }
  return mirrored;
};

const BASE_MOTO_MAPPING: PDFMapItem[] = [
  // ----------- PÁGINA 1: FRENTE ORIGINAL (0) -----------
  // SECCIÓN A: LUGAR Y FECHA
  { field: '_lugar_fecha', page: 0, x: 155, y: 724 },
  { field: 'precio', page: 0, x: 145, y: 701 },
  { field: 'vehiculo.dominio', page: 0, x: 291, y: 702 },

  // SECCIÓN D: COMPRADOR
  // SECCIÓN D: COMPRADOR
  { field: 'comprador.porcentaje_entero', page: 0, x: 127, y: 651 },
  { field: 'comprador.porcentaje_decimal', page: 0, x: 155, y: 651 },
  { field: 'comprador.nombre', page: 0, x: 150, y: 636 },

  { field: 'comprador_condominio.porcentaje_entero', page: 0, x: 349, y: 644 },
  { field: 'comprador_condominio.porcentaje_decimal', page: 0, x: 375, y: 644 },
  { field: 'comprador_condominio.nombre', page: 0, x: 370, y: 630 },

  { field: 'comprador._pais_sexo', page: 0, x: 140, y: 616 },
  { field: 'comprador_condominio._pais_sexo', page: 0, x: 375, y: 614 },

  { field: 'comprador.email', page: 0, x: 160, y: 603 },
  { field: 'comprador_condominio.email', page: 0, x: 376, y: 601 },

  { field: 'comprador.telefono', page: 0, x: 170, y: 589 },
  { field: 'comprador_condominio.telefono', page: 0, x: 388, y: 589 },

  { field: 'comprador.domicilio_legal', page: 0, x: 190, y: 575 },
  { field: 'comprador_condominio.domicilio_legal', page: 0, x: 420, y: 575 },

  { field: 'comprador.domicilio_legal_numero', page: 0, x: 142, y: 556 },
  { field: 'comprador_condominio.domicilio_legal_numero', page: 0, x: 363, y: 556 },
  { field: 'comprador.domicilio_legal_piso', page: 0, x: 193, y: 556 },
  { field: 'comprador_condominio.domicilio_legal_piso', page: 0, x: 413, y: 556 },
  { field: 'comprador.domicilio_legal_depto', page: 0, x: 248, y: 556 },
  { field: 'comprador_condominio.domicilio_legal_depto', page: 0, x: 465, y: 556 },
  { field: 'comprador.domicilio_legal_cp', page: 0, x: 277, y: 556 },
  { field: 'comprador_condominio.domicilio_legal_cp', page: 0, x: 497, y: 556 },

  { field: 'comprador.domicilio_legal_localidad', page: 0, x: 160, y: 535 },
  { field: 'comprador_condominio.domicilio_legal_localidad', page: 0, x: 390, y: 536 },

  { field: 'comprador.domicilio_departamento_o_partido', page: 0, x: 130, y: 520 },
  { field: 'comprador_condominio.domicilio_departamento_o_partido', page: 0, x: 347, y: 521 },
  { field: 'comprador.domicilio_provincia', page: 0, x: 257, y: 520 },
  { field: 'comprador_condominio.domicilio_provincia', page: 0, x: 477, y: 521 },

  { field: 'comprador.domicilio_real', page: 0, x: 172, y: 502 },
  { field: 'comprador_condominio.domicilio_real', page: 0, x: 402, y: 503 },

  { field: 'comprador.domicilio_real_numero', page: 0, x: 142, y: 485 },
  { field: 'comprador_condominio.domicilio_real_numero', page: 0, x: 363, y: 486 },
  { field: 'comprador.domicilio_real_piso', page: 0, x: 193, y: 485 },
  { field: 'comprador_condominio.domicilio_real_piso', page: 0, x: 413, y: 486 },
  { field: 'comprador.domicilio_real_depto', page: 0, x: 248, y: 485 },
  { field: 'comprador_condominio.domicilio_real_depto', page: 0, x: 465, y: 486 },
  { field: 'comprador.domicilio_real_cp', page: 0, x: 277, y: 485 },
  { field: 'comprador_condominio.domicilio_real_cp', page: 0, x: 497, y: 486 },

  { field: 'comprador.domicilio_real_localidad', page: 0, x: 160, y: 462 },
  { field: 'comprador_condominio.domicilio_real_localidad', page: 0, x: 390, y: 463 },

  { field: 'comprador.domicilio_departamento_o_partido', page: 0, x: 130, y: 444 },
  { field: 'comprador_condominio.domicilio_departamento_o_partido', page: 0, x: 347, y: 445 },
  { field: 'comprador.domicilio_provincia', page: 0, x: 257, y: 444 },
  { field: 'comprador_condominio.domicilio_provincia', page: 0, x: 477, y: 445 },

  { field: 'comprador.dni', page: 0, x: 130, y: 376 },
  { field: 'comprador_condominio.dni', page: 0, x: 350, y: 377 },

  { field: 'comprador.autoridad_o_pais_expidio', page: 0, x: 220, y: 377 },
  { field: 'comprador_condominio.autoridad_o_pais_expidio', page: 0, x: 440, y: 378 },

  { field: 'comprador.cuit', page: 0, x: 190, y: 352 },
  { field: 'comprador_condominio.cuit', page: 0, x: 410, y: 353 },

  { field: 'comprador.lugar_nacimiento', page: 0, x: 202, y: 337 },
  { field: 'comprador_condominio.lugar_nacimiento', page: 0, x: 422, y: 338 },

  { field: 'comprador.fecha_nacimiento_day', page: 0, x: 126, y: 309, size: 8 },
  { field: 'comprador.fecha_nacimiento_month', page: 0, x: 149, y: 309, size: 8 },
  { field: 'comprador.fecha_nacimiento_year', page: 0, x: 166, y: 309, size: 8 },

  { field: 'comprador_condominio.fecha_nacimiento_day', page: 0, x: 346, y: 304, size: 8 },
  { field: 'comprador_condominio.fecha_nacimiento_month', page: 0, x: 369, y: 304, size: 8 },
  { field: 'comprador_condominio.fecha_nacimiento_year', page: 0, x: 389, y: 304, size: 8 },

  { field: 'comprador.profesion', page: 0, x: 220, y: 429 },
  { field: 'comprador_condominio.profesion', page: 0, x: 440, y: 431 },

  { field: 'comprador.nombre_conyugue', page: 0, x: 150, y: 279 },
  { field: 'comprador_condominio.nombre_conyugue', page: 0, x: 370, y: 280 },

  { field: 'comprador.personeria', page: 0, x: 150, y: 261 },
  { field: 'comprador.n_datos_inscripcion', page: 0, x: 150, y: 230 },
  { field: 'comprador.fecha_inscripcion_day', page: 0, x: 258, y: 231 },
  { field: 'comprador.fecha_inscripcion_month', page: 0, x: 283, y: 231 },
  { field: 'comprador.fecha_inscripcion_year', page: 0, x: 304, y: 231 },

  { field: 'comprador_condominio.personeria', page: 0, x: 370, y: 261 },
  { field: 'comprador_condominio.n_datos_inscripcion', page: 0, x: 370, y: 232 },
  { field: 'comprador_condominio.fecha_inscripcion_day', page: 0, x: 478, y: 233 },
  { field: 'comprador_condominio.fecha_inscripcion_month', page: 0, x: 502, y: 233 },
  { field: 'comprador_condominio.fecha_inscripcion_year', page: 0, x: 525, y: 233 },

  // SECCIÓN F: VEHÍCULO
  { field: 'vehiculo.dominio', page: 0, x: 260, y: 121 },
  { field: 'vehiculo.marca', page: 0, x: 170, y: 108 },
  { field: 'vehiculo.tipo', page: 0, x: 158, y: 94 },
  { field: 'vehiculo.modelo', page: 0, x: 170, y: 80 },

  { field: 'vehiculo.motor', page: 0, x: 420, y: 136 },
  { field: 'vehiculo.n_motor', page: 0, x: 410, y: 123 },
  { field: 'vehiculo.marca', page: 0, x: 430, y: 110 },
  { field: 'vehiculo.n_chasis', page: 0, x: 415, y: 96 },
  { field: 'vehiculo.uso', page: 0, x: 385, y: 82 },

  // ----------- PÁGINA 2: DORSO ORIGINAL (1) -----------
  // SECCIÓN I: VENDEDOR
  { field: 'vendedor.porcentaje_entero', page: 1, x: 25, y: 770 },
  { field: 'vendedor.porcentaje_decimal', page: 1, x: 50, y: 770 },

  { field: 'vendedor.nombre', page: 1, x: 47, y: 754 },
  { field: 'vendedor.dni', page: 1, x: 50, y: 627 },
  { field: 'vendedor.autoridad_o_pais_expidio', page: 1, x: 138, y: 627 },

  { field: 'vendedor.nombre_conyugue', page: 1, x: 40, y: 557 },
  { field: 'vendedor.dni_conyugue', page: 1, x: 50, y: 457 },
  { field: 'vendedor.autoridad_o_pais_expidio_conyugue', page: 1, x: 140, y: 458 },

  // SECION J: CONDOMINIO VENDEDOR (Dorso)
  { field: 'vendedor_condominio.porcentaje_entero', page: 1, x: 244, y: 770 },
  { field: 'vendedor_condominio.porcentaje_decimal', page: 1, x: 270, y: 770 },

  { field: 'vendedor_condominio.nombre', page: 1, x: 260, y: 755 },
  { field: 'vendedor_condominio.dni', page: 1, x: 260, y: 627 },
  { field: 'vendedor_condominio.autoridad_o_pais_expidio', page: 1, x: 358, y: 627 },

  { field: 'vendedor_condominio.nombre_conyugue', page: 1, x: 260, y: 557 },
  { field: 'vendedor_condominio.dni_conyugue', page: 1, x: 260, y: 457 },
  { field: 'vendedor_condominio.autoridad_o_pais_expidio_conyugue', page: 1, x: 350, y: 457 },

  // SECCION E: CONDOMINIO COMPRADOR (Frente)
  { field: 'comprador.nombre', page: 1, x: 40, y: 334 },
  { field: 'comprador.dni', page: 1, x: 50, y: 277 },
  { field: 'comprador.autoridad_o_pais_expidio', page: 1, x: 140, y: 278 },

  { field: 'comprador_condominio.nombre', page: 1, x: 260, y: 335 },
  { field: 'comprador_condominio.dni', page: 1, x: 260, y: 278 },
  { field: 'comprador_condominio.autoridad_o_pais_expidio', page: 1, x: 350, y: 278 },

  // OBSERVACIONES
  { field: 'observaciones', page: 1, x: 50, y: 195, maxWidth: 380, lineHeight: 12 },
];

export const MOTO_MAPPING: PDFMapItem[] = [
  ...BASE_MOTO_MAPPING,
  ...generateMirror(BASE_MOTO_MAPPING)
];
