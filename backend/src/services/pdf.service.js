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
  const nombreTipo = datos.tipoDocumento?.nombre || datos.tipoDocumento || 'DOCUMENTO OFICIAL';
  const nombreAsamblea = 'Convocatoria A Asamblea General Ordinaria De Accionistas Fundadores';
  const esAsamblea = nombreTipo === nombreAsamblea;

  let nombreArchivo = esAsamblea ? 'plantilla.tex' : `${nombreTipo.toLowerCase().replace(/ /g, '_')}.tex`;
  let templatePath = path.join(process.cwd(), 'src/templates', nombreArchivo);

  if (!fs.existsSync(templatePath)) {
    templatePath = path.join(process.cwd(), 'src/templates/plantilla.tex');
  }

  const codigoFinal = datos.codigoSolicitud || datos.codigo || 'SIN-CODIGO';

  if (!fs.existsSync(templatePath)) {
    throw new Error("No se encuentra ninguna plantilla .tex en el servidor.");
  }

  let contenido = fs.readFileSync(templatePath, 'utf8');

  const ahora = new Date();
  const fechaGenerado = ahora.toLocaleDateString('es-ES');
  const horaGenerado = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  contenido = contenido
    .replace(/{{TITULO_DOCUMENTO}}/g, escapeLatex(nombreTipo))
    .replace(/{{NOMBRE_ACCIONISTA}}/g, escapeLatex(datos.usuario?.nombreCompleto || 'NO ESPECIFICADO'))
    .replace(/{{CORREO_ACCIONISTA}}/g, escapeLatex(datos.usuario?.email || 'NO ESPECIFICADO'))
    .replace(/{{CEDULA}}/g, escapeLatex(datos.usuario?.cedula || 'NO ESPECIFICADO'))
    .replace(/{{TELEFONO}}/g, escapeLatex(datos.usuario?.telefono || 'NO ESPECIFICADO'))
    .replace(/{{DIRECCION_SOLICITANTE}}/g, escapeLatex(datos.usuario?.direccion || 'NO ESPECIFICADO'))
    .replace(/{{FECHA_DOCUMENTO}}/g, fechaGenerado)
    .replace(/{{FECHA_GENERADO}}/g, fechaGenerado)
    .replace(/{{HORA_GENERADO}}/g, horaGenerado)
    .replace(/{{CODIGO_BLINDADO}}/g, escapeLatex(codigoFinal))
    .replace(/{{MOTIVO_RETIRO}}/g, 'NO APLICA')
    .replace(/{{AREA_VOLUNTARIADO}}/g, 'NO APLICA')
    .replace(/{{MONTO_CREDITO}}/g, '0')
    .replace(/{{PLAZO_CREDITO}}/g, '0')
    .replace(/{{DESTINO_CREDITO}}/g, 'NO APLICA')
    .replace(/{{MES_REPORTE}}/g, 'NO APLICA')
    .replace(/{{INSTITUCION_EDUCATIVA}}/g, 'NO APLICA')
    .replace(/{{CARRERA}}/g, 'NO APLICA')
    .replace(/{{HORAS_PRACTICAS}}/g, '0')
    .replace(/{{TEXTO_SOLICITUD_MULTA}}/g, 'NO APLICA')
    .replace(/{{DESCRIPCION_SOLICITUD}}/g, 'NO APLICA')
    .replace(/{{PERIODO_CONTABLE}}/g, '0')
    .replace(/{{MOTIVO_SOLICITUD}}/g, 'NO APLICA');

  const options = {
    cmd: 'C:\\Users\\said2\\AppData\\Local\\Programs\\MiKTeX\\miktex\\bin\\x64\\pdflatex.exe',
    inputs: path.join(process.cwd(), 'src/templates'),
    errorLogs: path.join(process.cwd(), 'src/templates/assets/temp_error.log')
  };

  const pdf = latex(contenido, options);

  return new Promise((resolve, reject) => {
    const chunks = [];
    pdf.on('data', chunk => chunks.push(chunk));
    pdf.on('error', err => reject(err));
    pdf.on('finish', () => resolve(Buffer.concat(chunks)));
  });
};