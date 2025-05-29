var express = require('express');
var router = express.Router();
const db = require('../db/postgresql');
const _ = require('underscore');
const { checkAuth, requiresAuthentication } = require('./checkAuthMiddleware');
const pg = require('pg');
const { PAGE_SIZE } = require('../constants');
const yup = require('yup');
const validator = require('validator');


router.use(checkAuth, requiresAuthentication);

router.get('/', async function(req, res) {
  let page = (req.query.page) ? parseInt(req.query.page, 10) : 0;
  let query = (req.query.query) ? "%" + req.query.query + "%" : "%";

  let txs = (await db.query(
    `SELECT id, type
      FROM transaction_audit 
      WHERE type ILIKE $1
      LIMIT $2 
      OFFSET $3`,
    [query, PAGE_SIZE + 1, page * PAGE_SIZE])).rows;

  let d = {};
  if (txs.length === PAGE_SIZE + 1) {
    d.nextPage = page + 1;
    txs.pop();
  }
  d.data = txs;
  if (page != 0) {
    d.prevPage = page - 1;
  }

  return res.json(d);
});



module.exports = router;
