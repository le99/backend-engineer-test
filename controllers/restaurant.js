const db = require('../db/postgresql');
const _ = require('underscore');
const pg = require('pg');
const { PAGE_SIZE } = require('../constants');
const yup = require('yup');
const validator = require('validator');
const axios = require('axios');
const fs = require('node:fs/promises');

const GEOAPI_URL_GEOCODE = "https://api.geoapify.com/v1/geocode/search";
const GEOAPI_URL = "https://api.geoapify.com/v2/places?categories=catering.restaurant"
const API_TIMEOUT = 4000;

async function getCoordsCity(city) {
  // let c = await axios.get(
  //   `${GEOAPI_URL_GEOCODE}?text=${city}&lang=en&limit=10&type=city&apiKey=${process.env.GEOAPIFY_KEY}`,
  //   { timeout: API_TIMEOUT }
  // );
  // let cityData = c.data;
  // await fs.writeFile('./testData/city.json', JSON.stringify(cityData));

  let cityData = JSON.parse(await fs.readFile('./testData/city.json', 'utf8'));

  let cityCord = cityData.features[0].properties;
  let lat = cityCord.lat;
  let lon = cityCord.lon;

  return { lat, lon };
}

module.exports.getRestaurants = async function(req, res) {

  const city = req.query.city;
  const lat = req.query.lat;
  const lon = req.query.lon;


  if (city == undefined && (lat == undefined || lon == undefined)) {
    return res.status(400).json({ msg: "(lat,lon) or city are required" });
  }

  if (city && city !== "") {
    try {
      let coords = await getCoordsCity(city);
      lat = coords.lat;
      lon = coords.lon;
    }
    catch {
      return res.status(500).json({ msg: "error" });
    }
  }

  if (lat !== undefined && lon !== undefined) {
    // let rt = await axios.get(
    //   `${GEOAPI_URL}&filter=circle:${lon},${lat},1000&bias=proximity:${lon},${lat}&limit=20&apiKey=${process.env.GEOAPIFY_KEY}`,
    //   { timeout: API_TIMEOUT }
    // );
    // restaurants = rt.data;
    // await fs.writeFile('./testData/restaurants.json', JSON.stringify(restaurants));
    let restaurants = JSON.parse(await fs.readFile('./testData/restaurants.json', 'utf8'));
    return res.json(restaurants);
  }
  else {
    return res.status(400).json({ msg: "error" });
  }

}

module.exports.func = function() {
  return 2;
};
