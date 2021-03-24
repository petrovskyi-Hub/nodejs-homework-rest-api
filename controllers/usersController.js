const jwt = require('jsonwebtoken');
const Users = require('../model/usersModel');
const fs = require('fs/promises');
const path = require('path');
const Jimp = require('jimp');
const { HttpCode } = require('../services/constants');
const createFolderIsExist = require('../services/create-dir');
const { nanoid } = require('nanoid');
const EmailService = require('../services/email');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

const register = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
      return next({
        status: HttpCode.CONFLICT,
        message: 'Email in use',
      });
    }
    const verificationToken = nanoid();
    const emailService = new EmailService(process.env.NODE_ENV);
    await emailService.sendEmail(verificationToken, email, name);
    const newUser = await Users.create({
      ...req.body,
      verify: false,
      verificationToken,
    });
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatarURL: newUser.avatarURL,
        },
      },
    });
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'MongoError') {
      return next({
        status: HttpCode.BAD_REQUEST,
        message: e.message.replace(/"/g, ''),
      });
    }
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);
    if (!user || !isValidPassword || !user.verify) {
      return next({
        status: HttpCode.UNAUTHORIZED,
        message: 'Email or password is wrong',
      });
    }
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    await Users.updateToken(id, token);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
        user: {
          avatarURL: user.avatarURL,
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    if (e.name === 'TypeError') {
      return next({
        status: HttpCode.BAD_REQUEST,
        message: 'Bad request',
      });
    }
    next(e);
  }
};

const logout = async (req, res, _next) => {
  const id = req.user._id;
  await Users.updateToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const currentUser = async (req, res, next) => {
  const id = req.user._id;
  try {
    const user = await Users.findById(id);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        user: {
          avatarURL: `http://localhost:3000/images/${user.avatarURL}`,
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const updateSub = async (req, res, next) => {
  const id = req.user._id;
  try {
    await Users.updateSubUser(id, req.body.subscription);
    const user = await Users.findById(id);
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    if (e.name === 'CastError') {
      return next({
        status: HttpCode.NOT_FOUND,
        message: 'Not Found',
      });
    }
    next(e);
  }
};

const saveAvatarToStatic = async req => {
  const id = req.user._id;
  const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
  const pathFile = req.file.path;
  const newNameAvatar = `${Date.now()}-${req.file.originalname}`;
  const img = await Jimp.read(pathFile);
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);
  await createFolderIsExist(path.join(AVATARS_OF_USERS, String(id)));
  await fs.rename(
    pathFile,
    path.join(AVATARS_OF_USERS, String(id), newNameAvatar),
  );
  const avatarUrl = path.join(String(id), newNameAvatar);
  try {
    await fs.unlink(
      path.join(process.cwd(), AVATARS_OF_USERS, req.user.avatarURL),
    );
  } catch (e) {
    console.log(e.message);
  }
  return avatarUrl;
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user._id;
    const avatarUrl = await saveAvatarToStatic(req);
    await Users.updateAvatar(id, `http://localhost:3000/images/${avatarUrl}`);
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        avatarUrl: `http://localhost:3000/images/${avatarUrl}`,
      },
    });
  } catch (e) {
    next(e);
  }
};
const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerificationToken(
      req.params.verificationToken,
    );
    if (!user) {
      return next({
        status: HttpCode.BAD_REQUEST,
        data: 'Bad request',
        message: 'Link is not valid!',
      });
    }
    await Users.updateVerificationToken(user.id, true, null);
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      message: 'Verification saccessful',
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  register,
  login,
  logout,
  currentUser,
  updateSub,
  avatars,
  verify,
};
