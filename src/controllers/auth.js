import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser, logoutSession, refreshSession, getUserByEmail, resetUserPassword } from '../services/auth.js';
import { sendResetPasswordEmail } from '../services/email.js';
import { env } from '../utils/env.js';

export const registerController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { accessToken } = await loginUser(req.body, res);
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    await logoutSession(req, res);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const { accessToken } = await refreshSession(req, res);
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      throw createError(404, 'User not found!');
    }

    // Create JWT token with 5 minutes expiration
    const token = jwt.sign({ email }, env('JWT_SECRET'), { expiresIn: '5m' });

    // Send reset password email
    try {
      await sendResetPasswordEmail(email, token);
    } catch {
      throw createError(500, 'Failed to send the email, please try again later.');
    }

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, env('JWT_SECRET'));
    } catch {
      throw createError(401, 'Token is expired or invalid.');
    }

    const { email } = decoded;

    // Reset user password
    const user = await resetUserPassword(email, password);
    if (!user) {
      throw createError(404, 'User not found!');
    }

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
