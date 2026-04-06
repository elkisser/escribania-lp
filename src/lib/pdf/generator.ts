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
    // Añadimos 2 páginas por defecto en el fallback (Frente y Dorso)
    pdfDoc.addPage([595.28, 841.89]);
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

  function splitTextIntoLines(text: string, font: any, fontSize: number, maxWidth: number): string[] {
    const lines: string[] = [];
    const paragraphs = text.split(/\r?\n/);

    for (const paragraph of paragraphs) {
      if (paragraph.trim() === '') {
        lines.push('');
        continue;
      }

      const words = paragraph.split(/\s+/);
      let currentLine = '';

      for (const word of words) {
        let wordToProcess = word;

        // Si la palabra sola es más ancha que el máximo, hay que cortarla por caracteres
        if (font.widthOfTextAtSize(wordToProcess, fontSize) > maxWidth) {
          // Intentar llenar lo que queda de la línea actual primero
          if (currentLine !== '') {
            let part = '';
            for (let i = 0; i < wordToProcess.length; i++) {
              const testPart = currentLine + ' ' + part + wordToProcess[i];
              if (font.widthOfTextAtSize(testPart, fontSize) > maxWidth) {
                if (part !== '') {
                  lines.push(currentLine + ' ' + part);
                  wordToProcess = wordToProcess.slice(i);
                } else {
                  lines.push(currentLine);
                }
                currentLine = '';
                break;
              }
              part += wordToProcess[i];
            }
          }

          // Seguir cortando el resto de la palabra
          while (font.widthOfTextAtSize(wordToProcess, fontSize) > maxWidth) {
            let part = '';
            for (let i = 0; i < wordToProcess.length; i++) {
              const testPart = part + wordToProcess[i];
              if (font.widthOfTextAtSize(testPart, fontSize) > maxWidth) {
                if (part === '') {
                  part = wordToProcess[i];
                  wordToProcess = wordToProcess.slice(1);
                } else {
                  lines.push(part);
                  wordToProcess = wordToProcess.slice(i);
                }
                part = '';
                break;
              }
              part = testPart;
            }
          }
        }

        const testLine = currentLine === '' ? wordToProcess : currentLine + ' ' + wordToProcess;
        const testLineWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testLineWidth > maxWidth) {
          if (currentLine !== '') {
            lines.push(currentLine);
            currentLine = wordToProcess;
          } else {
            currentLine = wordToProcess;
          }
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine !== '') {
        lines.push(currentLine);
      }
    }

    return lines;
  }

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
      const base = path.replace('_pais_sexo', '').replace(/\.$/, '');
      const person = base.split('.').reduce((acc, part) => acc && acc[part], obj);
      const pais = person?.pais;
      const sexo = person?.sexo;
      
      if (!pais && !sexo) return '';
      return `(${pais || ''}${pais && sexo ? ' - ' : ''}${sexo || ''})`;
    }

    // Nueva lógica para Lugar y Fecha unificados
    if (path === '_lugar_fecha') {
      const lugar = obj.lugar || '';
      const fechaFull = obj.fecha || '';
      
      let fechaFormatted = fechaFull;
      if (fechaFull && fechaFull.includes('-')) {
        const parts = fechaFull.split('-');
        if (parts.length === 3) {
          fechaFormatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
      }
      
      if (!lugar && !fechaFormatted) return '';
      return `${lugar}${lugar && fechaFormatted ? ', ' : ''}${fechaFormatted}`;
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
        const lines = splitTextIntoLines(text, font, fontSize, map.maxWidth);
        let currentY = map.y;
        const lineHeight = map.lineHeight || fontSize * 1.2;

        lines.forEach((line, index) => {
          const isLastLine = index === lines.length - 1 || line.trim() === '';
          const words = line.trim().split(/\s+/);
          const lineWidth = font.widthOfTextAtSize(line.trim(), fontSize);
          
          if (isLastLine || words.length <= 1 || lineWidth < map.maxWidth! * 0.8) {
            // Última línea, línea de una sola palabra o línea muy corta: alineación normal a la izquierda
            targetPage.drawText(line.trim(), {
              x: map.x,
              y: currentY,
              size: fontSize,
              font: font,
              color: rgb(0, 0, 0),
            });
          } else {
            // Justificado: dibujar palabra por palabra con espacio adicional
            const totalWordsWidth = words.reduce((acc, word) => acc + font.widthOfTextAtSize(word, fontSize), 0);
            const totalSpaceNeeded = map.maxWidth! - totalWordsWidth;
            const spaceBetweenWords = totalSpaceNeeded / (words.length - 1);
            
            let currentX = map.x;
            words.forEach((word) => {
              targetPage.drawText(word, {
                x: currentX,
                y: currentY,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0),
              });
              currentX += font.widthOfTextAtSize(word, fontSize) + spaceBetweenWords;
            });
          }
          
          currentY -= lineHeight;
        });
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

