'use strict';

var utils = require('../utils/writer.js');
var Developers = require('../service/DevelopersService');

module.exports.searchProMedDIseaseReports = function searchProMedDIseaseReports (req, res, next) {
  var startDate = req.swagger.params['startDate'].value;
  var endDate = req.swagger.params['endDate'].value;
  var location = req.swagger.params['location'].value;
  var keyterms = req.swagger.params['keyterms'].value;
  Developers.searchProMedDIseaseReports(startDate,endDate,location,keyterms)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
