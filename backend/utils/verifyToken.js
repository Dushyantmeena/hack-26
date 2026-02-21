import jwt from "jsonwebtoken";
import { handleError } from "../helpers/handleError.js";

export const verifyToken = (req, res, next) => {
  // 1. Check for token in cookies
  const token = req.cookies.access_token;

  if (!token) {
    return next(handleError(401, "You are not authenticated!"));
  }

  // 2. Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(handleError(403, "Token is not valid!"));
    }
    
    // 3. Attach user info to request (so controllers can use req.user._id)
    req.user = user;
    next();
  });
};