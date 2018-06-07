var express = require('express');
var router = express.Router();
const neo4jUtils = require('../utils/neo4jUtils');
var session = neo4jUtils.driver().session();

//****************************MONGO_DB HANDLING **************************************************************
// GET instructori si copii
router.get('/', getCercuriMongoDb, renderCercuri);
// POST instructori si copii
router.post('/', addCercMongoDb, renderCercuri);

//GET mongoDb cercuri
function getCercuriMongoDb(req, res, next) {
    req.db.collection('cercuri').find().toArray(function (err, results) {
        console.log(results);
        req.cercuri = results;
        return next();
    });
}

// POST MOngoDb Cercuri
function addCercMongoDb(req, res, next) {
    var cerc = {
        nume: req.body.cerc_nume,
        pret: req.body.cerc_pret,
        locuri: req.body.cerc_locuri,
        categorie: req.body.cerc_categorie,
        descriere: req.body.cerc_descriere
    }
    req.db.collection('cercuri').save(cerc, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/cercuri')
    })
}

//****************************NEO4J HANDLING *****************************************************************
/* GET cercuri*/
//router.get('/', getCercuriNeo4j, renderCercuri);
/* POST cerc nou*/
//router.post('/', addCercuriNeo4j, renderCercuri);

function getCercuriNeo4j(req, res, next) {
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
                console.log(cerc);
            });
            req.cercuri = cercuriArr;
            session.close();
            return next();
        }).catch(function (error) {
            console.log(error);
            if (error || !rows.length) {
                return next(error);
            }
        });
}

//Post neo4j cercuri
function addCercuriNeo4j(req, res, next) {
    var nume = req.body.cerc_nume;
    var pret = req.body.cerc_pret;
    var locuri = req.body.cerc_locuri;
    var categorie = req.body.cerc_categorie;
    session.run('CREATE(cerc:Cerc {nume:{numeParam},pret:{pretParam},locuri:{locuriParam},categorie:{categorieParam}}) RETURN cerc', {
            numeParam: nume,
            pretParam: pret,
            locuriParam: locuri,
            categorieParam: categorie
        })
        .then(function (result) {
            res.redirect('/cercuri');
            session.close();
        }).catch(function (error) {
            console.log(error);
            if (error || !rows.length) {
                return next(error);
            }
        });
}

function renderCercuri(req, res) {
    res.render('pages/cercuri', {
        cercuri: req.cercuri
    })
}
module.exports = router;