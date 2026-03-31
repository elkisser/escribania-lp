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
  { field: 'lugar', page: 0, x: 185, y: 724 },
  { field: 'fecha', page: 0, x: 285, y: 724 },
  { field: 'precio', page: 0, x: 145, y: 701 },
  { field: 'vehiculo.dominio', page: 0, x: 291, y: 702 },

  // SECCIÓN D: COMPRADOR
  { field: 'comprador.nombre', page: 0, x: 150, y: 636 },
  { field: 'comprador_condominio.nombre', page: 0, x: 390, y: 630 },

  { field: 'comprador._pais_sexo', page: 0, x: 390, y: 630 },
  { field: 'comprador_condominio._pais_sexo', page: 0, x: 390, y: 424 },

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

  { field: 'comprador.cuit', page: 0, x: 190, y: 352 },
  { field: 'comprador_condominio.cuit', page: 0, x: 410, y: 353 },

  { field: 'comprador.lugar_nacimiento', page: 0, x: 202, y: 336 },
  { field: 'comprador_condominio.lugar_nacimiento', page: 0, x: 422, y: 337 },

  { field: 'comprador.fecha_nacimiento_day', page: 0, x: 126, y: 296, size: 8 },
  { field: 'comprador.fecha_nacimiento_month', page: 0, x: 145, y: 296, size: 8 },
  { field: 'comprador.fecha_nacimiento_year', page: 0, x: 164, y: 296, size: 8 },

  { field: 'comprador_condominio.fecha_nacimiento_day', page: 0, x: 332, y: 337, size: 8 },
  { field: 'comprador_condominio.fecha_nacimiento_month', page: 0, x: 357, y: 337, size: 8 },
  { field: 'comprador_condominio.fecha_nacimiento_year', page: 0, x: 382, y: 337, size: 8 },

  { field: 'comprador.nombre_conyugue', page: 0, x: 150, y: 280 },
  { field: 'comprador_condominio.nombre_conyugue', page: 0, x: 370, y: 281 },

  // SECCIÓN F: VEHÍCULO
  { field: 'vehiculo.dominio', page: 0, x: 260, y: 120 },
  { field: 'vehiculo.marca', page: 0, x: 170, y: 107 },
  { field: 'vehiculo.tipo', page: 0, x: 158, y: 93 },
  { field: 'vehiculo.modelo', page: 0, x: 170, y: 79 },

  { field: 'vehiculo.n_motor', page: 0, x: 630, y: 120 },
  { field: 'vehiculo.marca', page: 0, x: 430, y: 108 },
  { field: 'vehiculo.n_chasis', page: 0, x: 415, y: 95 },
  { field: 'vehiculo.uso', page: 0, x: 385, y: 81 },

  // ----------- PÁGINA 2: DORSO ORIGINAL (1) -----------
  // SECCIÓN I: VENDEDOR
  { field: 'vendedor.nombre', page: 1, x: 80, y: 754 },
  { field: 'vendedor.dni', page: 1, x: 40, y: 625 },

  // SECION J: CONDOMINIO VENDEDOR (Dorso)
  { field: 'vendedor_condominio.nombre', page: 1, x: 290, y: 754 },
  { field: 'vendedor_condominio.dni', page: 1, x: 250, y: 626 },

  // SECCION E: CONDOMINIO COMPRADOR (Frente)
  { field: 'comprador.nombre', page: 1, x: 80, y: 333 },
  { field: 'comprador.dni', page: 1, x: 40, y: 276 },

  { field: 'comprador_condominio.nombre', page: 1, x: 290, y: 334 },
  { field: 'comprador_condominio.dni', page: 1, x: 250, y: 277 },

  // OBSERVACIONES
  { field: 'observaciones', page: 1, x: 100, y: 100, maxWidth: 400, lineHeight: 12 },
];

export const MOTO_MAPPING: PDFMapItem[] = [
  ...BASE_MOTO_MAPPING,
  ...generateMirror(BASE_MOTO_MAPPING)
];
