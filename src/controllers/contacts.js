import createError from 'http-errors';
import { getContactById, createContact, deleteContactById, patchContactById, getPaginatedContacts } from '../services/contacts.js';
import { uploadToCloudinary } from '../services/cloudinary.js';

export const createContactController = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    if (!name || !phoneNumber || !contactType) {
      throw createError(400, 'Missing required fields: name, phoneNumber, contactType');
    }

    const contactData = { name, phoneNumber, email, isFavourite, contactType };

    // Handle photo upload if present
    if (req.file) {
      try {
        const photoUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        contactData.photo = photoUrl;
      } catch {
        throw createError(500, 'Failed to upload photo');
      }
    }

    const newContact = await createContact(contactData, req.user._id);

    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactsController = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const type = req.query.type;
    const isFavourite = req.query.isFavourite;
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.sortOrder || 'asc';
    const result = await getPaginatedContacts(page, perPage, type, isFavourite, sortBy, sortOrder, req.user._id);
    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId, req.user._id);

    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updateData = { ...req.body };

    // Handle photo upload if present
    if (req.file) {
      try {
        const photoUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        updateData.photo = photoUrl;
      } catch {
        throw createError(500, 'Failed to upload photo');
      }
    }

    const updatedContact = await patchContactById(contactId, updateData, req.user._id);
    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: "Successfully patched a contact!",
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await deleteContactById(contactId, req.user._id);
    if (!deletedContact) {
      throw createError(404, 'Contact not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
