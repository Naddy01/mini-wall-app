//takes token from the header and check if the token is correct.
const jsonwebtoken = require("jsonwebtoken");
// use next when you need to jump throuh files and return
function auth(req, res, next) {
  const token = req.header("auth-token"); //extract token from header.if no token provided then deny saccess
  if (!token) {
    return res.status(401).send({ message: "Access denied" });
  }
  try {
    // verify using givn token and token secret
    const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
    res.user = verified;
    next(); // jumps to the next middleware
  } catch (err) {
    res.status(401).send({ message: "Invalid token" });
  }
}
module.exports = auth;
