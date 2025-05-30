const axios = require('axios');
const fs = require('node:fs/promises');

const GEOAPI_URL_GEOCODE = "https://api.geoapify.com/v1/geocode/search";
const GEOAPI_URL = "https://api.geoapify.com/v2/places?categories=catering.restaurant"
const API_TIMEOUT = 4000;

module.exports.geocodeSearch = async function(city) {
  let c = await axios.get(
    `${GEOAPI_URL_GEOCODE}?text=${city}&lang=en&limit=10&type=city&apiKey=${process.env.GEOAPIFY_KEY}`,
    { timeout: API_TIMEOUT }
  );
  return c.data;
  // await fs.writeFile('./testData/city.json', JSON.stringify(c.data));
  // return JSON.parse(await fs.readFile('./testData/city.json', 'utf8'));
}

module.exports.places = async function(lat, lon) {
  let rt = await axios.get(
    `${GEOAPI_URL}&filter=circle:${lon},${lat},1000&bias=proximity:${lon},${lat}&limit=20&apiKey=${process.env.GEOAPIFY_KEY}`,
    { timeout: API_TIMEOUT }
  );
  return rt.data;
  // await fs.writeFile('./testData/restaurants.json', JSON.stringify(rt.data));
  // return JSON.parse(await fs.readFile('./testData/restaurants.json', 'utf8'));
}
