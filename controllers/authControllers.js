import User from "../models/user.js";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import gravatar from "gravatar";

import sendMail from "../mail.js";
import {
  loginSchema,
  registerSchema,
  repeatVerifySchema,
} from "../schemas/userSchema.js";

export const register = async (req, res, next) => {
  try {
    const data = req.body;

    const { error } = registerSchema.validate(data, { abortEarly: false });

    if (typeof error !== "undefined") {
      return res.status(400).send({ message: "The request is not valid" });
    }

    const { email, password, subscription = "starter" } = req.body;

    const findUserByEmail = await User.findOne({ email });

    if (findUserByEmail !== null) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomUUID();

    await sendMail.sendMail({
      to: email,
      from: "aleks.tit3@gmail.com",
      subject: "Welcome to Contact Book",
      html: `To confirm you email please click on <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm you email please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });

    const baseAvatar = gravatar.url(email, { protocol: "https" });

    const user = await User.create({
      email,
      password: passwordHash,
      subscription,
      avatarURL: baseAvatar,
      verificationToken,
      verify: false,
    });

    res.status(201).send({ message: `User ${user.email} created`, user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = req.body;

    const { error } = loginSchema.validate(data);

    if (typeof error !== "undefined") {
      return res.status(400).send({ message: "The request is not valid" });
    }

    const { email, password } = req.body;

    const findUserByEmail = await User.findOne({ email });

    if (findUserByEmail === null) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const passwordCompare = await bcrypt.compare(
      password,
      findUserByEmail.password
    );

    if (!passwordCompare) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    if (findUserByEmail.verify === false) {
      return res.status(401).send({ message: "Please verify your email" });
    }

    const token = jwt.sign(
      {
        id: findUserByEmail._id,
        email: findUserByEmail.email,
      },
      process.env.JWT_SECRET
    );

    await User.findByIdAndUpdate(findUserByEmail._id, { token }, { new: true });

    res.status(200).send({
      token,
      user: {
        email: findUserByEmail.email,
        subscription: findUserByEmail.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }, { new: true });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);
  res.status(200).send({
    email: user.email,
    subscription: user.subscription,
    avatarURL: user.avatarURL,
  });
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken: verificationToken });

    if (user === null) {
      res.status(404).send({ message: "User not found" });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const repeatVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const { error } = repeatVerifySchema.validate({ email });

    if (error) throw HttpError(400, error.message);

    const user = await User.findOne({ email });

    if (user === null) {
      throw HttpError(404);
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const verificationToken = user.verificationToken;

    await sendMail.sendMail({
      to: email,
      from: "aleks.tit3@gmail.com",
      subject: "Welcome to your Contact Book!",
      html: `To confirm you email please click on <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm you email please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });

    res.status(200).send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
