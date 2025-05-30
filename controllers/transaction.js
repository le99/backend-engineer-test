
const db = require('../db/postgresql');
const _ = require('underscore');
const { PAGE_SIZE } = require('../constants');
const fs = require('node:fs/promises');

module.exports.getTxs = async function(req, res) {

  if ('page' in req.query && !_.isNumber(req.query.page)) {
    return res.status(400).json({ msg: 'bad req' });
  }

  let page = (req.query.page) ? parseInt(req.query.page, 10) : 0;

  let url = (req.query.url) ? "%" + req.query.url + "%" : "%";


  let q = (await db.query(
    `SELECT *
      FROM transaction_audit 
      WHERE url ILIKE $1
      LIMIT $2 
      OFFSET $3`,
    [url, PAGE_SIZE + 1, page * PAGE_SIZE]));

  let txs = q.rows;
  // await fs.writeFile('./testData/txs.json', JSON.stringify(q));

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
