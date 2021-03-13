const express = require('express');
const router = express.Router();
const contactsController = require('../../controllers/contactsController');
const validate = require('../../services/validation');
const guard = require('../../services/guard');

router
  .get('/', guard, contactsController.listContacts)
  .post('/', guard, validate.createContact, contactsController.addContact);

router
  .get('/:contactId', guard, contactsController.getContactById)
  .delete('/:contactId', guard, contactsController.removeContact)
  .patch(
    '/:contactId',
    guard,
    validate.updateContact,
    contactsController.updateContact,
  );

module.exports = router;
