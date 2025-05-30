var express = require('express');
var router = express.Router();
const { Issuer, generators } = require('openid-client');
const db = require('../db/postgresql');
const { checkAuth, hasPermissions } = require('./checkAuthMiddleware');
const { generateToken, getTokenFromState } = require('../csrf/csrfConfig');
const { logReq } = require('./auditMiddleware');

let openIdClient;
// Initialize OpenID Client
async function initializeClient() {
  const issuer = await Issuer.discover(process.env.AWS_COGNITO_ISSUER_DISCOVER);
  openIdClient = new issuer.Client({
    client_id: process.env.AWS_COGNITO_CLIENT_ID,
    client_secret: process.env.AWS_COGNITO_CLIENT_SECRET,
    redirect_uris: [process.env.AWS_COGNITO_CLIENT_REDIRECT_URL],
    response_types: ['code']
  });
};
initializeClient().catch(console.error);

router.get('/login', logReq, async function(req, res) {
  const nonce = generators.nonce();
  const state = generators.state();

  req.session.nonce = nonce;
  req.session.state = state;

  const authUrl = openIdClient.authorizationUrl({
    scope: 'email openid',
    state: state,
    nonce: nonce,
    lang: 'es'
  });

  res.redirect(authUrl);
});

// Helper function to get the path from the URL. Example: "http://localhost/hello" returns "/hello"
function getPathFromURL(urlString) {
  try {
    const url = new URL(urlString);
    return url.pathname;
  } catch (error) {
    console.error('Invalid URL:', error);
    return null;
  }
}

router.get('/signedin', async function(req, res) {
  try {
    const params = openIdClient.callbackParams(req);
    const tokenSet = await openIdClient.callback(
      process.env.AWS_COGNITO_CLIENT_REDIRECT_URL,
      params,
      {
        nonce: req.session.nonce,
        state: req.session.state
      }
    );

    const userInfo = await openIdClient.userinfo(tokenSet.access_token);
    const uuid = userInfo.sub;

    await db.query(`
      INSERT INTO transaction_audit (url, creation, user_id)
      VALUES ($1, $2, $3)
    `, [req.originalUrl, new Date(), uuid]);

    let q0 = await db.query('SELECT id FROM auth_user WHERE id =$1', [uuid]);
    if (q0.rows.length == 0) {
      await db.query('INSERT INTO auth_user(id, email) VALUES($1, $2)'
        , [uuid, userInfo.email]);
    }


    req.session.userInfo = userInfo;
    generateToken(req, res);
    res.redirect('/');
  } catch (err) {
    console.error('Callback error:', err);
    res.redirect('/');
  }
});



router.get('/signout', logReq, (req, res) => {
  req.session.destroy();
  const logoutUrl = `${process.env.AWS_COGNITO_DOMAIN}/logout?client_id=${process.env.AWS_COGNITO_CLIENT_ID}&logout_uri=${process.env.AWS_COGNITO_CLIENT_SIGNEDOUT_URL}`;
  res.redirect(logoutUrl);
});

router.get('/signedout', (req, res) => {
  res.redirect('/');
});


module.exports = router;
