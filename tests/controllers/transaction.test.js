
require('dotenv').config()

const controller = require('../../controllers/transaction.js');

describe("Transaction controller getTxs", () => {

  test('non integer page should fail', async () => {
    const mReq = { query: { page: 'a' } }
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await controller.getTxs(mReq, mRes);
    expect(mRes.status).toBeCalledWith(400);
    expect(mRes.json).toBeCalledWith({ msg: "bad req" });
  });
})
