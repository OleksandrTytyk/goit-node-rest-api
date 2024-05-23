import HttpError from "../helpers/HttpError.js";
import formatPhoneNumber from "../helpers/formatPhoneNumber.js";

import { isValidObjectId } from "mongoose";
import Contact from "../models/contact.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (_, res, next) => {
  try {
    const allContacts = await Contact.find();
    res.json(allContacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return next(HttpError(400, "Invalid contact ID"));
    }

    const contactById = await Contact.findById(id);
    if (!contactById) {
      throw HttpError(404, "Contact not found");
    } else {
      res.status(200).json(contactById);
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return next(HttpError(400, "Invalid contact ID"));
    }

    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      throw HttpError(404, "Contact not found");
    } else {
      res.status(200).json(deletedContact);
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: formatPhoneNumber(req.body.phone),
    favorite: req.body.favorite || false,
  };

  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const newContact = await Contact.create(contact);
    res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return next(HttpError(400, "Invalid contact ID"));
    }

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      favorite: req.body.favorite || false,
    };

    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }

    const updatedContact = await Contact.findByIdAndUpdate(id, contact, {
      new: true,
    });
    if (!updatedContact) {
      throw HttpError(404, "Contact not found");
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return next(HttpError(400, "Invalid contact ID"));
    }

    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { favorite } = req.body;
    const updatedStatus = await Contact.findOneAndUpdate(
      { _id: id },
      { favorite },
      { new: true }
    );
    if (!updatedStatus) {
      throw HttpError(404, "Contact not found");
    }

    res.json(updatedStatus);
  } catch (error) {
    next(error);
  }
};
