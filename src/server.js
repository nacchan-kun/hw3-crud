import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import contactsRouter from './routers/contacts.js';

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

  // Обробка неіснуючих роутів (повертає статус 404)
  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
