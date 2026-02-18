import latex from 'node-latex';
import fs from 'fs';
import path from 'path';

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

  contenido = contenido
    .replace(/{{TITULO_DOCUMENTO}}/g, nombreTipo)
    .replace(/{{NOMBRE_ACCIONISTA}}/g, datos.usuario?.nombreCompleto || 'N/A')
    .replace(/{{CEDULA}}/g, datos.usuario?.cedula || 'N/A')
    .replace(/{{FECHA_DOCUMENTO}}/g, fechaFinal)
    .replace(/{{CODIGO_BLINDADO}}/g, codigo || 'SIN-CODIGO');

  const options = {
    inputs: path.join(process.cwd(), 'src/templates'), 
    fonts: path.join(process.cwd(), 'src/templates/assets'),
    errorLogs: path.join(process.cwd(), 'temp_error.log')
  };

  const output = fs.createWriteStream(outputPath);
  const pdf = latex(contenido, options);

  return new Promise((resolve, reject) => {
    pdf.pipe(output);
    pdf.on('error', err => reject(err));
    pdf.on('finish', () => resolve(`/solicitudes/solicitud_${codigo}.pdf`));
  });
};