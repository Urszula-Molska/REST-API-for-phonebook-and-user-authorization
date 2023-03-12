const logger = (req, res, next) => {
  console.log("Przychodzacy request");
  // wykonaj swoja logike

  // pusc dalej
  next();
};

module.exports = { logger };
