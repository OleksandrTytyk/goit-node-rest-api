import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import { authMiddleware } from "../middlewares/auth.js";

const jsonParcer = express.json();

const contactsRouter = express.Router();

contactsRouter.get("/", jsonParcer, authMiddleware, getAllContacts);

contactsRouter.get("/:id", jsonParcer, authMiddleware, getOneContact);

contactsRouter.delete("/:id", jsonParcer, authMiddleware, deleteContact);

contactsRouter.post("/", jsonParcer, authMiddleware, createContact);

contactsRouter.put("/:id", jsonParcer, authMiddleware, updateContact);

contactsRouter.patch(
  "/:id/favorite",
  jsonParcer,
  authMiddleware,
  updateStatusContact
);

export default contactsRouter;
