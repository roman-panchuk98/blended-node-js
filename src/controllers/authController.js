import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';
import { SESSION_KEYS } from '../constans/index.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const hashedPass = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPass });

  res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or Password is wrong');
  }

  const isVaildPassword = await bcrypt.compare(password, user.password);
  if (!isVaildPassword) {
    throw createHttpError(401, 'Password is wrong');
  }

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);
  res.status(200).json(user);
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }
  res.clearCookie(SESSION_KEYS.SESSION_ID);
  res.clearCookie(SESSION_KEYS.ACCESS_TOKEN);
  res.clearCookie(SESSION_KEYS.REFRESH_TOKEN);

  res.status(204).send();
};
