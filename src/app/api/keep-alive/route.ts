import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Forzar renderizado dinámico para que no se almacene en caché
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Vercel envía este token automáticamente cuando CRON_SECRET está configurado.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const startTime = Date.now();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: 'Supabase credentials are not configured in environment variables',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    // Consulta ligera para mantener la base de datos de Supabase activa
    const { error } = await supabase
      .from('tramites_08')
      .select('id', { head: true })
      .limit(1)
      .abortSignal(AbortSignal.timeout(15_000));

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
      message: 'Consulta a Supabase completada con éxito',
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
