import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { AUTO_MAPPING } from '@/config/pdfMappingAuto';
import { MOTO_MAPPING } from '@/config/pdfMappingMoto';

export async function generate08(data: any, type: 'auto' | 'moto') {
  // 1. Cargar el PDF base desde la carpeta public
  const templateUrl = `/templates/08_${type}.pdf`;
  let existingPdfBytes;
  
  try {
    const response = await fetch(templateUrl);
    if (!response.ok) throw new Error(`Template not found at ${templateUrl}`);
    existingPdfBytes = await response.arrayBuffer();
  } catch (error) {
    console.warn('No se pudo cargar la plantilla oficial, usando un documento en blanco para previsualizar.');
    // Fallback social solo para previsualización si no existen los archivos
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([595.28, 841.89]);
    existingPdfBytes = await pdfDoc.save();
  }

  // 2. Cargar el documento existente
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  
  // 3. Preparar fuentes
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const mappings = type === 'auto' ? AUTO_MAPPING : MOTO_MAPPING;

  function getValue(path: string, obj: any) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  // 4. Escribir datos sobre el PDF
  for (const map of mappings) {
    const value = getValue(map.field, data);
    const targetPage = pages[map.page];
    
    if (!targetPage) {
      console.warn(`Página ${map.page} no encontrada en el PDF base.`);
      continue;
    }
    
    if (value !== undefined && value !== null && value !== '') {
      if (map.isCheckbox) {
        if (value === true || String(value).toLowerCase() === 'x' || String(value).toLowerCase() === 'sí') {
          targetPage.drawText('X', {
            x: map.x,
            y: map.y,
            size: map.size || 12,
            font: boldFont,
            color: rgb(0, 0, 0),
          });
        }
      } else {
        targetPage.drawText(String(value), {
          x: map.x,
          y: map.y,
          size: map.size || 10,
          font: font,
          color: rgb(0, 0, 0),
        });
      }
    }
  }


  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

