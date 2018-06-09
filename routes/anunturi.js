var express = require('express');
var router = express.Router();
const neo4jUtils = require('../utils/neo4jUtils');
var session = neo4jUtils.driver().session();

//****************************MONGO_DB HANDLING **************************************************************
/* GET anunturi*/
// router.get('/', getAnunturiMongoDb, renderAnunturi);
/* POST anunt nou*/
// router.post('/', addAnuntMongoDb, renderAnunturi);
// DELETE anunturi
//router.delete('/:id',deleteAnunturiMongoDb, renderAnunturi);

//GET mongoDb cercuri
function getAnunturiMongoDb(req, res, next) {
  req.db.collection('anunturi').find().toArray(function (err, results) {
    console.log(results);
    req.anunturi = results;
    return next();
  });
}

// POST MOngoDb Cercuri
function addAnuntMongoDb(req, res, next) {
  var titluAnunt = req.body.anunt_titlu;
  var mesajAnunt = req.body.anunt_mesaj;
  if (!neo4jUtils.isBlank(titluAnunt) && !neo4jUtils.isBlank(mesajAnunt)) {
    var anunt = {
      titlu: titluAnunt,
      mesaj: mesajAnunt
    }
    req.db.collection('anunturi').save(anunt, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
    });
  }
  res.redirect('/anunturi')
}

//DELETE Anunturi
function deleteAnunturiMongoDb(req, res, next) {
  var btnStergeAnung = req.body.btn_sterge_anunt;
    req.db.collection('anunturi').remove({
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('deleted from database')
      res.redirect('/anunturi');
    });
}

//****************************NEO4J HANDLING *****************************************************************
/* GET anunturi*/
router.get('/', getAnunturiNeo4j, renderAnunturi);
/* POST anunt nou*/
router.post('/', addAnunturiNeo4j, renderAnunturi);

function getAnunturiNeo4j(req, res, next) {
  session.run('MATCH(anunt:Anunt) RETURN anunt LIMIT 25')
    .then(function (result) {
      var anunturiArr = [];
      result.records.forEach(function (record) {
        var anunt = record.get('anunt');
        anunturiArr.push({
          id: anunt.identity.low,
          titlu: anunt.properties.titlu,
          mesaj: anunt.properties.mesaj
        });
        console.log(anunt);
      });
      req.anunturi = anunturiArr;
      session.close();
      return next();
    }).catch(function (error) {
      console.log(error);
      if (error || !rows.length) {
        return next(error);
      }
    });
}

function addAnunturiNeo4j(req, res, next) {
  var titlu = req.body.anunt_titlu;
  var mesaj = req.body.anunt_mesaj;
  session.run('CREATE(anunt:Anunt {titlu:{titluParam},mesaj:{mesajParam}}) RETURN anunt', {
      titluParam: titlu,
      mesajParam: mesaj
    })
    .then(function (result) {
      res.redirect('/anunturi');
      session.close();
    }).catch(function (error) {
      console.log(error);
      if (error || !rows.length) {
        return next(error);
      }
    });
}

function renderAnunturi(req, res) {
  res.render('pages/anunturi', {
    anunturi: req.anunturi
  })
}
module.exports = router;