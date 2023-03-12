const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
} = require("../../models/contacts.js");
const { logger } = require("../../helpers/logger");

const router = express.Router();

router.get("/", logger, async (req, res, next) => {
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
  req.body.name = "test";
  req.body.email = "ula@wp.pl";
  req.body.phone = "412-125-145";
  const keys = Object.keys(req.body);
  console.log("keys", keys);
  console.log("req.body", req.body);

  if (!req.body.name || !req.body.email || !req.body.phone) {
    const message = [];
    if (!req.body.name) {
      message.push({ message: "missing required name - field" });
      //res.status(400).json({ message: "missing required name - field" });
    }

    if (!req.body.email) {
      message.push({ message: "missing required email - field" });
      console.log(message);
      // res.status(400).json({ message: "missing required email - field" });
    }

    if (!req.body.phone) {
      message.push({ message: "missing required phone - field" });
      console.log(message);
      // res.status(400).json({ message: "missing required phone - field" });
    }
    return res.status(400).json(message);
  }

  if (req.body.name && req.body.email && req.body.phone) {
    const response = await addContact(req.body);
    return res.status(201).json(response);
  } else {
    return res.json({ message: "sth went wrong!" });
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
  res.json({ message: "template message" });
});

module.exports = router;
