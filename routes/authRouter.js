import express from "express";
import { login, register } from "../controllers/authControllers.js";

const jsonParcer = express.json();

const authRouter = express.Router();

authRouter.post("/register", jsonParcer, register);

authRouter.post("/login", jsonParcer, login);

export default authRouter;
