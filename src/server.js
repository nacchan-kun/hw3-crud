import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import contactsRouter from './routers/contacts.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

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

  // Реєстрація роутів
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
