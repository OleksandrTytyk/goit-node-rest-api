import User from "../models/user.js";
import bcrypt from "bcrypt";

import HttpError from "../helpers/HttpError.js";

export const register = async (req, res, next) => {
  try {
    const { email, password, subscription = "starter" } = req.body;

    const findUserByEmail = await User.findOne({ email });

    if (findUserByEmail !== null) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: passwordHash,
      subscription,
    });

    res.status(201).send({ message: `User ${user.email} created` });
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

    res
      .status(200)
      .send({ message: `User ${findUserByEmail.email} logged in` });
  } catch (error) {
    next(error);
  }
};
