const swaggerUi = require('swagger-ui-express');

const rawSpec = {
  openapi: '3.0.0',
  info: {
    title: 'KnowledgeHub API Test',
    version: '1.0.0'
  },
  servers: [
    {
      url: 'https://knowledgehub-backend-8bby.onrender.com'
    }
  ],
  paths: {
    '/': {
      get: {
        summary: 'Test endpoint',
        responses: {
          '200': {
            description: 'Success'
          }
        }
      }
    }
  }
};

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(rawSpec));
};