var express = require('express');
var router = express.Router();
const { checkAuth, requiresAuthentication } = require('./checkAuthMiddleware');
const { logReq } = require('./auditMiddleware');
const restaurantController = require('../controllers/restaurant.js');

router.use(checkAuth, logReq, requiresAuthentication);

router.get('/', restaurantController.getRestaurants);

module.exports = router;
