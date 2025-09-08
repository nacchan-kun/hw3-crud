import swaggerUi from 'swagger-ui-express';
import { loadSwaggerSpec } from '../utils/swagger.js';

export const swaggerDocs = () => {
  const swaggerSpec = loadSwaggerSpec();
  
  if (!swaggerSpec) {
    // Return a middleware that shows an error if swagger spec fails to load
    return (req, res, next) => {
      res.status(500).json({
        error: 'Failed to load API documentation',
        message: 'Swagger specification could not be loaded'
      });
    };
  }

  // Return swagger UI middleware with custom configuration
  return [
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Contacts Management API Documentation',
      customfavIcon: '/favicon.ico',
      swaggerOptions: {
        persistAuthorization: true,
      }
    })
  ];
};
