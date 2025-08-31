import createError from 'http-errors';
import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'No access token');
    }
    const accessToken = authHeader.split(' ')[1];
    const session = await Session.findOne({ accessToken });
    if (!session) {
      throw createError(401, 'Invalid access token');
    }
    if (session.accessTokenValidUntil < new Date()) {
      throw createError(401, 'Access token expired');
    }
    const user = await User.findById(session.userId);
    if (!user) {
      throw createError(401, 'User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
