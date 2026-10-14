/**
 * Descarga directamente un archivo PDF generado en el navegador.
 * Dispara el evento nativo de descarga mediante un elemento <a> temporal,
 * evitando bloqueos de popups de window.open.
 */
export function downloadPdfBlob(pdfBytes: Uint8Array | ArrayBuffer, fileName: string) {
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const safeFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;

  const link = document.createElement('a');
  link.href = url;
  link.download = safeFileName;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Limpiar recurso de memoria tras un breve retraso
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Obtiene un nombre de archivo limpio y descriptivo para el trámite 08.
 */
export function getPdfFileName(type: 'auto' | 'moto', data: Record<string, unknown>): string {
  const vehiculo = typeof data.vehiculo === 'object' && data.vehiculo !== null 
    ? (data.vehiculo as Record<string, unknown>) 
    : null;
  const rawDominio = vehiculo?.dominio ? String(vehiculo.dominio).trim().toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
  const prefix = type === 'moto' ? '08_MOTO' : '08_AUTO';
  
  return rawDominio ? `Formulario_${prefix}_${rawDominio}.pdf` : `Formulario_${prefix}.pdf`;
}
