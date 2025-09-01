import createHttpError from 'http-errors';
import mongoose from 'mongoose';

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    next(createHttpError(400, 'Invalid contact id'));
    return;
  }
  next();
};

export default isValidId;
