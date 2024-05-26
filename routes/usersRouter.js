import express from "express";
import { register } from "../controllers/usersControllers.js";

const jsonParcer = express.json();

const usersRouter = express.Router();

usersRouter.post("/register", jsonParcer, register);

export default usersRouter;
