const {
    randomBytes,
  } = require('node:crypto');

  randomBytes(512/8, (err, buf) => {
    if (err) throw err;
    console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
  });