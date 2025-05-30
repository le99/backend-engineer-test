
require('dotenv').config()

const controller = require('../../controllers/transaction.js');
const db = require('../../db/postgresql.js');
const fs = require('node:fs/promises');

describe("Transaction controller getTxs", () => {

  test('non integer page should fail', async () => {
    const mReq = { query: { page: 'a' } }
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await controller.getTxs(mReq, mRes);
    expect(mRes.status).toBeCalledWith(400);
    expect(mRes.json).toBeCalledWith({ msg: "bad req" });
  });

  test('success with pagination page 0', async () => {
    let txsData = JSON.parse(await fs.readFile('./testData/txs.json', 'utf8'));
    let txsDataCopy = JSON.parse(await fs.readFile('./testData/txs.json', 'utf8'));

    const mReq = { query: { url: "/api/transaction" } }
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    let promise = new Promise((resolve) => { resolve(txsData) });
    jest.spyOn(db, 'query').mockResolvedValueOnce(promise);

    await controller.getTxs(mReq, mRes);
    expect(mRes.status).toHaveBeenCalledTimes(0);

    let expectedData = txsDataCopy.rows;
    expectedData.pop();
    expect(mRes.json).toBeCalledWith({ data: expectedData, nextPage: 1 });
  });

  test('success with pagination page 1', async () => {
    let txsData = JSON.parse(await fs.readFile('./testData/txs.json', 'utf8'));
    let txsDataCopy = JSON.parse(await fs.readFile('./testData/txs.json', 'utf8'));

    const mReq = { query: { url: "/api/transaction", page: 1 } }
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    let promise = new Promise((resolve) => { resolve(txsData) });
    jest.spyOn(db, 'query').mockResolvedValueOnce(promise);

    await controller.getTxs(mReq, mRes);
    expect(mRes.status).toHaveBeenCalledTimes(0);

    let expectedData = txsDataCopy.rows;
    expectedData.pop();
    expect(mRes.json).toBeCalledWith({ data: expectedData, nextPage: 2, prevPage: 0 });
  });
})
