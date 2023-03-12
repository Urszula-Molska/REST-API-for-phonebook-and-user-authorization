const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
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
  req.body.name = "ula";
  req.body.email = "ula@wp.pl";
  req.body.phone = "412-125-145";
  const keys = Object.keys(req.body);
  console.log("keys", keys);
  console.log("req.body", req.body);

  /*if (!req.body.name || !req.body.email || !req.body.phone) {
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
  }*/

  if (!req.body.name || !req.body.email || !req.body.phone) {
    let messageNoName;
    let messageNoEmail;
    let messageNoPhone;

    if (!req.body.name) {
      messageNoName = { message1: "missing required name - field" };

      //res.status(400).json({ message: "missing required name - field" });
    }
    if (!req.body.email) {
      messageNoEmail = { message2: "missing required email - field" };
      // res.status(400).json({ message: "missing required email - field" });
    }
    if (!req.body.phone) {
      messageNoPhone = { message3: "missing required phone - field" };

      // res.status(400).json({ message: "missing required phone - field" });
    }
    const message = { ...messageNoName, ...messageNoEmail, ...messageNoPhone };
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
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  //req.body.name = "";
  req.body.name = "hihihi";
  // req.body.email = "updated";
  console.log("req.body", req.body);

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "missing fields" });
  } else {
    const updatedContact = await updateContact(contactId, req.body);
    return res.status(200).json(updatedContact);
  }
});

module.exports = router;
