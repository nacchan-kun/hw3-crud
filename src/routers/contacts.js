

import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { getContactsController, getContactByIdController, createContactController, deleteContactController, patchContactController } from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { uploadPhoto } from '../middlewares/upload.js';
import isValidId from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../validation/contactSchemas.js';
import authenticate from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);
router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post('/contacts', uploadPhoto, validateBody(createContactSchema), ctrlWrapper(createContactController));
router.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactController));
router.patch('/contacts/:contactId', isValidId, uploadPhoto, validateBody(updateContactSchema), ctrlWrapper(patchContactController));

export default router;
