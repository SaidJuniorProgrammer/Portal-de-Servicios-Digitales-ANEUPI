import { PrismaClient } from '@prisma/client';
import sha256 from 'sha256';

const prisma = new PrismaClient();

async function main() {
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
    await prisma.tipoDocumento.upsert({
      where: { id: documentos.indexOf(doc) + 1 },
      update: doc,
      create: doc
    });
  }

  await prisma.usuario.upsert({
    where: { email: 'admin@aneupi.com' },
    update: {},
    create: {
      email: 'admin@aneupi.com',
      password: sha256('admin123'),
      rol: 'ADMIN',
      nombreCompleto: 'Administrador Principal',
      cedula: '0999999999',
      direccion: 'Oficina Central',
      telefono: '0999999999'
    }
  });

  await prisma.usuario.upsert({
    where: { email: 'accionista@aneupi.com' },
    update: {},
    create: {
      email: 'accionista@aneupi.com',
      password: sha256('user123'),
      rol: 'USER',
      nombreCompleto: 'Said Accionista Prueba',
      cedula: '0888888888',
      direccion: 'La Libertad',
      telefono: '0888888888'
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });