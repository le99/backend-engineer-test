//https://www.npmjs.com/package/csrf-sync
const { csrfSync } = require("csrf-sync");

const doubleCsrfUtilities = csrfSync({
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getTokenFromState: (req) => {
    return req.session.csrfToken;
  }, // Used to retrieve the token from state.
  getTokenFromRequest: (req) =>  {
    return req.headers['x-csrf-token'];
  }, // Used to retrieve the token submitted by the request from headers
  storeTokenInState: (req, token) => {
    req.session.csrfToken = token;
  }, // Used to store the token in state.
  size: 128, // The size of the generated tokens in bits
});

module.exports = doubleCsrfUtilities;