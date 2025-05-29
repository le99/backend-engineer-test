const db = require('../db/postgresql');
const _ = require('underscore');
const logReq = async (req, res, next) => {
  let userId = null;

  if (req.session && req.session.userInfo) {
    userId = req.session.userInfo.sub;
  }

  await db.query(`
    INSERT INTO transaction_audit (url, creation, user_id)
    VALUES ($1, $2, $3)
  `, [req.originalUrl, new Date(), userId]);
  next();
};

module.exports = { logReq };
