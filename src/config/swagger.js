const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    info: {
      title: 'KnowledgeHub API',
      version: '1.0.0',
      description: 'API documentation for KnowledgeHub Q&A Platform',
    },
    swagger: '2.0', // Forces a valid recognized version for older swagger-jsdoc parsers
    host: process.env.NODE_ENV === 'production' 
      ? 'knowledgehub-backend-8bby.onrender.com' 
      : 'localhost:5000',
    basePath: '/',
    schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
  },
  apis: ['./src/routes/*.js'],
};