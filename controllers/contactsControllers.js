// import HttpError from "../helpers/HttpError.js";
// import formatPhoneNumber from "../helpers/formatPhoneNumber.js";
// import {
//   createContactSchema,
//   updateContactSchema,
// } from "../schemas/contactsSchemas.js";

// import {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContactById,
// } from "../services/contactsServices.js";

// import Contact from "../models/contact.js";

export const getAllContacts = async (_, res) => {
  res.send("Get all contacts");
  // const contacts = await listContacts();

  // res.status(200).json(contacts);
};

export const getOneContact = async (req, res, next) => {
  res.send("Get one contact");
  // try {
  //   const { id } = req.params;

  //   const contact = await getContactById(id);

  //   if (!contact) {
  //     throw new HttpError(404, "Contact not found");
  //   } else {
  //     res.status(200).json(contact);
  //   }
  // } catch (error) {
  //   next(error);
  // }
};

export const deleteContact = async (req, res, next) => {
  res.send("Delete contact");
  // try {
  //   const { id } = req.params;
  //   const contact = await removeContact(id);
  //   if (!contact) {
  //     throw new HttpError(404, "Contact not found");
  //   } else {
  //     res.status(200).json(contact);
  //   }
  // } catch (error) {
  //   next(error);
  // }
};

export const createContact = async (req, res, next) => {
  res.send("Create contact");
  // try {
  //   const { error } = createContactSchema.validate(req.body);

  //   if (error) {
  //     throw HttpError(400, error.message);
  //   }

  //   const { name, email, phone } = req.body;

  //   const formattedPhone = formatPhoneNumber(phone);

  //   const newContact = await addContact(name, email, formattedPhone);

  //   res.status(201).json(newContact);
  // } catch (error) {
  //   next(error);
  // }
};

export const updateContact = async (req, res, next) => {
  res.send("Update contact");
  // try {
  //   const { id } = req.params;

  //   const { error } = updateContactSchema.validate(req.body);
  //   if (error) {
  //     throw new HttpError(400, error.message);
  //   }

  //   if (Object.keys(req.body).length === 0) {
  //     throw new HttpError(400, "Body must have at least one field");
  //   }

  //   const updatedContact = await updateContactById(id, req.body);

  //   if (!updatedContact) {
  //     throw new HttpError(404, "Contact not found");
  //   }
  //   res.json(updatedContact);
  // } catch (error) {
  //   next(error);
  // }
};
