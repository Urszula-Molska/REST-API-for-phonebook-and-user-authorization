const path = require("path");
const fs = require("fs").promises;
const multer = require("multer");
const storeImage = path.join(process.cwd(), "tmp");
const NewStoreImage = path.join(process.cwd(), "images");
console.log("storeImage", storeImage);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storeImage);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({
  storage: storage,
});

module.exports = { upload, storeImage };
