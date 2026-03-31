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
    if (path.endsWith('_day') || path.endsWith('_month') || path.endsWith('_year')) {
      const parts = path.split('_');
      const suffix = parts.pop();
      const baseField = parts.join('_');
      const fullDate = baseField.split('.').reduce((acc, part) => acc && acc[part], obj);
      
      if (!fullDate || typeof fullDate !== 'string') return '';
      
      // Intentar parsear YYYY-MM-DD (estándar de input type="date")
      const dateParts = fullDate.split('-');
      if (dateParts.length === 3) {
        if (suffix === 'year') return dateParts[0];
        if (suffix === 'month') return dateParts[1];
        if (suffix === 'day') return dateParts[2];
      }
      
      // Intentar parsear DD/MM/YYYY
      const datePartsSlash = fullDate.split('/');
      if (datePartsSlash.length === 3) {
        if (suffix === 'day') return datePartsSlash[0];
        if (suffix === 'month') return datePartsSlash[1];
        if (suffix === 'year') return datePartsSlash[2];
      }
      
      return '';
    }

    // Nueva lógica para campos combinados (País - Sexo)
    if (path.endsWith('_pais_sexo')) {
      const base = path.replace('_pais_sexo', '');
      const pais = base.split('.').reduce((acc, part) => acc && acc[part], obj)?.pais;
      const sexo = base.split('.').reduce((acc, part) => acc && acc[part], obj)?.sexo;
      
      if (!pais && !sexo) return '';
      return `(${pais || ''}${pais && sexo ? ' - ' : ''}${sexo || ''})`;
    }

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
      } else if (map.maxWidth) {
        const text = String(value);
        const fontSize = map.size || 10;
        const words = text.split(' ');
        let line = '';
        let currentY = map.y;

        for (const word of words) {
          const testLine = line + word + ' ';
          const testLineWidth = font.widthOfTextAtSize(testLine, fontSize);
          
          if (testLineWidth > map.maxWidth && line !== '') {
            targetPage.drawText(line.trim(), {
              x: map.x,
              y: currentY,
              size: fontSize,
              font: font,
              color: rgb(0, 0, 0),
            });
            line = word + ' ';
            currentY -= (map.lineHeight || fontSize * 1.2);
          } else {
            line = testLine;
          }
        }
        
        if (line !== '') {
          targetPage.drawText(line.trim(), {
            x: map.x,
            y: currentY,
            size: fontSize,
            font: font,
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

