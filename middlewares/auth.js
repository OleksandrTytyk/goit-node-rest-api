import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

export const authMiddleware = (req, res, next) => {
  const authorizationHeaders = req.headers.authorization;

  if (typeof authorizationHeaders !== "string") {
    return res.status(401).send({ message: "Not authorized" });
  }

  const [bearer, token] = authorizationHeaders.split(" ", 2);

  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Not authorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).send({ message: "Not authorized" });
    }

    try {
      const user = await User.findById(decode.id);

      if (user === null) {
        return next(HttpError(401, "Not authorized!"));
      }

      if (user.token !== token) {
        return next(HttpError(401, "Invalid token!"));
      }

      req.user = { id: decode.id, email: decode.email };

      next();
    } catch (error) {
      next(error);
    }
  });
};
