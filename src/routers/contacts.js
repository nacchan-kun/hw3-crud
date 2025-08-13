import { Router } from 'express';
import { getContactsController, getContactByIdController, createContactController, deleteContactController } from '../controllers/contacts.js';
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));
router.post('/contacts', ctrlWrapper(createContactController));
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

export default router;
