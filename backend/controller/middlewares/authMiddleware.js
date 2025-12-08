const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const openRoutes = ["/register", "/login", "/health"];
  if (openRoutes.some((path) => req.path.includes(path))) {
    return next();
  }

  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "JWT is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ error: "Expired or invalid JWT" });
  }
};

module.exports = authMiddleware;
