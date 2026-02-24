import latex from 'node-latex';
import fs from 'fs';
import path from 'path';

const escapeLatex = (text = '') => {
  return String(text)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
};

export const generarPDF = async (datos) => {
  const solicitudesDir = path.join(process.cwd(), 'public/solicitudes');
  if (!fs.existsSync(solicitudesDir)) {
    fs.mkdirSync(solicitudesDir, { recursive: true });
  }

  const nombreTipo = datos.tipoDocumento?.nombre || datos.tipoDocumento || 'DOCUMENTO OFICIAL';
  const nombreAsamblea = 'Convocatoria A Asamblea General Ordinaria De Accionistas Fundadores';
  const esAsamblea = nombreTipo === nombreAsamblea;

  let nombreArchivo = esAsamblea ? 'plantilla.tex' : `${nombreTipo.toLowerCase().replace(/ /g, '_')}.tex`;
  let templatePath = path.join(process.cwd(), 'src/templates', nombreArchivo);

  if (!fs.existsSync(templatePath)) {
    templatePath = path.join(process.cwd(), 'src/templates/plantilla.tex');
  }

  const codigo = datos.codigoSolicitud || datos.codigo;
  const outputPath = path.join(solicitudesDir, `solicitud_${codigo}.pdf`);

  if (!fs.existsSync(templatePath)) {
    throw new Error("No se encuentra ninguna plantilla .tex en el servidor.");
  }

  let contenido = fs.readFileSync(templatePath, 'utf8');

  let fechaFinal = new Date().toLocaleDateString('es-EC', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  if (datos.datosSolicitud?.fechaAsamblea) {
    const [year, month, day] = datos.datosSolicitud.fechaAsamblea.split('-');
    const fechaLocal = new Date(year, month - 1, day);
    fechaFinal = fechaLocal.toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  const ahora = new Date();

  const fechaGenerado = ahora.toLocaleDateString('es-ES');
  const horaGenerado = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  let textoMulta = '';
  const codigoMulta = datos.datosSolicitud?.codigoMulta?.trim();

  if (codigoMulta) {
    textoMulta = `Se me informe el detalle correspondiente a la multa identificada con el código ${codigoMulta}.`;
  } else {
    textoMulta = `Se me informe el detalle de todas las multas registradas a mi nombre en la Institución Financiera ANEUPI.`;
  }

  contenido = contenido
    .replace(/{{TITULO_DOCUMENTO}}/g, nombreTipo)
    .replace(/{{NOMBRE_ACCIONISTA}}/g, datos.usuario?.nombreCompleto || 'N/A')
    .replace(/{{CORREO_ACCIONISTA}}/g, datos.usuario?.email || 'N/A')
    .replace(/{{CEDULA}}/g, datos.usuario?.cedula || 'N/A')
    .replace(/{{TELEFONO}}/g, datos.usuario?.telefono || 'N/A')
    .replace(/{{DIRECCION_SOLICITANTE}}/g, datos.usuario?.direccion || 'N/A')
    .replace(/{{FECHA_DOCUMENTO}}/g, fechaFinal)
    .replace(/{{FECHA_GENERADO}}/g, fechaGenerado)
    .replace(/{{HORA_GENERADO}}/g, horaGenerado)
    .replace(/{{CODIGO_BLINDADO}}/g, codigo || 'SIN-CODIGO')
    .replace(/{{MOTIVO_RETIRO}}/g, datos.datosSolicitud?.razonRetiro || 'SIN-MOTIVO')
    .replace(/{{AREA_VOLUNTARIADO}}/g, datos.datosSolicitud?.areaInteres || 'SIN-AREA')
    .replace(/{{MONTO_CREDITO}}/g, datos.datosSolicitud?.monto || 'SIN-AREA')
    .replace(/{{PLAZO_CREDITO}}/g, datos.datosSolicitud?.plazo || 'SIN-AREA')
    .replace(/{{DESTINO_CREDITO}}/g, datos.datosSolicitud?.destino || 'SIN-AREA')
    .replace(/{{MES_REPORTE}}/g, datos.datosSolicitud?.mesReporte || 'SIN-MES')
    .replace(/{{INSTITUCION_EDUCATIVA}}/g, datos.datosSolicitud?.institucionEducativa || 'N/A')
    .replace(/{{CARRERA}}/g, datos.datosSolicitud?.carrera || 'N/A')
    .replace(/{{HORAS_PRACTICAS}}/g, datos.datosSolicitud?.horasPracticas || 'N/A')
    .replace(/{{TEXTO_SOLICITUD_MULTA}}/g, escapeLatex(textoMulta))
    .replace(/{{DESCRIPCION_SOLICITUD}}/g, escapeLatex(datos.datosSolicitud?.descripcionGeneral || 'SIN DESCRIPCIÓN'))
    .replace(/{{PERIODO_CONTABLE}}/g, escapeLatex(datos.datosSolicitud?.periodo || 'NO ESPECIFICADO'))
    .replace(/{{MOTIVO_SOLICITUD}}/g, escapeLatex(datos.datosSolicitud?.motivo || 'NO ESPECIFICADO'))
    ;


  const options = {
    cmd: 'C:\\Users\\User\\AppData\\Local\\Programs\\MiKTeX\\miktex\\bin\\x64\\pdflatex.exe',
    inputs: path.join(process.cwd(), 'src/templates'),
    errorLogs: path.join(process.cwd(), 'src/templates/assets/temp_error.log')
  };


  const output = fs.createWriteStream(outputPath);
  const pdf = latex(contenido, options);

  return new Promise((resolve, reject) => {
    pdf.pipe(output);
    pdf.on('error', err => reject(err));
    pdf.on('finish', () => resolve(`/solicitudes/solicitud_${codigo}.pdf`));
  });
};