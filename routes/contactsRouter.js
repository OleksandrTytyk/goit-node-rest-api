import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";
const jsonParcer = express.json();

const contactsRouter = express.Router();

contactsRouter.get("/", jsonParcer, getAllContacts);

contactsRouter.get("/:id", jsonParcer, getOneContact);

contactsRouter.delete("/:id", jsonParcer, deleteContact);

contactsRouter.post("/", jsonParcer, createContact);

contactsRouter.put("/:id", jsonParcer, updateContact);

export default contactsRouter;
