var express = require('express');
var router = express.Router();
const db = require('../db/postgresql');
const _ = require('underscore');
const { checkAuth, hasPermissions } = require('./checkAuthMiddleware');
const pg = require('pg');
const { PAGE_SIZE } = require('../constants');
const yup = require('yup');
const validator = require('validator');



router.get('/hello', async function(req, res) {
  return res.json({ msg: "hello" });
});

router.get('/store', async function(req, res) {
  let page = (req.query.page) ? parseInt(req.query.page, 10) : 0;
  let query = (req.query.query) ? "%" + req.query.query + "%" : "%";

  let stores = (await db.query(
    `SELECT id, name, tel 
      FROM store 
      WHERE name ILIKE $1
      LIMIT $2 
      OFFSET $3`,
    [query, PAGE_SIZE + 1, page * PAGE_SIZE])).rows;

  let d = {};
  if (stores.length === PAGE_SIZE + 1) {
    d.nextPage = page + 1;
    stores.pop();
  }
  d.data = stores;
  if (page != 0) {
    d.prevPage = page - 1;
  }

  return res.json(d);
});

router.get('/store/:id', async function(req, res) {
  const storeId = req.params.id;

  let stores = (await db.query('SELECT id, name, tel, ref_catalog, auth_user_id FROM store WHERE id = $1 LIMIT 1', [storeId])).rows;
  if (stores.length == 0) {
    return res.status(404).json({});
  }

  let store = stores[0];

  if (store.ref_ctalog) {
    return res.json({ ...store, products: [] });
  }

  let isOwner = false;
  if (req.session.userInfo) {
    isOwner = store.auth_user_id == req.session.userInfo.sub;
  }

  return res.json({ ...store, isOwner });
});


module.exports = router;
