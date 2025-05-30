
require('dotenv').config()

const controller = require('../../controllers/auth.js');

describe("Auth controller", () => {
  test('signedout should redirect', async () => {
    const mReq = { query: {} }
    const mRes = { redirect: jest.fn() };
    await controller.signedout(mReq, mRes);
    expect(mRes.redirect).toBeCalledWith("/");
  });
})
