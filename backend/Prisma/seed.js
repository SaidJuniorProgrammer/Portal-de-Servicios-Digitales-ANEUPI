// backend/prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(' Iniciando siembra de datos...');

  // 1. Crear Tipos de Documentos 
  const documentos = [
    {
      nombre: 'Formato de solicitud de balances',
      descripcion: 'Solicitud para obtener información de balances financieros.',
      precio: 3.00,
      codigoPlantilla: 'solicitud_balances_v1'
    },
    {
      nombre: 'Formato de solicitud de ingreso de ser accionista',
      descripcion: 'Solicitud para ingresar como nuevo accionista de ANEUPI.',
      precio: 5.00,
      codigoPlantilla: 'ingreso_accionista_v1'
    },
    {
      nombre: 'Formato de solicitud de retiro',
      descripcion: 'Solicitud para retiro de la asociación.',
      precio: 2.50,
      codigoPlantilla: 'solicitud_retiro_v1'
    },
    {
      nombre: 'Formato de solicitud de multas',
      descripcion: 'Solicitud relacionada con multas y sus valores.',
      precio: 1.50,
      codigoPlantilla: 'solicitud_multas_v1'
    },
    {
      nombre: 'Formato de solicitud de accionista (Certificado de constancia)',
      descripcion: 'Certificado que constata la condición de accionista.',
      precio: 4.00,
      codigoPlantilla: 'certificado_accionista_v1'
    },
    {
      nombre: 'Formato de solicitud de voluntariado',
      descripcion: 'Solicitud para participar en programas de voluntariado.',
      precio: 1.00,
      codigoPlantilla: 'solicitud_voluntariado_v1'
    },
    {
      nombre: 'Formato de solicitud de crédito',
      descripcion: 'Solicitud para obtener créditos financieros.',
      precio: 6.00,
      codigoPlantilla: 'solicitud_credito_v1'
    },
    {
      nombre: 'Formato de solicitud sobre el paquete financiero de los accionistas',
      descripcion: 'Información sobre paquetes financieros disponibles para accionistas.',
      precio: 4.50,
      codigoPlantilla: 'paquete_financiero_v1'
    },
    {
      nombre: 'Formato de solicitud de ingresos y egresos',
      descripcion: 'Reporte de ingresos y egresos financieros.',
      precio: 3.50,
      codigoPlantilla: 'ingresos_egresos_v1'
    },
    {
      nombre: 'Formato general',
      descripcion: 'Formato adaptable para solicitudes diversas no contempladas en otros formatos.',
      precio: 2.00,
      codigoPlantilla: 'formato_general_v1'
    }
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