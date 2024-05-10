import * as fs from "node:fs/promises";
import path from "node:path";

const contactsPath = path.resolve("db", "contacts.json");
const contacts = await listContacts();

async function listContacts() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contact = contacts.find((contact) => contact.id === contactId);
  if (!contact) return null;
  return contact;
}

async function removeContact(contactId) {
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) return null;
  const removedContact = contacts[index];
  contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return removedContact;
}

async function addContact(name, email, phone) {
  const newContact = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

export { listContacts, getContactById, removeContact, addContact };
