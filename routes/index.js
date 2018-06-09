const express = require('express');
const neo4j = require('neo4j-driver').v1;
var router = express.Router();
const neo4jUtils = require('../utils/neo4jUtils');
var session = neo4jUtils.driver().session();

//****************************MONGO_DB HANDLING **************************************************************
//GET Mongo DB
router.get('/', getCercuriMongoDb, getInstructoriMongoDb, getCopiiMongoDb, renderPalatulCopiilorPage);

//GET mongoDb cercuri
function getCercuriMongoDb(req, res, next) {
  req.db.collection('cercuri').find().toArray(function (err, results) {
    console.log(results);
    req.cercuri = results;
    return next();
  });
}

//GET mongoDb Instructori
function getInstructoriMongoDb(req, res, next) {
  req.db.collection('instructor').find().toArray(function (err, results) {
    console.log(results);
    req.instructori = results;
    return next();
  });
}

//GET mongoDb Copii
function getCopiiMongoDb(req, res, next) {
  req.db.collection('copil').find().toArray(function (err, results) {
    console.log(results);
    req.copii = results;
    return next();
  });
}


//****************************NEO4J HANDLING *****************************************************************
/* GET neo4j */
//router.get('/', getInstructori, getCopii, getCercuri, renderPalatulCopiilorPage);

//GET neo4j Instructori
function getInstructori(req, res, next) {
  session.run('MATCH(instructor:Instructor) RETURN instructor LIMIT 25')
    .then(function (result) {
      var instructorArr = [];
      result.records.forEach(function (record) {
        var instructor = record.get('instructor');
        instructorArr.push({
          id: instructor.identity.low,
          nume: instructor.properties.nume,
          varsta: instructor.properties.varsta,
          sex: instructor.properties.sex,
          adresa: instructor.properties.adresa
        });
      });
      req.instructori = instructorArr;
      return next();
    })
    .catch(function (error) {
      if (error || !rows.length) {
        return next(error);
      }
    });
}
//GET neo4j Copii
function getCopii(req, res, next) {
  session.run('MATCH(copil:Copil) RETURN copil LIMIT 25')
    .then(function (result) {
      var copiiArr = [];
      result.records.forEach(function (record) {
        var copil = record.get('copil');
        copiiArr.push({
          id: copil.identity.low,
          nume: copil.properties.nume,
          varsta: copil.properties.varsta,
          sex: copil.properties.sex,
          adresa: copil.properties.adresa
        });
      });
      req.copii = copiiArr;
      return next();
    }).catch(function (error) {
      if (error || !rows.length) {
        return next(error);
      }
    });
}

//GET neo4j cercuri
function getCercuri(req, res, next) {
  session.run('MATCH(cerc:Cerc) RETURN cerc LIMIT 25')
    .then(function (result) {
      var cercuriArr = [];
      result.records.forEach(function (record) {
        var cerc = record.get('cerc');
        cercuriArr.push({
          id: cerc.identity.low,
          nume: cerc.properties.nume,
          pret: cerc.properties.pret,
          locuri: cerc.properties.locuri
        });
      });
      req.cercuri = cercuriArr;
      return next();
    }).catch(function (error) {
      if (error || !rows.length) {
        return next(error);
      }
    });
}

//Render all fetched on the main page
function renderPalatulCopiilorPage(req, res) {
  res.render('pages/index', {
    instructori: req.instructori,
    copii: req.copii,
    cercuri: req.cercuri
  })
}
module.exports = router;