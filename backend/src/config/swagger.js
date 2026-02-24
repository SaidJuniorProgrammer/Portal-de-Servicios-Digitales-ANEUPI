import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Portal de Servicios Digitales ANEUPI',
      version: '1.0.0',
      description: 'API para gestión de solicitudes de documentos digitales'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ]
  },
  apis: ['./src/infrastructure/http/routes/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);
