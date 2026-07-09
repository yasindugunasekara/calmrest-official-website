const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Admin access only",
    });
  }

  next();
};

module.exports = adminMiddleware;