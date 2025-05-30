var express = require('express');
var router = express.Router();
const db = require('../db/postgresql');
const _ = require('underscore');
const { checkAuth, requiresAuthentication } = require('./checkAuthMiddleware');
const pg = require('pg');
const { PAGE_SIZE } = require('../constants');
const yup = require('yup');
const validator = require('validator');
const { logReq } = require('./auditMiddleware');
const controller = require('../controllers/transaction.js');


router.use(checkAuth, logReq, requiresAuthentication);


router.get('/', async function(req, res) {
  let page = (req.query.page) ? parseInt(req.query.page, 10) : 0;
  let query = (req.query.query) ? "%" + req.query.query + "%" : "%";

  const txs = await controller.getTxs(page, query);
  return res.json(txs);
});



module.exports = router;
