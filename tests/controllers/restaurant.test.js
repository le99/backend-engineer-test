require('dotenv').config()

const fs = require('node:fs/promises');
const controller = require('../../controllers/restaurant.js');
const geoapiService = require('../../services/geoapi.js');
describe("Restaurant controller getRestaurants", () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

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


  test('success', async () => {
    let cityData = JSON.parse(await fs.readFile('./testData/city.json', 'utf8'));
    let restaurants = JSON.parse(await fs.readFile('./testData/restaurants.json', 'utf8'));
    jest.spyOn(geoapiService, 'geocodeSearch').mockResolvedValueOnce(cityData);
    jest.spyOn(geoapiService, 'places').mockResolvedValueOnce(restaurants);

    const mReq = { query: { lat: 5, lon: 10 } }
    const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await controller.getRestaurants(mReq, mRes);
    expect(mRes.status).toHaveBeenCalledTimes(0);
    expect(mRes.json).toBeCalledWith(restaurants);
  });


})
