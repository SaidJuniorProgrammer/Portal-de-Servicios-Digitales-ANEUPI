import { PrismaClient } from '@prisma/client';
import sha256 from 'sha256';

const prisma = new PrismaClient();

async function main() {
  await prisma.auditoria.deleteMany({});
  await prisma.solicitud.deleteMany({});
  await prisma.tipoDocumento.deleteMany({});

  const documentos = [
    {
      nombre: 'Convocatoria A Asamblea General Ordinaria De Accionistas Fundadores',
      descripcion: 'Documento oficial de convocatoria para la asamblea general de socios de ANEUPI.',
      precio: 0.00,
      codigoPlantilla: 'plantilla.tex'
    },
    {
      nombre: 'Formato de solicitud de balances',
      descripcion: 'Solicitud para obtener información de balances financieros.',
      precio: 100.00,
      codigoPlantilla: 'formato_de_solicitud_de_balances.tex'
    },
    {
      nombre: 'Formato de solicitud de ingreso de ser accionista',
      descripcion: 'Solicitud para ingresar como nuevo accionista de ANEUPI.',
      precio: 50.00,
      codigoPlantilla: 'formato_de_solicitud_de_ingreso_de_ser_accionista.tex'
    },
    {
      nombre: 'Formato de solicitud de retiro',
      descripcion: 'Solicitud para retiro de la asociación.',
      precio: 60.00,
      codigoPlantilla: 'formato_de_solicitud_de_retiro.tex'
    },
    {
      nombre: 'Formato de solicitud de multas',
      descripcion: 'Solicitud relacionada con multas y sus valores.',
      precio: 5.00,
      codigoPlantilla: 'formato_de_solicitud_de_multas.tex'
    },
    {
      nombre: 'Formato de solicitud de accionista (Certificado de constancia)',
      descripcion: 'Certificado que constata la condición de accionista.',
      precio: 5.00,
      codigoPlantilla: 'formato_de_solicitud_de_accionista_(certificado_de_constancia).tex'
    },
    {
      nombre: 'Formato de solicitud de voluntariado sin paga',
      descripcion: 'Solicitud para participar en programas de voluntariado.',
      precio: 2.50,
      codigoPlantilla: 'formato_de_solicitud_de_voluntariado.tex'
    },
    {
      nombre: 'Formato de solicitud de crédito',
      descripcion: 'Solicitud para obtener créditos financieros.',
      precio: 5.00,
      codigoPlantilla: 'formato_de_solicitud_de_credito.tex'
    },
    {
      nombre: 'Formato de solicitud sobre el paquete financiero de los accionistas',
      descripcion: 'Información sobre paquetes financieros disponibles para accionistas.',
      precio: 25.00,
      codigoPlantilla: 'formato_de_solicitud_sobre_el_paquete_financiero_de_los_accionistas.tex'
    },
    {
      nombre: 'Formato de solicitud de ingresos y egresos',
      descripcion: 'Reporte de ingresos y egresos financieros.',
      precio: 100.00,
      codigoPlantilla: 'formato_de_solicitud_de_ingresos_y_egresos.tex'
    },
    {
      nombre: 'Formato general',
      descripcion: 'Formato adaptable para solicitudes diversas no contempladas en otros formatos.',
      precio: 2.50,
      codigoPlantilla: 'formato_general.tex'
    },
    {
      nombre: 'Solicitud para las practicas pre profesionales',
      descripcion: 'Solicitud para solicitar las prácticas pre profesionales.',
      precio: 2.50,
      codigoPlantilla: 'formato_de_solicitud_para_practicas_pre_profesionales.tex'
    },
    {
      nombre: 'Formato de solicitud para ser parte de la empresa',
      descripcion: 'Solicitud para ser parte de la empresa.',
      precio: 25.00,
      codigoPlantilla: 'formato_de_solicitud_para_ser_parte_de_la_empresa.tex'
    },
    {
      nombre: 'Formato de solicitud para voluntariado con paga',
      descripcion: 'Solicitud para participar en programas de voluntariado con paga.',
      precio: 10.00,
      codigoPlantilla: 'formato_de_solicitud_para_voluntariado_con_paga.tex'
    }
  ];

  for (const doc of documentos) {
    await prisma.tipoDocumento.create({
      data: doc
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
    where: { email: 'saidpt258@gmail.com' },
    update: {},
    create: {
      email: 'saidpt258@gmail.com',
      password: sha256('user123'),
      rol: 'USER',
      nombreCompleto: 'Said Accionista Prueba',
      cedula: '1900583731',
      direccion: 'La Libertad',
      telefono: '0998583731'
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