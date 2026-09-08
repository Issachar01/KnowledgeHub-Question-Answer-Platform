const verifyModerator = (req, res, next) => {
  if (!req.user || (req.user.role !== 'MODERATOR' && req.user.role !== 'ADMIN')) {
    return res.status(403).json({
      success: false,
      message: "Access denied: Moderator or Admin role required"
    });
  }
  next();
};

module.exports = verifyModerator;