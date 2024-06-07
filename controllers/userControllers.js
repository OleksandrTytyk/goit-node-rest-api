import * as fs from "node:fs/promises";

import path from "node:path";

import User from "../models/user.js";

import Jimp from "jimp";

import HttpError from "../helpers/HttpError.js";

export const changeAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400);
    }

    const newPath = path.resolve("public", "avatars", req.file.filename);

    await fs.rename(req.file.path, newPath);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: `/avatars/${req.file.filename}` },
      { new: true }
    );

    const image = await Jimp.read(newPath);
    await image.resize(250, 250).writeAsync(newPath);

    res.send({
      avatarURL: updatedUser.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};
