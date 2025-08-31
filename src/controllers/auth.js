import { logoutSession } from '../services/auth.js';
export const logoutController = async (req, res, next) => {
  try {
    await logoutSession(req, res);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
import { refreshSession } from '../services/auth.js';
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
import { loginUser } from '../services/auth.js';
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
import { registerUser } from '../services/auth.js';

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
