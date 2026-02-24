import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const enviarCorreoConPDF = async (destinatario, asunto, mensaje, pdfBuffer, nombreArchivo = 'solicitud.pdf') => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: destinatario,
    subject: asunto,
    text: mensaje,
    attachments: [{
      filename: nombreArchivo,
      content: pdfBuffer
    }]
  };

  return await transporter.sendMail(mailOptions);
};