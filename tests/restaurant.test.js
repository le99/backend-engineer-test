require('dotenv').config()

const controller = require('../controllers/restaurant.js');

test('Get restaurant with no args should throw', async () => {
  try {
    await controller.getRestaurants(undefined, undefined, undefined);
    fail();
  }
  catch (err) {
    expect(err.message).toBe("(lat,lon) or city are required");
  }
});
