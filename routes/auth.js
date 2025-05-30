var express = require('express');
var router = express.Router();
const { logReq } = require('./auditMiddleware');
const authController = require('../controllers/auth.js');

router.get('/login', logReq, authController.login);

router.get('/signedin', authController.signedin);

router.get('/signout', logReq, authController.signout);

router.get('/signedout', authController.signedout);

module.exports = router;
