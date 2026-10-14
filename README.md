# 🏛️ Escribanía RM - Gestión Digital de Trámites 08

<p align="center">
  <img src="public/logo.svg" width="120" alt="Escribanía RM Logo" />
</p>

---

## 📋 Descripción General

**Escribanía RM** es una solución digital de alto nivel diseñada específicamente para el sector notarial argentino. Esta plataforma optimiza el proceso crítico de transferencia vehicular, permitiendo la carga ágil y la generación precisa de los formularios 08 oficiales para **automóviles** y **motocicletas**.

Desarrollada bajo una estética profesional y sobria, la herramienta busca eliminar errores de carga manual y centralizar la gestión de trámites en un entorno seguro y accesible desde cualquier dispositivo.

---

## ✨ Características Principales

### 🚗 Gestión de Trámites Vehiculares
*   **Carga Inteligente**: Interfaz segmentada por pasos para recolectar datos de vendedores, compradores y vehículos de forma fluida.
*   **Generación de PDF**: Motor de renderizado que produce el formulario 08 oficial con los datos mapeados exactamente en su posición legal.

### 📜 Sistema de Historial y Borradores
*   **Control Total**: Acceso centralizado a todos los trámites realizados.
*   **Edición Dinámica**: Posibilidad de guardar borradores para completar o corregir datos en sesiones posteriores sin perder el progreso.

### 📱 Experiencia Mobile-First
*   **Operatividad Total**: Diseño adaptado para ser utilizado desde smartphones y tablets con la misma eficiencia que en una computadora de escritorio.
*   **Navegación Táctica**: Botonera fija y controles optimizados para el uso rápido en oficina o campo.

### 🔒 Seguridad Notarial
*   **Acceso Protegido**: Sistema de autenticación robusto para garantizar que solo personal autorizado acceda a la información sensible de los clientes.
*   **Confidencialidad**: Protección de datos mediante integración segura con Supabase.

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend**: Next.js 16 (App Router)
*   **Estilos**: Tailwind CSS & Framer Motion
*   **Base de Datos & Auth**: Supabase
*   **Generación de Documentos**: PDF-Lib

---

## ⚡ Mantenimiento Activo de Supabase (Keep-Alive)

Para evitar que el plan gratuito de Supabase se suspenda por inactividad tras 7 días de desuso, el proyecto cuenta con dos mecanismos automáticos cada 3 días:

1. **GitHub Actions (`.github/workflows/supabase-keep-alive.yml`)**:
   - Se ejecuta automáticamente cada 3 días vía cron (`0 12 */3 * *`).
   - Envía una petición REST a la base de datos de Supabase.
   - Requiere tener configurados los siguientes Secrets en tu repositorio de GitHub (**Settings -> Secrets and variables -> Actions**):
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - También permite ejecutarse manualmente desde la pestaña **Actions** en GitHub.

2. **Endpoint API y Vercel Cron (`/api/keep-alive` + `vercel.json`)**:
   - Ruta API nativa en Next.js que ejecuta una consulta ligera a la base de datos.
   - Si la aplicación está desplegada en Vercel, el cron se ejecutará automáticamente cada 3 días según lo estipulado en [vercel.json](file:///c:/Users/SFC/Desktop/Trabajo/escribania-lp/vercel.json).


<p align="center">
  <b>© 2026 RM Escribanía Argentina</b><br/>
  <i>Tecnología aplicada a la gestión notarial.</i>
</p>
