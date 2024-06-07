import User from "../models/user.js";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import gravatar from "gravatar";

export const register = async (req, res, next) => {
  try {
    const { email, password, subscription = "starter" } = req.body;

    const findUserByEmail = await User.findOne({ email });

    if (findUserByEmail !== null) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const baseAvatar = gravatar.url(email, { protocol: "https" });

    const user = await User.create({
      email,
      password: passwordHash,
      subscription,
      avatarURL: baseAvatar,
    });

    res.status(201).send({ message: `User ${user.email} created`, user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
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
  console.log(req.user);
  res.status(200).send({
    email: user.email,
    subscription: user.subscription,
    avatarURL: user.avatarURL,
  });
};
