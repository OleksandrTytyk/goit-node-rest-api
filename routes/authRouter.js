import express from "express";

import {
  current,
  login,
  logout,
  register,
} from "../controllers/authControllers.js";

import { authMiddleware } from "../middlewares/auth.js";

import { changeAvatar } from "../controllers/userControllers.js";
import { upload } from "../middlewares/upload.js";

const jsonParcer = express.json();

const authRouter = express.Router();

authRouter.post("/register", jsonParcer, register);

authRouter.post("/login", jsonParcer, login);

authRouter.post("/logout", jsonParcer, authMiddleware, logout);

authRouter.get("/current", jsonParcer, authMiddleware, current);

authRouter.patch(
  "/avatars",
  authMiddleware,
  upload.single("avatarURL"),
  changeAvatar
);

export default authRouter;
