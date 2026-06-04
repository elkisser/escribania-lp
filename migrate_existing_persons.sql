-- Script para migrar personas de trámites existentes a la tabla clientes
-- Ejecutar DESPUÉS de agregar user_id a tramites_08

-- Insertar vendedores únicos (evitando duplicados por DNI)
INSERT INTO clientes (
    user_id, tipo_persona, nombre, dni, cuit, pais, sexo, 
    fecha_nacimiento, lugar_nacimiento, autoridad_o_pais_expidio,
    telefono, profesion, nombre_conyugue,
    domicilio_real, domicilio_real_numero, domicilio_real_piso, domicilio_real_depto,
    domicilio_real_cp, domicilio_real_localidad,
    domicilio_legal, domicilio_legal_numero, domicilio_legal_piso, domicilio_legal_depto,
    domicilio_legal_cp, domicilio_legal_localidad,
    domicilio_departamento_o_partido, domicilio_provincia, email
)
SELECT DISTINCT ON (t.user_id, REPLACE(REPLACE(REPLACE(data->'vendedor'->>'dni', '.', ''), '-', ''), ' ', ''))
    t.user_id,
    COALESCE(data->'vendedor'->>'tipo_persona', 'fisica'),
    data->'vendedor'->>'nombre',
    REPLACE(REPLACE(REPLACE(data->'vendedor'->>'dni', '.', ''), '-', ''), ' ', ''),
    NULLIF(REPLACE(REPLACE(REPLACE(data->'vendedor'->>'cuit', '.', ''), '-', ''), ' ', ''), ''),
    NULLIF(data->'vendedor'->>'pais', ''),
    NULLIF(data->'vendedor'->>'sexo', ''),
    CASE 
        WHEN data->'vendedor'->>'fecha_nacimiento' IS NULL OR data->'vendedor'->>'fecha_nacimiento' = '' 
        THEN NULL 
        ELSE (data->'vendedor'->>'fecha_nacimiento')::date 
    END,
    NULLIF(data->'vendedor'->>'lugar_nacimiento', ''),
    NULLIF(data->'vendedor'->>'autoridad_o_pais_expidio', ''),
    NULLIF(data->'vendedor'->>'telefono', ''),
    NULLIF(data->'vendedor'->>'profesion', ''),
    NULLIF(data->'vendedor'->>'nombre_conyugue', ''),
    NULLIF(data->'vendedor'->>'domicilio_real', ''),
    NULLIF(data->'vendedor'->>'domicilio_real_numero', ''),
    NULLIF(data->'vendedor'->>'domicilio_real_piso', ''),
    NULLIF(data->'vendedor'->>'domicilio_real_depto', ''),
    NULLIF(data->'vendedor'->>'domicilio_real_cp', ''),
    NULLIF(data->'vendedor'->>'domicilio_real_localidad', ''),
    NULLIF(data->'vendedor'->>'domicilio_legal', ''),
    NULLIF(data->'vendedor'->>'domicilio_legal_numero', ''),
    NULLIF(data->'vendedor'->>'domicilio_legal_piso', ''),
    NULLIF(data->'vendedor'->>'domicilio_legal_depto', ''),
    NULLIF(data->'vendedor'->>'domicilio_legal_cp', ''),
    NULLIF(data->'vendedor'->>'domicilio_legal_localidad', ''),
    NULLIF(data->'vendedor'->>'domicilio_departamento_o_partido', ''),
    NULLIF(data->'vendedor'->>'domicilio_provincia', ''),
    NULLIF(data->'vendedor'->>'email', '')
FROM tramites_08 t
WHERE data->'vendedor'->>'nombre' IS NOT NULL 
  AND data->'vendedor'->>'nombre' != ''
  AND data->'vendedor'->>'dni' IS NOT NULL
  AND data->'vendedor'->>'dni' != ''
  AND t.user_id IS NOT NULL
ORDER BY t.user_id, REPLACE(REPLACE(REPLACE(data->'vendedor'->>'dni', '.', ''), '-', ''), ' ', ''), t.created_at DESC
ON CONFLICT (user_id, dni) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    cuit = COALESCE(EXCLUDED.cuit, clientes.cuit),
    pais = COALESCE(EXCLUDED.pais, clientes.pais),
    sexo = COALESCE(EXCLUDED.sexo, clientes.sexo),
    fecha_nacimiento = COALESCE(EXCLUDED.fecha_nacimiento, clientes.fecha_nacimiento),
    lugar_nacimiento = COALESCE(EXCLUDED.lugar_nacimiento, clientes.lugar_nacimiento),
    autoridad_o_pais_expidio = COALESCE(EXCLUDED.autoridad_o_pais_expidio, clientes.autoridad_o_pais_expidio),
    telefono = COALESCE(EXCLUDED.telefono, clientes.telefono),
    profesion = COALESCE(EXCLUDED.profesion, clientes.profesion),
    nombre_conyugue = COALESCE(EXCLUDED.nombre_conyugue, clientes.nombre_conyugue),
    domicilio_real = COALESCE(EXCLUDED.domicilio_real, clientes.domicilio_real),
    domicilio_real_numero = COALESCE(EXCLUDED.domicilio_real_numero, clientes.domicilio_real_numero),
    domicilio_real_piso = COALESCE(EXCLUDED.domicilio_real_piso, clientes.domicilio_real_piso),
    domicilio_real_depto = COALESCE(EXCLUDED.domicilio_real_depto, clientes.domicilio_real_depto),
    domicilio_real_cp = COALESCE(EXCLUDED.domicilio_real_cp, clientes.domicilio_real_cp),
    domicilio_real_localidad = COALESCE(EXCLUDED.domicilio_real_localidad, clientes.domicilio_real_localidad),
    domicilio_legal = COALESCE(EXCLUDED.domicilio_legal, clientes.domicilio_legal),
    domicilio_legal_numero = COALESCE(EXCLUDED.domicilio_legal_numero, clientes.domicilio_legal_numero),
    domicilio_legal_piso = COALESCE(EXCLUDED.domicilio_legal_piso, clientes.domicilio_legal_piso),
    domicilio_legal_depto = COALESCE(EXCLUDED.domicilio_legal_depto, clientes.domicilio_legal_depto),
    domicilio_legal_cp = COALESCE(EXCLUDED.domicilio_legal_cp, clientes.domicilio_legal_cp),
    domicilio_legal_localidad = COALESCE(EXCLUDED.domicilio_legal_localidad, clientes.domicilio_legal_localidad),
    domicilio_departamento_o_partido = COALESCE(EXCLUDED.domicilio_departamento_o_partido, clientes.domicilio_departamento_o_partido),
    domicilio_provincia = COALESCE(EXCLUDED.domicilio_provincia, clientes.domicilio_provincia),
    email = COALESCE(EXCLUDED.email, clientes.email),
    updated_at = NOW();

-- Insertar compradores únicos
INSERT INTO clientes (
    user_id, tipo_persona, nombre, dni, cuit, pais, sexo, 
    fecha_nacimiento, lugar_nacimiento, autoridad_o_pais_expidio,
    telefono, profesion, nombre_conyugue,
    domicilio_real, domicilio_real_numero, domicilio_real_piso, domicilio_real_depto,
    domicilio_real_cp, domicilio_real_localidad,
    domicilio_legal, domicilio_legal_numero, domicilio_legal_piso, domicilio_legal_depto,
    domicilio_legal_cp, domicilio_legal_localidad,
    domicilio_departamento_o_partido, domicilio_provincia, email
)
SELECT DISTINCT ON (t.user_id, REPLACE(REPLACE(REPLACE(data->'comprador'->>'dni', '.', ''), '-', ''), ' ', ''))
    t.user_id,
    COALESCE(data->'comprador'->>'tipo_persona', 'fisica'),
    data->'comprador'->>'nombre',
    REPLACE(REPLACE(REPLACE(data->'comprador'->>'dni', '.', ''), '-', ''), ' ', ''),
    NULLIF(REPLACE(REPLACE(REPLACE(data->'comprador'->>'cuit', '.', ''), '-', ''), ' ', ''), ''),
    NULLIF(data->'comprador'->>'pais', ''),
    NULLIF(data->'comprador'->>'sexo', ''),
    CASE 
        WHEN data->'comprador'->>'fecha_nacimiento' IS NULL OR data->'comprador'->>'fecha_nacimiento' = '' 
        THEN NULL 
        ELSE (data->'comprador'->>'fecha_nacimiento')::date 
    END,
    NULLIF(data->'comprador'->>'lugar_nacimiento', ''),
    NULLIF(data->'comprador'->>'autoridad_o_pais_expidio', ''),
    NULLIF(data->'comprador'->>'telefono', ''),
    NULLIF(data->'comprador'->>'profesion', ''),
    NULLIF(data->'comprador'->>'nombre_conyugue', ''),
    NULLIF(data->'comprador'->>'domicilio_real', ''),
    NULLIF(data->'comprador'->>'domicilio_real_numero', ''),
    NULLIF(data->'comprador'->>'domicilio_real_piso', ''),
    NULLIF(data->'comprador'->>'domicilio_real_depto', ''),
    NULLIF(data->'comprador'->>'domicilio_real_cp', ''),
    NULLIF(data->'comprador'->>'domicilio_real_localidad', ''),
    NULLIF(data->'comprador'->>'domicilio_legal', ''),
    NULLIF(data->'comprador'->>'domicilio_legal_numero', ''),
    NULLIF(data->'comprador'->>'domicilio_legal_piso', ''),
    NULLIF(data->'comprador'->>'domicilio_legal_depto', ''),
    NULLIF(data->'comprador'->>'domicilio_legal_cp', ''),
    NULLIF(data->'comprador'->>'domicilio_legal_localidad', ''),
    NULLIF(data->'comprador'->>'domicilio_departamento_o_partido', ''),
    NULLIF(data->'comprador'->>'domicilio_provincia', ''),
    NULLIF(data->'comprador'->>'email', '')
FROM tramites_08 t
WHERE data->'comprador'->>'nombre' IS NOT NULL 
  AND data->'comprador'->>'nombre' != ''
  AND data->'comprador'->>'dni' IS NOT NULL
  AND data->'comprador'->>'dni' != ''
  AND t.user_id IS NOT NULL
ORDER BY t.user_id, REPLACE(REPLACE(REPLACE(data->'comprador'->>'dni', '.', ''), '-', ''), ' ', ''), t.created_at DESC
ON CONFLICT (user_id, dni) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    cuit = COALESCE(EXCLUDED.cuit, clientes.cuit),
    pais = COALESCE(EXCLUDED.pais, clientes.pais),
    sexo = COALESCE(EXCLUDED.sexo, clientes.sexo),
    fecha_nacimiento = COALESCE(EXCLUDED.fecha_nacimiento, clientes.fecha_nacimiento),
    lugar_nacimiento = COALESCE(EXCLUDED.lugar_nacimiento, clientes.lugar_nacimiento),
    autoridad_o_pais_expidio = COALESCE(EXCLUDED.autoridad_o_pais_expidio, clientes.autoridad_o_pais_expidio),
    telefono = COALESCE(EXCLUDED.telefono, clientes.telefono),
    profesion = COALESCE(EXCLUDED.profesion, clientes.profesion),
    nombre_conyugue = COALESCE(EXCLUDED.nombre_conyugue, clientes.nombre_conyugue),
    domicilio_real = COALESCE(EXCLUDED.domicilio_real, clientes.domicilio_real),
    domicilio_real_numero = COALESCE(EXCLUDED.domicilio_real_numero, clientes.domicilio_real_numero),
    domicilio_real_piso = COALESCE(EXCLUDED.domicilio_real_piso, clientes.domicilio_real_piso),
    domicilio_real_depto = COALESCE(EXCLUDED.domicilio_real_depto, clientes.domicilio_real_depto),
    domicilio_real_cp = COALESCE(EXCLUDED.domicilio_real_cp, clientes.domicilio_real_cp),
    domicilio_real_localidad = COALESCE(EXCLUDED.domicilio_real_localidad, clientes.domicilio_real_localidad),
    domicilio_legal = COALESCE(EXCLUDED.domicilio_legal, clientes.domicilio_legal),
    domicilio_legal_numero = COALESCE(EXCLUDED.domicilio_legal_numero, clientes.domicilio_legal_numero),
    domicilio_legal_piso = COALESCE(EXCLUDED.domicilio_legal_piso, clientes.domicilio_legal_piso),
    domicilio_legal_depto = COALESCE(EXCLUDED.domicilio_legal_depto, clientes.domicilio_legal_depto),
    domicilio_legal_cp = COALESCE(EXCLUDED.domicilio_legal_cp, clientes.domicilio_legal_cp),
    domicilio_legal_localidad = COALESCE(EXCLUDED.domicilio_legal_localidad, clientes.domicilio_legal_localidad),
    domicilio_departamento_o_partido = COALESCE(EXCLUDED.domicilio_departamento_o_partido, clientes.domicilio_departamento_o_partido),
    domicilio_provincia = COALESCE(EXCLUDED.domicilio_provincia, clientes.domicilio_provincia),
    email = COALESCE(EXCLUDED.email, clientes.email),
    updated_at = NOW();

-- Ver cuántos clientes se crearon
SELECT COUNT(*) as total_clientes FROM clientes;
