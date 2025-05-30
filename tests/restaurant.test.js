require('dotenv').config()

const controller = require('../controllers/restaurant.js');

test('Get restaurant with no args should return error', async () => {
  const mReq = { query: {} }
  const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  await controller.getRestaurants(mReq, mRes);
  expect(mRes.status).toBeCalledWith(400);
  expect(mRes.json).toBeCalledWith({ msg: "(lat,lon) or city are required" });
});
