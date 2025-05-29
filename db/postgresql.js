const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({connectionString: process.env.DATABASE_URL});

//https://node-postgres.com/features/transactions
async function execWithClient(cb){
    const client = await pool.connect();
    try {
        return await cb(client);
      } finally {
        client.release()
      }
}

async function close(){
    await pool.end();
}

const query = (text, params) => pool.query(text, params);

module.exports = {
    pool,
    query,
    close,
    execWithClient
};
