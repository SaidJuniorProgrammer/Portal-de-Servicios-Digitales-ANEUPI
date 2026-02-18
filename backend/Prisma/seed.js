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
      codigoPlantilla: 'plantilla.tex',
      camposRequeridos: [
        { name: 'fechaAsamblea', label: 'Fecha de la Asamblea', type: 'date' }
      ]
    },
    {
      nombre: 'Formato de solicitud de balances',
      descripcion: 'Solicitud para obtener información de balances financieros.',
      precio: 3.00,
      codigoPlantilla: 'formato_de_solicitud_de_balances.tex',
      camposRequeridos: [
        { name: 'periodo', label: 'Período Contable (Año)', type: 'number' },
        { name: 'motivo', label: 'Motivo de la solicitud', type: 'text' }
      ]
    },
    {
      nombre: 'Formato de solicitud de ingreso de ser accionista',
      descripcion: 'Solicitud para ingresar como nuevo accionista de ANEUPI.',
      precio: 5.00,
      codigoPlantilla: 'formato_de_solicitud_de_ingreso_de_ser_accionista.tex',
      camposRequeridos: [
        { name: 'fechaIngreso', label: 'Fecha sugerida de ingreso', type: 'date' }
      ]
    },
    {
      nombre: 'Formato de solicitud de retiro',
      descripcion: 'Solicitud para retiro de la asociación.',
      precio: 2.50,
      codigoPlantilla: 'formato_de_solicitud_de_retiro.tex',
      camposRequeridos: [
        { name: 'razonRetiro', label: 'Razón del retiro', type: 'text' }
      ]
    },
    {
      nombre: 'Formato de solicitud de multas',
      descripcion: 'Solicitud relacionada con multas y sus valores.',
      precio: 1.50,
      codigoPlantilla: 'formato_de_solicitud_de_multas.tex',
      camposRequeridos: [
        { name: 'codigoMulta', label: 'Código de la multa (si aplica)', type: 'text' }
      ]
    },
    {
      nombre: 'Formato de solicitud de accionista (Certificado de constancia)',
      descripcion: 'Certificado que constata la condición de accionista.',
      precio: 4.00,
      codigoPlantilla: 'formato_de_solicitud_de_accionista_(certificado_de_constancia).tex',
      camposRequeridos: []
    },
    {
      nombre: 'Formato de solicitud de voluntariado',
      descripcion: 'Solicitud para participar en programas de voluntariado.',
      precio: 1.00,
      codigoPlantilla: 'formato_de_solicitud_de_voluntariado.tex',
      camposRequeridos: [
        { name: 'areaInteres', label: 'Área de interés (Salud, Educación, etc.)', type: 'text' }
      ]
    },
    {
      nombre: 'Formato de solicitud de crédito',
      descripcion: 'Solicitud para obtener créditos financieros.',
      precio: 6.00,
      codigoPlantilla: 'formato_de_solicitud_de_credito.tex',
      camposRequeridos: [
        { name: 'monto', label: 'Monto solicitado ($)', type: 'number' },
        { name: 'plazo', label: 'Plazo en meses', type: 'number' },
        { name: 'destino', label: 'Destino del crédito', type: 'text' }
      ]
    },
    {
      nombre: 'Formato de solicitud sobre el paquete financiero de los accionistas',
      descripcion: 'Información sobre paquetes financieros disponibles para accionistas.',
      precio: 4.50,
      codigoPlantilla: 'formato_de_solicitud_sobre_el_paquete_financiero_de_los_accionistas.tex',
      camposRequeridos: []
    },
    {
      nombre: 'Formato de solicitud de ingresos y egresos',
      descripcion: 'Reporte de ingresos y egresos financieros.',
      precio: 3.50,
      codigoPlantilla: 'formato_de_solicitud_de_ingresos_y_egresos.tex',
      camposRequeridos: [
        { name: 'mesReporte', label: 'Mes del reporte solicitado', type: 'text' }
      ]
    },
    {
      nombre: 'Formato general',
      descripcion: 'Formato adaptable para solicitudes diversas no contempladas en otros formatos.',
      precio: 2.00,
      codigoPlantilla: 'formato_general.tex',
      camposRequeridos: [
        { name: 'descripcionGeneral', label: 'Descripción detallada de la solicitud', type: 'text' }
      ]
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