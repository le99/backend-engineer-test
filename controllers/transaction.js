
const db = require('../db/postgresql');
const _ = require('underscore');
const pg = require('pg');
const { PAGE_SIZE } = require('../constants');
const yup = require('yup');
const validator = require('validator');


module.exports.getTxs = async function(req, res) {

  if ('page' in req.query && !_.isNumber(req.query.page)) {
    return res.status(400).json({ msg: 'bad req' });
  }

  let page = (req.query.page) ? parseInt(req.query.page, 10) : 0;

  let query = (req.query.query) ? "%" + req.query.query + "%" : "%";

  let txs = (await db.query(
    `SELECT *
      FROM transaction_audit 
      WHERE url ILIKE $1
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
}
