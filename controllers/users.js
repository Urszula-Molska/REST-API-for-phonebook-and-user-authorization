const { User, hashPassword } = require("../models/user.js");
const path = require("path");
const createError = require("http-errors");
const fs = require("fs").promises;
var gravatar = require("gravatar");
const Jimp = require("jimp");
const NewStoreImage = path.join(process.cwd(), "public/avatars");

const createUser = async (email, password, filePath) => {
  const hashedPassword = hashPassword(password);

  const avatar = gravatar.profile_url(email, {
    protocol: "https",
    format: "jpg",
  });
  console.log("avatar", avatar);
  const ImgName = path.basename(avatar);
  const newFilePath = path.join(NewStoreImage, ImgName);
  console.log("newFilePath", newFilePath);

  Jimp.read(filePath, (err, pict) => {
    if (err) throw err;
    pict.resize(250, 250).quality(80).write(newFilePath);
  });

  try {
    const user = new User({
      email,
      password: hashedPassword,
      avatarURL: avatar,
    });

    user.save();
    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const getUserById = async (_id) => {
  const user = await User.findOne({ _id });
  return user;
};

const updateTokenStatus = async (id, token) => {
  const user = await User.findByIdAndUpdate(id, { token }, { new: true });
  return user;
};

module.exports = {
  createUser,
  getUserByEmail,
  updateTokenStatus,
  getUserById,
};
