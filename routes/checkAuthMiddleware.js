const db = require('../db/postgresql');
const _ = require('underscore');
const checkAuth = (req, res, next) => {
  if (!req.session.userInfo) {
    req.isAuthenticated = false;
  } else {
    req.isAuthenticated = true;
  }
  next();
};

const requiresAuthentication = async (req, res, next) => {
  if (!req.isAuthenticated) {
    return res.status(401).json({ msg: 'unauthenticated' });
  }
  next();
};
module.exports = { checkAuth, requiresAuthentication };
