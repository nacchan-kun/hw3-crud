import 'dotenv/config';
import fs from 'fs/promises';
import { initMongoConnection } from './src/db/initMongoConnection.js';
import { ContactsCollection } from './src/db/models/contact.js';

const seedContacts = async () => {
  try {
    // Підключення до бази даних
    await initMongoConnection();
    
    // Читання файлу contacts.json
    const contactsData = await fs.readFile('./contacts.json', 'utf-8');
    const contacts = JSON.parse(contactsData);
    
    // Очищення існуючої колекції (опціонально)
    await ContactsCollection.deleteMany({});
    console.log('Existing contacts cleared');
    
    // Вставка нових контактів
    const result = await ContactsCollection.insertMany(contacts);
    console.log(`Successfully imported ${result.length} contacts`);
    
    // Виведення імпортованих контактів для перевірки
    const importedContacts = await ContactsCollection.find({});
    console.log('Imported contacts:');
    importedContacts.forEach((contact, index) => {
      console.log(`${index + 1}. ${contact.name} (${contact.contactType}) - ${contact.phoneNumber}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding contacts:', error);
    process.exit(1);
  }
};

seedContacts();
