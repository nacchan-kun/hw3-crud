import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import { loadSwaggerSpec } from './utils/swagger.js';

export const setupServer = () => {
  const app = express();

  // Налаштування CORS
  app.use(cors());

  // Налаштування логгера pino
  app.use(pino({
    transport: {
      target: 'pino-pretty'
    }
  }));

  // Middleware для парсингу JSON
  app.use(express.json());

  // Middleware для парсингу cookies
  app.use(cookieParser());

  // API Documentation route
  const swaggerSpec = loadSwaggerSpec();
  if (swaggerSpec) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Contacts Management API Documentation'
    }));
  }

  // Welcome роут для кореня
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 200,
      message: 'Welcome to hw3-crud API!',
      documentation: 'Visit /api-docs for API documentation',
    });
  });

  // Реєстрація роутів
  app.use('/auth', authRouter);
  app.use(contactsRouter);

    // Middleware для обробки неіснуючих роутів
    app.use(notFoundHandler);

    // Middleware для обробки помилок
    app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
