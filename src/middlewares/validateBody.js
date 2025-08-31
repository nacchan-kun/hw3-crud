import createError from 'http-errors';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(createError(400, error.details[0].message));
      return;
    }
    next();
  };
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
