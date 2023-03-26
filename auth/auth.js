const jwt = require("jsonwebtoken");
const { getUserById } = require("../controllers/users.js");

const jwtSecret = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  // pobieramy token z nagłówka
  const token = req.headers.authorization;

  // jeśli nie ma tokenu to nie puszamy dalej - mowimy ze brak tokenu
  if (!token) {
    return res.status(401).send("No token provided");
  }

  // jesli token jest to go weryfikujemy
  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log("decoded", decoded);
    //inny zapis: const{id}=jwt.verify(token.jwtSecret)
    const id = decoded.id;
    console.log("id", id);

    //po weryfikacji tokenu należy spreawdzić czy użytkownik istnieje w systemie- inaczej jest dziura bezpieczeństwa, bo można się dostać do bazy danych znając token
    const user = await getUserById(id);
    if (user) {
      next();
    } else {
      return res.status(401).send("Not authorized");
    }

    //zad dom:
    //Jeżeli walidacja przeszła pomyślnie, otrzymaj z tokena id użytkownika.
    //Znajdź użytkownika w bazie danych po tym id.
    //Jeśli użytkownik istnieje i token pokrywa się z tym, co znajduje się w bazie,
    //zapisz jego dane w req.user i wywołaj metodę next().
  } catch {
    return res.status(401).send("Access denied");
  }
};

module.exports = { auth };
