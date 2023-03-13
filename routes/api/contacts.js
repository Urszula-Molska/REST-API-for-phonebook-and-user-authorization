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
    req.body.name = "ula";
    req.body.email = "joi@wp.pl";
    req.body.phone = "125-125";
    const keys = Object.keys(req.body);
    console.log("keys", keys);
    console.log("req.body", req.body);

    await schemaPost.validateAsync(req.body);
    const response = await addContact(req.body);
    return res.status(201).json(response);
  } catch (err) {
    res.status(500).json(err.message);
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

  req.body.name = "hello";
  req.body.email = "akuku@wp.pl";
  req.body.phone = "125-145-478";

  console.log("req.body", req.body);

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "missing fields" });
  } else {
    try {
      await schemaPut.validateAsync(req.body);
      const updatedContact = await updateContact(contactId, req.body);
      res.status(200).json(updatedContact);
    } catch (err) {
      res.status(500).json(err.details);
    }
  }
});

module.exports = router;
