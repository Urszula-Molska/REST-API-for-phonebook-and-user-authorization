const express = require("express");
const { userValidationSchema } = require("../../schema.js");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { loginHandler } = require("../../auth/loginHandler");
const { auth } = require("../../auth/auth.js");

const {
  getUserByEmail,
  createUser,
  getUserById,
  removeToken,
  updateTokenStatus,
} = require("../../controllers/users.js");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const email = req.body.email;
  const ifEmailExist = await getUserByEmail(email);

  if (ifEmailExist) {
    return res.status(409).send({ message: "Email in use" });
  }

  try {
    const { email, password } = req.body;
    const user = await createUser(email, password);
    // zwracamy nowo utworzonego usera
    return res.status(201).json(user);
  } catch {
    return res.status(500).send("Something went wrong");
  }
});

router.post("/login", async (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { email, password } = req.body;
  try {
    // const token = await loginHandler(email, password);
    //return res.status(200).send(token);
    const updatedStatus = await loginHandler(email, password);
    return res.status(200).json(updatedStatus);
  } catch {
    return res.status(401).send({ message: "Email or password is wrong" });
  }
});

router.get("/logout", auth, async (req, res, next) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, jwtSecret);
    const id = decoded.id;

    const user = await getUserById(id);

    if (user) {
      const removeTokenFromUser = await updateTokenStatus(id, null);
      console.log("removeTokenFromUser", removeTokenFromUser);
      return res.status(204).json(removeTokenFromUser);
    } else {
      return res.status(401).send("Not authorized");
    }
  } catch {
    return res.status(401).send({ message: "Not authorized!!!" });
  }
});

router.get("/current", auth, async (req, res, next) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, jwtSecret);
    const id = decoded.id;

    const user = await getUserById(id);

    if (user && user.token === token) {
      return res.status(200).json(user);
    } else {
      return res.status(401).send("Not authorized");
    }
  } catch {
    return res.status(401).send({ message: "Not authorized!!!" });
  }
});

module.exports = router;
