const { User, hashPassword } = require("../models/user.js");

const createUser = async (email, password) => {
  // haszujemy hasło
  const hashedPassword = hashPassword(password);

  try {
    // tworzymy usera z zahaszowanym hasłem
    const user = new User({ email, password: hashedPassword });

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
  const user = await User.findByIdAndUpdate(id, token);
  console.log("id", id);
  console.log(token);
  user.token = token;
  return user;
};

/*const removeToken = async (_id) => {
  const user = await User.findOne({ _id });
  console.log("user", user);
  user.token = null;
  return user;*/

//const userToDeleteToken = await User.findByIdAndUpdate(id);
//userToDeleteToken.token = null;
//console.log(userToDeleteToken);
//return userToDeleteToken;

module.exports = {
  createUser,
  getUserByEmail,
  updateTokenStatus,
  getUserById,
};
