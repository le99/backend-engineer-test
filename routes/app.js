var express = require('express');
var router = express.Router();
const db = require('../db/postgresql');
const _ = require('underscore');
const { checkAuth, hasPermissions } = require('./checkAuthMiddleware');
const pg = require('pg');
const { PAGE_SIZE } = require('../constants');
const yup = require('yup');
const validator = require('validator');


router.use(checkAuth);

router.get('/', async function(req, res) {
  const email = (req.isAuthenticated) ? req.session.userInfo.email : null;
  return res.render('index', { isAuthenticated: req.isAuthenticated, email });
});


module.exports = router;
