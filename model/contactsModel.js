const fs = require('fs/promises');
const path = require('path');

const contactsPath = path.join(__dirname, '/contacts.json');

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async contactId => {
  const contacts = await listContacts();
  const contact = contacts.find(({ id }) => id === Number(contactId));
  return contact;
};

const removeContact = async contactId => {
  const contacts = await listContacts();
  const contact = contacts.find(({ id }) => id === Number(contactId));
  if (!contact) return;
  const newContacts = contacts.filter(({ id }) => id !== Number(contactId));
  await fs.writeFile(
    contactsPath,
    JSON.stringify(newContacts, null, 2),
    'utf8',
  );
  return contact;
};

const addContact = async body => {
  const contacts = await listContacts();
  const maxID = contacts[contacts.length - 1].id;
  const newContact = { id: maxID + 1, ...body };
  const newContacts = [...contacts, newContact];
  await fs.writeFile(
    contactsPath,
    JSON.stringify(newContacts, null, 2),
    'utf8',
  );
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(({ id }) => id === Number(contactId));
  if (index === -1) return null;
  contacts[index] = { ...contacts[index], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf8');
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
