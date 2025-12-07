import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';
import { SESSION_KEYS } from '../constans/index.js';
import { sendEmail } from '../utils/sendMail.js';
import jwt from 'jsonwebtoken';

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

  await Session.deleteOne({
    userId: user._id,
  });

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

export const refreshUserSession = async (req, res) => {
  const session = await Session.findOne({
    _id: req.cookies[SESSION_KEYS.SESSION_ID],
    refreshToken: req.cookies[SESSION_KEYS.REFRESH_TOKEN],
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSesionToken = new Date() > new Date(session.refreshTokenValidUntil);
  if (isSesionToken) {
    throw createHttpError(401, 'Session token expired');
  }

  await Session.deleteOne({
    _id: req.cookies[SESSION_KEYS.SESSION_ID],
    refreshToken: req.cookies[SESSION_KEYS.REFRESH_TOKEN],
  });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Successfully refreshed a session!',
  });
};

export const requestResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'user non found');
  }

  const resetToken = jwt.sign(
    { sub: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: '20m' },
  );

  const link = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${link}">here</a> to reset your password!</p>`,
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }

  res.status(200).json({
    message: 'Password reset email sent successfully',
  });
};


export const resetPassword = async (req, res) => {

  const { password, token } = req.body;

  let payloag;
  try {
    payloag = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createHttpError(401, " Invalid or expired token");
  }

  const user = await User.findOne({ _id: payloag.sub, email: payloag.email });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const handlePassword = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(user._id, { password: handlePassword });

  await Session.deleteMany({ userId: user._id });


  res.status(200).json({
    message: 'Password reset successfully. Please log in again'
  });
};
