const jwt = require("jsonwebtoken");

const authmiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(403).json({
      success: false,
      msg: "Unauthorized access. Token missing or invalid.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      return res.status(403).json({
        success: false,
        msg: "Unauthorized access. Invalid token.",
      });
    }
  } catch (err) {
    return res.status(403).json({
      success: false,
      msg: "Unauthorized access. Failed to authenticate token.",
    });
  }
};

module.exports = {
  authmiddleware,
};
