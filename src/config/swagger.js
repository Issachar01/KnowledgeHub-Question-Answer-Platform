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

// Force stamp it so it cannot be stripped
specs.openapi = '3.0.0';
console.log('Generated Swagger Spec:', JSON.stringify(specs, null, 2));

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};