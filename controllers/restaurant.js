const db = require('../db/postgresql');
const _ = require('underscore');
const pg = require('pg');
const { PAGE_SIZE } = require('../constants');
const yup = require('yup');
const validator = require('validator');
const axios = require('axios');
const fs = require('node:fs/promises');

const geoapiService = require('../services/geoapi.js');

async function getCoordsCity(city) {
  const cityData = await geoapiService.geocodeSearch(city);
  let cityCord = cityData.features[0].properties;
  let lat = cityCord.lat;
  let lon = cityCord.lon;

  return { lat, lon };
}

module.exports.getRestaurants = async function(req, res) {

  let city = req.query.city;
  let lat = req.query.lat;
  let lon = req.query.lon;

  if (city == undefined && (lat == undefined || lon == undefined)) {
    return res.status(400).json({ msg: "(lat,lon) or city are required" });
  }

  if (city && city !== "") {
    try {
      let coords = await getCoordsCity(city);
      lat = coords.lat;
      lon = coords.lon;
    }
    catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "error" });
    }
  }

  if (lat !== undefined && lon !== undefined) {
    let restaurants = await geoapiService.places(lat, lon);
    return res.json(restaurants);
  }
  else {
    return res.status(400).json({ msg: "error" });
  }

}

module.exports.func = function() {
  return 2;
};
