export const patchContactById = async (contactId, updateData) => {
  const contact = await ContactsCollection.findByIdAndUpdate(contactId, updateData, { new: true });
  return contact;
};
export const deleteContactById = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete(contactId);
  return contact;
};
import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = async (contactData) => {
  const contact = await ContactsCollection.create(contactData);
  return contact;
};
