import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Forzar renderizado dinámico para que no se almacene en caché
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const startTime = Date.now();

    // Consulta ligera para mantener la base de datos de Supabase activa
    const { data, error } = await supabase
      .from('tramites_08')
      .select('id')
      .limit(1);

    if (error) {
      console.error('[keep-alive] Error al consultar Supabase:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Error al consultar Supabase',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: 'Ping a Supabase completado con éxito - Proyecto activo',
      durationMs,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[keep-alive] Excepción inesperada:', err);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
