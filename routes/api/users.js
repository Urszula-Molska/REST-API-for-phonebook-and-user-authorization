const express = require("express");
const { userValidationSchema } = require("../../schema.js");
const jwt = require("jsonwebtoken");
const { loginHandler } = require("../../auth/loginHandler");
const { auth } = require("../../auth/auth.js");
const { upload, storeImage } = require("../../config/multer.js");
const { sendEmail } = require("../../config/nodemailer.js");
const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");
const NewStoreImage = path.join(process.cwd(), "public/avatars");

const {
  getUserByEmail,
  createUser,
  getUserById,
  updateTokenStatus,
  findUserIdFromToken,
  getUserByVerificationToken,
} = require("../../controllers/users.js");

const router = express.Router();

router.post("/signup", upload.single("avatar"), async (req, res, next) => {
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
    if (req.file !== undefined) {
      const { path: temporaryName, originalname } = req.file;
      const filePath = path.join(storeImage, originalname);
      const { email, password } = req.body;
      const user = await createUser(email, password, filePath);
      await fs.rename(temporaryName, filePath);
      //weryfikacja e-mailu: wysłanie e-maila do użytkownika z linkiem do weryfikacji
      sendEmail(user.verificationToken, email);
      return res.status(201).json(user);
    } else {
      const { email, password } = req.body;
      const user = await createUser(email, password);
      //weryfikacja e-mailu: wysłanie e-maila do użytkownika z linkiem do weryfikacji
      sendEmail(user.verificationToken, email);
      return res.status(201).json(user);
    }
  } catch (err) {
    return res.status(500).send({ message: `${error}` });
  }
});

//login ma być możliwy po weryfikacji e-mailu użytkownika i gdy verify: true
router.post("/login", async (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  console.log({ email });

  try {
    if (user.verify === true) {
      const updatedStatus = await loginHandler(email, password);
      return res.status(200).json(updatedStatus);
    } else return res.status(401).send({ message: "Email not authorized" });
  } catch {
    return res.status(401).send({ message: "Email or password is wrong" });
  }
});

router.get("/verify/:verificationToken", async (req, res, next) => {
  //szukamy użytkownika z tym tokenem
  const { verificationToken } = req.params;
  console.log(req.params);
  try {
    const user = await getUserByVerificationToken(verificationToken);
    console.log({ verificationToken });
    if (!user) {
      res.status(404).json({
        message: `Not found: there is no user with ${verificationToken} verificationToken `,
      });
    } else {
      user.verificationToken = null;
      user.verify = true;
      user.save();
      res.status(200).send({ message: "Verification successful" });
    }
  } catch {
    return res.status(401).send({ message: "Not verified!!!" });
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
    const token = req.headers.authorization;

    const findUserIdFromToken = (token) => {
      const jwtSecret = process.env.JWT_SECRET;
      const decoded = jwt.verify(token, jwtSecret);
      const id = decoded.id;
      return id;
    };
    const id = findUserIdFromToken(token);

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

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      const id = findUserIdFromToken(token);
      const user = await getUserById(id);
      if (user && user.token === token) {
        const { path: temporaryName, originalname } = req.file;
        const filePath = path.join(storeImage, originalname);
        await fs.rename(temporaryName, filePath);
        const ImgName = path.basename(user.avatarURL);
        const newFilePath = path.join(NewStoreImage, ImgName);

        Jimp.read(filePath, (err, pict) => {
          if (err) throw err;
          pict.resize(250, 250).quality(80).write(newFilePath);
        });
        await fs.unlink(temporaryName);
        return res.status(200).json({ avatarURL: originalname });
      } else {
        return res.status(401).send("Not authorized");
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: `${err}` });
    }
  }
);

module.exports = router;
