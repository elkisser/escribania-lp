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

El mantenimiento se ejecuta con **Vercel Cron**, sin GitHub Actions y sin depender de una computadora encendida.

- `vercel.json` programa un `GET` a `https://<dominio-de-produccion>/api/keep-alive` con la expresión `0 12 */3 * *`.
- El endpoint consulta la tabla `tramites_08` de Supabase por HTTPS, sin modificar datos ni devolver registros. La consulta tiene un límite de 15 segundos.
- El horario es 12:00 UTC (09:00 de Argentina; en Hobby puede ejecutarse dentro de esa hora). Se ejecuta los días 1, 4, 7, … de cada mes: no representa un intervalo exacto de 72 horas y al cambiar de mes puede haber un intervalo menor.

### Activación en Vercel

1. Configurar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en las variables de entorno de **Production** del proyecto.
2. Se recomienda configurar también `CRON_SECRET` con un valor aleatorio de al menos 16 caracteres. Vercel lo envía automáticamente como `Authorization: Bearer <CRON_SECRET>` y el endpoint rechaza peticiones sin ese token cuando está configurado.
3. Desplegar estos cambios a **producción**. El cron se registra con ese despliegue; no se activa ejecutando la aplicación localmente ni en un preview.
4. En **Settings → Cron Jobs**, verificar que `/api/keep-alive` esté habilitado y usar **Run** para probarlo. Revisar los logs: una consulta correcta responde `200` con `success: true`; los errores de configuración o de Supabase responden `503` o `500`.

Esta consulta busca reducir la inactividad; no garantiza que Supabase nunca pause el proyecto. Si ya está pausado, debe reactivarse desde Supabase antes de probar el cron.

Referencias: [Vercel Cron](https://vercel.com/docs/cron-jobs) y [gestión y protección del cron](https://vercel.com/docs/cron-jobs/manage-cron-jobs).

<p align="center">
  <b>© 2026 RM Escribanía Argentina</b><br/>
  <i>Tecnología aplicada a la gestión notarial.</i>
</p>
