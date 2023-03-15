const express = require("express");
const { schemaPut, schemaPost } = require("../../schema.js");

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts.js");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const user = await getContactById(contactId);
  if (user === undefined) {
    res
      .status(404)
      .json({ message: `Not found: there is no user with ${contactId} id` });
  } else {
    res.status(200).json({ user });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = schemaPost.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(404).json({ message: `${error.message}` });
    }
    const response = await addContact(req.body);
    return res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ message: "sth went wrong!!" });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const index = await removeContact(contactId);

  if (index !== -1) {
    res.status(200).json({ message: `contact with ${contactId} id deleted` });
  } else {
    res.status(400).json({ message: "Not found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const { error } = schemaPut.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(404).json({ message: `${error.message}` });
    }

    const updatedContact = await updateContact(contactId, req.body);
    res.status(200).json(updatedContact);
  } catch (err) {
    res.status(500).json({ message: "sth went wrong!!" });
  }
});

module.exports = router;
