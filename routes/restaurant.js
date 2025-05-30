var express = require('express');
var router = express.Router();
const db = require('../db/postgresql');
const _ = require('underscore');
const { checkAuth, requiresAuthentication } = require('./checkAuthMiddleware');
const pg = require('pg');
const { PAGE_SIZE } = require('../constants');
const yup = require('yup');
const validator = require('validator');
const axios = require('axios');
const fs = require('node:fs/promises');
const { logReq } = require('./auditMiddleware');
const controller = require('../controllers/restaurant.js');


router.use(checkAuth, logReq, requiresAuthentication);

router.get('/', async function(req, res) {
  try {
    let restaurants = await controller.getRestaurants(req.query.city, req.query.lat, req.query.lon);
    return res.json(restaurants);
  }
  catch (err) {
    return res.status(400).json({ msg: "error" });
  }

});

module.exports = router;
