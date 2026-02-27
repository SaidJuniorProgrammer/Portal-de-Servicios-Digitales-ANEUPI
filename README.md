# 🏛️ Portal de Servicios Digitales ANEUPI

Un sistema integral full-stack diseñado para la gestión, aprobación y generación automática de documentos oficiales y solicitudes para los accionistas de ANEUPI.

## ✨ Características Principales

* **Gestión de Solicitudes:** Panel interactivo para que los usuarios soliciten documentos y suban comprobantes de pago.
* **Panel de Administración Inteligente:** Interfaz segura con protección anti-doble clic y carga asíncrona para aprobar o rechazar solicitudes.
* **Motor de PDF Dinámico:** Generación de documentos oficiales al vuelo utilizando plantillas de LaTeX (`.tex`) compiladas en la memoria RAM del servidor (sin generar archivos basura).
* **Sistema de Correos Automatizado:** Envío automático de notificaciones y documentos PDF adjuntos directamente al correo del accionista tras la aprobación.
* **Trazabilidad y Seguridad:** Generación de un "Código Único Blindado" (`ANEUPI-AÑO-ID-HASH`) estampado en cada documento y guardado en la base de datos para futuras validaciones.

## 🛠️ Tecnologías Utilizadas

**Frontend:**
* React + Vite
* Tailwind CSS (Diseño y animaciones)
* Axios (Consumo de API)
* React Icons & Sonner (Notificaciones UI)

**Backend:**
* Node.js + Express
* Prisma ORM (Gestión de Base de Datos y Semillas)
* Node-LaTeX (Compilación de documentos .tex)
* Nodemailer (Integración de servidor de correos)
* Multer (Gestión de comprobantes de pago)

## 🚀 Instalación y Uso

### Prerrequisitos
* Node.js (v18 o superior)
* Base de datos PostgreSQL o MySQL compatible con Prisma.
* Distribución de LaTeX instalada en el servidor (Ej. MiKTeX o TeX Live) para la compilación de PDFs.

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/SaidJuniorProgrammer/Portal-de-Servicios-Digitales-ANEUPI.git](https://github.com/SaidJuniorProgrammer/Portal-de-Servicios-Digitales-ANEUPI.git)
2. **Configurar el Backend:**

* cd backend
* npm install

Crear un archivo .env basado en .env.example con tu cadena de conexión a la BD y credenciales de correo.

Ejecutar migraciones y semillas (seed):

* npx prisma migrate dev
* npx prisma db seed
  
3. **Configurar el Frontend:**

* cd ../frontend
* npm install

Crear un archivo .env configurando la variable VITE_API_URL apuntando a tu backend.

4. **Ejecutar el proyecto en desarrollo:**

* En la terminal del backend: npm run dev

* En la terminal del frontend: npm run dev

👥 Equipo de Desarrollo
* Said F Pinto

* Michael E. Quiroz

* Jorge A. Salas
