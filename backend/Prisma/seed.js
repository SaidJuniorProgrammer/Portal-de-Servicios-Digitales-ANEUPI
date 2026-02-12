// backend/prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(' Iniciando siembra de datos...');

  // 1. Crear Tipos de Documentos 
  const documentos = [
    {
      nombre: 'Carta de Recomendación',
      descripcion: 'Documento formal de recomendación profesional para trámites laborales.',
      precio: 4.00,
      codigoPlantilla: 'carta_recomendacion_v1'
    },
    {
      nombre: 'Certificado de Estudios',
      descripcion: 'Certifica la aprobación de cursos y capacitaciones en ANEUPI.',
      precio: 5.00,
      codigoPlantilla: 'certificado_estudios_v1'
    },
    {
      nombre: 'Constancia Laboral',
      descripcion: 'Documento que certifica la relación laboral activa o pasada.',
      precio: 3.50,
      codigoPlantilla: 'constancia_laboral_v1'
    },
    {
      nombre: 'Solicitud de Vacaciones',
      descripcion: 'Formato estandarizado para solicitar días de descanso.',
      precio: 2.00,
      codigoPlantilla: 'solicitud_vacaciones_v1'
    },
  ];

  for (const doc of documentos) {
    await prisma.tipoDocumento.create({
      data: doc,
    });
  }

  console.log(' Tipos de documentos creados.');
  
  // 2. Crear un Usuario Admin de prueba
  await prisma.usuario.create({
    data: {
      email: 'admin@aneupi.com',
      password: 'admin123', 
      rol: 'ADMIN',
      nombreCompleto: 'Administrador Principal',
      cedula: '0999999999'
    }
  });

  console.log('✅ Usuario Admin creado (admin@aneupi.com).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });