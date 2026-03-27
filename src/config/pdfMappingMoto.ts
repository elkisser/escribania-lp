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
  { field: 'lugar', page: 0, x: 225, y: 726 },
  { field: 'fecha', page: 0, x: 325, y: 726 },
  { field: 'precio', page: 0, x: 205, y: 704 },
  { field: 'vehiculo.dominio', page: 0, x: 331, y: 704 },

  // SECCIÓN D: COMPRADOR
  { field: 'comprador.nombre', page: 0, x: 210, y: 637 },
  { field: 'comprador_condominio.nombre', page: 0, x: 450, y: 631 },

  { field: 'comprador.email', page: 0, x: 210, y: 604 },
  { field: 'comprador_condominio.email', page: 0, x: 424, y: 600 },

  { field: 'comprador.telefono', page: 0, x: 210, y: 590 },
  { field: 'comprador_condominio.telefono', page: 0, x: 428, y: 589 },

  { field: 'comprador.domicilio_legal', page: 0, x: 230, y: 576 },
  { field: 'comprador_condominio.domicilio_legal', page: 0, x: 470, y: 576 },

  { field: 'comprador.domicilio_legal_numero', page: 0, x: 185, y: 557 },
  { field: 'comprador_condominio.domicilio_legal_numero', page: 0, x: 408, y: 557 },
  { field: 'comprador.domicilio_legal_piso', page: 0, x: 245, y: 557 },
  { field: 'comprador_condominio.domicilio_legal_piso', page: 0, x: 468, y: 557 },
  { field: 'comprador.domicilio_legal_depto', page: 0, x: 291, y: 557 },
  { field: 'comprador_condominio.domicilio_legal_depto', page: 0, x: 511, y: 557 },
  { field: 'comprador.domicilio_legal_cp', page: 0, x: 327, y: 557 },
  { field: 'comprador_condominio.domicilio_legal_cp', page: 0, x: 544, y: 557 },

  { field: 'comprador.domicilio_legal_localidad', page: 0, x: 210, y: 537 },
  { field: 'comprador_condominio.domicilio_legal_localidad', page: 0, x: 450, y: 537 },

  { field: 'comprador.domicilio_departamento_o_partido', page: 0, x: 210, y: 521 },
  { field: 'comprador_condominio.domicilio_departamento_o_partido', page: 0, x: 430, y: 521 },
  { field: 'comprador.domicilio_provincia', page: 0, x: 320, y: 521 },
  { field: 'comprador_condominio.domicilio_provincia', page: 0, x: 540, y: 521 },

  { field: 'comprador.domicilio_real', page: 0, x: 230, y: 503 },
  { field: 'comprador_condominio.domicilio_real', page: 0, x: 470, y: 503 },

  { field: 'comprador.domicilio_real_numero', page: 0, x: 185, y: 485 },
  { field: 'comprador_condominio.domicilio_real_numero', page: 0, x: 408, y: 485 },
  { field: 'comprador.domicilio_real_piso', page: 0, x: 245, y: 485 },
  { field: 'comprador_condominio.domicilio_real_piso', page: 0, x: 468, y: 485 },
  { field: 'comprador.domicilio_real_depto', page: 0, x: 291, y: 485 },
  { field: 'comprador_condominio.domicilio_real_depto', page: 0, x: 511, y: 485 },
  { field: 'comprador.domicilio_real_cp', page: 0, x: 327, y: 485 },
  { field: 'comprador_condominio.domicilio_real_cp', page: 0, x: 544, y: 485 },

  { field: 'comprador.domicilio_real_localidad', page: 0, x: 210, y: 465 },
  { field: 'comprador_condominio.domicilio_real_localidad', page: 0, x: 450, y: 465 },

  { field: 'comprador.domicilio_departamento_o_partido', page: 0, x: 210, y: 445 },
  { field: 'comprador_condominio.domicilio_departamento_o_partido', page: 0, x: 430, y: 445 },
  { field: 'comprador.domicilio_provincia', page: 0, x: 320, y: 445 },
  { field: 'comprador_condominio.domicilio_provincia', page: 0, x: 540, y: 445 },

  { field: 'comprador.dni', page: 0, x: 190, y: 376 },
  { field: 'comprador_condominio.dni', page: 0, x: 410, y: 376 },

  { field: 'comprador.cuit', page: 0, x: 230, y: 352 },
  { field: 'comprador_condominio.cuit', page: 0, x: 450, y: 352 },

  { field: 'comprador.lugar_nacimiento', page: 0, x: 242, y: 337 },
  { field: 'comprador_condominio.lugar_nacimiento', page: 0, x: 462, y: 337 },


  { field: 'comprador.nombre_conyugue', page: 0, x: 190, y: 285 },
  { field: 'comprador_condominio.nombre_conyugue', page: 0, x: 430, y: 285 },

  // SECCIÓN F: VEHÍCULO
  { field: 'vehiculo.dominio', page: 0, x: 310, y: 120 },
  { field: 'vehiculo.marca', page: 0, x: 210, y: 108 },
  { field: 'vehiculo.tipo', page: 0, x: 198, y: 94 },
  { field: 'vehiculo.modelo', page: 0, x: 210, y: 80 },

  { field: 'vehiculo.n_motor', page: 0, x: 670, y: 120 },
  { field: 'vehiculo.marca', page: 0, x: 470, y: 108 },
  { field: 'vehiculo.n_chasis', page: 0, x: 455, y: 94 },
  { field: 'vehiculo.uso', page: 0, x: 425, y: 80 },

  // ----------- PÁGINA 2: DORSO ORIGINAL (1) -----------
  // SECCIÓN I: VENDEDOR
  { field: 'vendedor.nombre', page: 1, x: 140, y: 757 },
  { field: 'vendedor.dni', page: 1, x: 95, y: 628 },

  // SECION J: CONDOMINIO VENDEDOR (Dorso)
  { field: 'vendedor_condominio.nombre', page: 1, x: 350, y: 757 },
  { field: 'vendedor_condominio.dni', page: 1, x: 310, y: 628 },

  // SECCION E: CONDOMINIO COMPRADOR (Frente)
  { field: 'comprador.nombre', page: 1, x: 140, y: 335 },
  { field: 'comprador.dni', page: 1, x: 95, y: 279 },

  { field: 'comprador_condominio.nombre', page: 1, x: 350, y: 335 },
  { field: 'comprador_condominio.dni', page: 1, x: 310, y: 279 },
];

export const MOTO_MAPPING: PDFMapItem[] = [
  ...BASE_MOTO_MAPPING,
  ...generateMirror(BASE_MOTO_MAPPING)
];
