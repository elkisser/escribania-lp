-- Script para agregar user_id a tramites_08 existentes
-- Ejecutar DESPUÉS de la migración principal

-- Agregar columna user_id si no existe
ALTER TABLE tramites_08 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE;

-- Crear índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_tramites_user_id ON tramites_08(user_id);

-- IMPORTANTE: Asignar todos los trámites existentes a tu usuario
-- Reemplaza 'TU_USER_ID_AQUI' con tu ID de usuario de Supabase Auth
-- Para obtener tu user_id, ejecuta: SELECT id FROM auth.users WHERE email = 'tu_email@ejemplo.com';

-- Ejemplo (CAMBIA EL ID POR EL TUYO):
-- UPDATE tramites_08 
-- SET user_id = 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6'
-- WHERE user_id IS NULL;

-- O si quieres asignar todos a un email específico:
UPDATE tramites_08 
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL;
