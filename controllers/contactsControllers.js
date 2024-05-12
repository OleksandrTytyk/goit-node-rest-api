import HttpError from "../helpers/HttpError.js";
import formatPhoneNumber from "../helpers/formatPhoneNumber.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
};
export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      throw new HttpError(404, "Contact not found");
    } else {
      res.status(200).json(contact);
    }
  } catch (error) {
    next(error); // Передаем ошибку следующему middleware
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await removeContact(id);
    if (!contact) {
      throw new HttpError(404, "Contact not found");
    } else {
      res.status(200).json(contact);
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const { name, email, phone } = req.body;

    const formattedPhone = formatPhoneNumber(phone);

    const newContact = await addContact(name, email, formattedPhone);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const { name, email, phone } = req.body;

    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.message);
    }

    // Обновляем контакт, передавая все три поля
    const updatedContact = await updateContactById(id, req.body);

    // Проверяем, был ли найден контакт для обновления
    if (!updatedContact) {
      throw new HttpError(404, "Contact not found");
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};
