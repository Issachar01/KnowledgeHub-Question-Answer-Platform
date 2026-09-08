const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: "Access denied: Admin role required"
    });
  }
  next();
};

module.exports = verifyAdmin;