const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KnowledgeHub API',
      version: '1.0.0',
      description: 'API documentation for KnowledgeHub Question & Answer Platform',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://knowledgehub-backend-8bby.onrender.com'
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Production Server' : 'Local Development Server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Adjust path to your route files
};