var express = require('express');
var router = express.Router();
const neo4jUtils = require('../utils/neo4jUtils');
var session = neo4jUtils.driver().session();

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
