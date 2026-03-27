-- Tables for Vehicles Transfer Application (Formulario 08)

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla: personas
CREATE TABLE IF NOT EXISTS personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    dni TEXT UNIQUE NOT NULL,
    cuit TEXT,
    fecha_nacimiento DATE,
    estado_civil TEXT,
    domicilio TEXT,
    email TEXT,
    telefono TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: vehiculos
CREATE TABLE IF NOT EXISTS vehiculos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo TEXT CHECK (tipo IN ('auto', 'moto')),
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    dominio TEXT UNIQUE NOT NULL,
    motor TEXT,
    chasis TEXT,
    uso TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: tramites_08 (Simplificada para borradores dinámicos)
CREATE TABLE IF NOT EXISTS tramites_08 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data JSONB NOT NULL, -- Contiene todo el estado del formulario
    status TEXT DEFAULT 'borrador', -- borrador, finalizado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Row Level Security (RLS) - Simplificado para este ejemplo
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tramites_08 ENABLE ROW LEVEL SECURITY;

-- Poliza publica (para propósitos de desarrollo)
CREATE POLICY "Public full access" ON personas FOR ALL USING (true);
CREATE POLICY "Public full access" ON vehiculos FOR ALL USING (true);
CREATE POLICY "Public full access" ON tramites_08 FOR ALL USING (true);
