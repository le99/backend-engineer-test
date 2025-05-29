var express = require('express');
var router = express.Router();
const db = require('../db/postgresql');
const _ = require('underscore');
const { checkAuth, hasPermissions } = require('./checkAuthMiddleware');
const pg = require('pg');
const { PAGE_SIZE } = require('../constants');
const yup = require('yup');
const validator = require('validator');
const axios = require('axios');
const fs = require('node:fs/promises');


const GEOAPI_URL_GEOCODE = "https://api.geoapify.com/v1/geocode/search";
async function getCoordsCity(city) {
  let c = await axios.get(`${GEOAPI_URL_GEOCODE}?text=${city}&lang=en&limit=10&type=city&apiKey=${process.env.GEOAPIFY_KEY}`);
  let cityData = c.data;
  // await fs.writeFile('./testData/city.json', JSON.stringify(cityData));

  // let cityData = JSON.parse(await fs.readFile('./testData/city.json', 'utf8'));

  let cityCord = cityData.features[0].properties;
  let lat = cityCord.lat;
  let lon = cityCord.lon;

  return { lat, lon };
}


const GEOAPI_URL = "https://api.geoapify.com/v2/places?categories=catering.restaurant"
router.get('/', async function(req, res) {
  let lat = req.query.lat;
  let lon = req.query.lon;
  const city = req.query.city;

  if (city == undefined && (lat == undefined || lon == undefined)) {
    return res.status(400).json({ msg: "(lat,lon) or city are required" });
  }

  let restaurants;
  if (city && city !== "") {
    let coords = await getCoordsCity(city);
    lat = coords.lat;
    lon = coords.lon;
  }

  console.log(123);
  if (lat !== undefined && lon !== undefined) {
    let rt = await axios.get(`${GEOAPI_URL}&filter=circle:${lon},${lat},1000&bias=proximity:${lon},${lat}&limit=20&apiKey=${process.env.GEOAPIFY_KEY}`);
    restaurants = rt.data;
    // await fs.writeFile('./testData/restaurants.json', JSON.stringify(restaurants));
  }
  else {
    return res.status(400).json({ msg: "error" });
  }


  // restaurants = JSON.parse(await fs.readFile('./testData/restaurants.json', 'utf8'));
  return res.json(restaurants);
});

module.exports = router;
