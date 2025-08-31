export const logoutSession = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw createError(401, 'No refresh token');
  }
  await Session.deleteOne({ refreshToken });
  res.clearCookie('refreshToken');
};
export const refreshSession = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw createError(401, 'No refresh token');
  }
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createError(401, 'Invalid refresh token');
  }
  // Видаляємо стару сесію
  await Session.deleteMany({ userId: session.userId });
  // Генеруємо нові токени
  const accessToken = uuidv4();
  const newRefreshToken = uuidv4();
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  // Створюємо нову сесію
  await Session.create({
    userId: session.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
  // Записуємо новий refreshToken в cookies
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  return { accessToken };
};
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

export const loginUser = async ({ email, password }, res) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Invalid email or password');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError(401, 'Invalid email or password');
  }
  // Видаляємо стару сесію
  await Session.deleteMany({ userId: user._id });
  // Генеруємо токени
  const accessToken = uuidv4();
  const refreshToken = uuidv4();
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 хв
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 днів
  // Створюємо нову сесію
  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
  // Записуємо refreshToken в cookies
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  return { accessToken };
};
