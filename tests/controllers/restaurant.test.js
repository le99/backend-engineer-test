require('dotenv').config()

const controller = require('../../controllers/restaurant.js');

describe("Restaurant controller getRestaurants", () => {

  test('no args should return error', async () => {
    const mReq = { query: {} }
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await controller.getRestaurants(mReq, mRes);
    expect(mRes.status).toBeCalledWith(400);
    expect(mRes.json).toBeCalledWith({ msg: "(lat,lon) or city are required" });
  });

  test('lon wihtout lat should return error', async () => {
    const mReq = { query: { lon: -74 } }
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await controller.getRestaurants(mReq, mRes);
    expect(mRes.status).toBeCalledWith(400);
    expect(mRes.json).toBeCalledWith({ msg: "(lat,lon) or city are required" });
  });

  test('lat wihtout lon should return error', async () => {
    const mReq = { query: { lat: 5 } }
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await controller.getRestaurants(mReq, mRes);
    expect(mRes.status).toBeCalledWith(400);
    expect(mRes.json).toBeCalledWith({ msg: "(lat,lon) or city are required" });
  });

})
