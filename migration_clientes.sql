-- Migración: Agregar sistema de gestión de clientes
-- Este script agrega las tablas necesarias para el sistema de autocompletado de clientes

-- Tabla: usuarios (para autenticación básica)
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    nombre TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: clientes (asociada a usuarios)
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo_persona TEXT CHECK (tipo_persona IN ('fisica', 'juridica')) DEFAULT 'fisica',
    
    -- Datos básicos
    nombre TEXT NOT NULL,
    apellido TEXT,
    dni TEXT,
    cuit TEXT,
    
    -- Datos personales (solo para persona física)
    pais TEXT,
    sexo TEXT,
    fecha_nacimiento DATE,
    lugar_nacimiento TEXT,
    autoridad_o_pais_expidio TEXT,
    telefono TEXT,
    profesion TEXT,
    nombre_conyugue TEXT,
    
    -- Domicilio real
    domicilio_real TEXT,
    domicilio_real_numero TEXT,
    domicilio_real_piso TEXT,
    domicilio_real_depto TEXT,
    domicilio_real_cp TEXT,
    domicilio_real_localidad TEXT,
    
    -- Domicilio legal
    domicilio_legal TEXT,
    domicilio_legal_numero TEXT,
    domicilio_legal_piso TEXT,
    domicilio_legal_depto TEXT,
    domicilio_legal_cp TEXT,
    domicilio_legal_localidad TEXT,
    domicilio_departamento_o_partido TEXT,
    domicilio_provincia TEXT,
    
    -- Otros
    email TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices para búsqueda rápida
    CONSTRAINT clientes_user_dni_unique UNIQUE (user_id, dni)
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_clientes_dni ON clientes(dni);
CREATE INDEX IF NOT EXISTS idx_clientes_cuit ON clientes(cuit);
CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre);

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (simplificadas para desarrollo)
CREATE POLICY "Public full access" ON usuarios FOR ALL USING (true);
CREATE POLICY "Public full access" ON clientes FOR ALL USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en clientes
DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes;
CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Crear usuarios desde auth.users de Supabase (si existe)
-- Este INSERT solo funciona si tienes configurado Supabase Auth
INSERT INTO usuarios (id, email, nombre)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', email) as nombre
FROM auth.users
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE clientes IS 'Tabla para almacenar datos de clientes asociados a cada usuario';
COMMENT ON COLUMN clientes.user_id IS 'Referencia al usuario que creó el cliente';
COMMENT ON COLUMN clientes.dni IS 'DNI sin puntos ni guiones';
COMMENT ON COLUMN clientes.cuit IS 'CUIT sin guiones';
