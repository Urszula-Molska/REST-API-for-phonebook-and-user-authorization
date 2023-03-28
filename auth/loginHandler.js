const bcrypt = require("bcrypt");

const { getUserByEmail, updateTokenStatus } = require("../controllers/users");
const issueToken = require("./issueToken");

const loginHandler = async (email, incomingPassword) => {
  // pobrać uzytkownika
  const user = await getUserByEmail(email);

  // jezeli nie ma uzytkownika to zwroc informacje
  if (!user) {
    throw { code: 404, msg: "User not found!!!" };
  }

  // wziac haslo naszego uzytkownika
  const userPassword = user.password;

  // porownac hasla (przychodzace i uzytkownika)
  const result = bcrypt.compareSync(incomingPassword, userPassword);

  // zwracamy token
  if (result) {
    //zapisać token w user'rze
    const token = issueToken(user);
    const updatedUser = await updateTokenStatus(user._id.valueOf(), token);

    //return token;
    return updatedUser;
  } else {
    throw { code: 401, msg: "Invalid credentials" };
  }
};

module.exports = { loginHandler };
