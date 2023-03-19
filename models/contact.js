const Joi = require("joi");
const mongoose = require("mongoose");

// wyciągneliśmy schema z bilbioteki
const Schema = mongoose.Schema;

// zdefiniowalismy schema
const contacts = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

// zainicjowalismy model obiektu
const Contact = mongoose.model("contact", contacts);

module.exports = { Contact };
