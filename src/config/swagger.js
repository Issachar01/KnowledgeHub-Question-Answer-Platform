const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KnowledgeHub API',
      version: '1.0.0',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://knowledgehub-backend-8bby.onrender.com'
          : 'http://localhost:5000',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

// Force both version keys on the root object to satisfy Swagger UI entirely
specs.openapi = '3.0.0';
specs.swagger = '2.0';

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};