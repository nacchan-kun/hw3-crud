import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  try {
    const user = process.env.MONGODB_USER;
    const password = process.env.MONGODB_PASSWORD;
    const url = process.env.MONGODB_URL;
    const db = process.env.MONGODB_DB;

    // Валідація змінних оточення
    if (!user || !password || !url || !db) {
      throw new Error('Missing required MongoDB environment variables. Please check MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, and MONGODB_DB in your .env file.');
    }

    const connectionString = `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority`;

    await mongoose.connect(connectionString);
    
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error while setting up mongo connection', error);
    throw error;
  }
};
