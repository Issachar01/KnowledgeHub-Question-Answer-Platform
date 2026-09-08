const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KnowledgeHub API',
      version: '1.0.0',
      description: 'API documentation for KnowledgeHub Q&A Platform',
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

const swaggerSpec = swaggerJsdoc(options);

// Force stamp it to guarantee the version field exists
swaggerSpec.openapi = '3.0.0';

module.exports = swaggerSpec;