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

// Force inject the openapi version if the parser drops it
specs.openapi = specs.openapi || '3.0.0';

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};