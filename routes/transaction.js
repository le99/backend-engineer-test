var express = require('express');
var router = express.Router();
const { checkAuth, requiresAuthentication } = require('./checkAuthMiddleware');
const { logReq } = require('./auditMiddleware');
const txsController = require('../controllers/transaction.js');


router.use(checkAuth, logReq, requiresAuthentication);

router.get('/', txsController.getTxs);

module.exports = router;
