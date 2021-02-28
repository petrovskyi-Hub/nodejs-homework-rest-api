const express = require('express');
const router = express.Router();
const contactsController = require('../../controller/contactsController');
const validate = require('../../services/validation');

router
  .get('/', contactsController.listContacts)
  .post('/', validate.createContact, contactsController.addContact);

router
  .get('/:contactId', contactsController.getContactById)
  .delete('/:contactId', contactsController.removeContact)
  .patch(
    '/:contactId',
    validate.updateContact,
    contactsController.updateContact,
  );

module.exports = router;
