var jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // const token = authHeader.split(" ")[1];
    // console.log(process.env.SECRET_JWT_TOKEN);
    // console.log(token);
    jwt.verify(
      authHeader,
      process.env.SECRET_JWT_TOKEN,
      function (err, decoded) {
        if (err) {
          console.log(err);
          res.status(403).send({ message: "Forbidden Access" });
        } else {
          req.decoded = decoded;
          next();
        }
      }
    );
  }
  if (!authHeader) {
    res.status(401).send({ message: "Unauthorized Access" });
  }
}

module.exports = verifyJWT;
