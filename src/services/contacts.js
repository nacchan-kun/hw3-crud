export const getPaginatedContacts = async (page = 1, perPage = 10, type, isFavourite, sortBy, sortOrder, userId) => {
  const skip = (page - 1) * perPage;
  const filter = { userId };
  if (type) filter.contactType = type;
  if (typeof isFavourite !== 'undefined') filter.isFavourite = isFavourite === 'true';
  const totalItems = await ContactsCollection.countDocuments(filter);
  const sortOptions = {};
  if (sortBy) sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  const contacts = await ContactsCollection.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(perPage);
  const totalPages = Math.ceil(totalItems / perPage);
  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages
  };
};
export const patchContactById = async (contactId, updateData, userId) => {
  const contact = await ContactsCollection.findOneAndUpdate({ _id: contactId, userId }, updateData, { new: true });
  return contact;
};
export const deleteContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({ _id: contactId, userId });
  return contact;
};
import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (contactData, userId) => {
  const contact = await ContactsCollection.create({ ...contactData, userId });
  return contact;
};
