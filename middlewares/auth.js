import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authorizationHeaders = req.headers.authorization;

  if (typeof authorizationHeaders !== "string") {
    return res.status(401).send({ message: "Not authorized" });
  }

  const [bearer, token] = authorizationHeaders.split(" ", 2);

  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Not authorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Not authorized" });
    }

    req.user = { id: decoded.id, email: decoded.email };

    next();
  });
};
