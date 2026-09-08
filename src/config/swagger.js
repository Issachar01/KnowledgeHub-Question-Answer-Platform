const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "KnowledgeHub API",
      version: "1.0.0",
      description:
        "REST API for KnowledgeHub, a Question and Answer Platform."
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server"
      }
    ],

    tags: [
      {
        name: "Authentication",
        description: "User registration, login, token refresh and logout"
      },
      {
        name: "Users",
        description: "User profile management"
      },
      {
        name: "Questions",
        description: "Question management"
      },
      {
        name: "Tags",
        description: "Tag and tagged-question operations"
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            name: {
              type: "string",
              example: "Saron Hailemeskel"
            },
            email: {
              type: "string",
              format: "email",
              example: "user@example.com"
            },
            bio: {
              type: "string",
              nullable: true,
              example: "Computer Science student and developer."
            },
            profileImage: {
              type: "string",
              nullable: true,
              example: "https://res.cloudinary.com/example/image/upload/profile.jpg"
            },
            reputation: {
              type: "integer",
              example: 100
            },
            role: {
              type: "string",
              enum: ["USER", "ADMIN", "MODERATOR"],
              example: "USER"
            }
          }
        },

        Tag: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            name: {
              type: "string",
              example: "javascript"
            },
            createdAt: {
              type: "string",
              format: "date-time"
            }
          }
        },

        Question: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            title: {
              type: "string",
              example: "How do I use async/await in JavaScript?"
            },
            description: {
              type: "string",
              example:
                "I am trying to understand how async/await works with promises."
            },
            authorId: {
              type: "integer",
              example: 1
            },
            createdAt: {
              type: "string",
              format: "date-time"
            },
            updatedAt: {
              type: "string",
              format: "date-time"
            }
          }
        },

        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false
            },
            message: {
              type: "string",
              example: "Invalid request"
            }
          }
        }
      }
    }
  },

  apis: [
    "./src/routes/*.js"
  ]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;