var express = require('express');
var router = express.Router();
const neo4jUtils = require('../utils/neo4jUtils');
var session = neo4jUtils.driver().session();

// GET instructori si copii
router.get('/', getInstructoriNeo4j, getCopiiNeo4j, renderInregistrare);
// POST instructori si copii
router.post('/', addCopilSauInstructor, renderInregistrare);

//GET neo4j Instructori
function getInstructoriNeo4j(req, res, next) {
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
                console.log(instructor);
            });
            session.close();
            req.instructori = instructorArr;
            return next();
        })
        .catch(function (error) {
            console.log(error);
            if (error || !rows.length) {
                return next(error);
            }
        });
}
//GET neo4j Copii
function getCopiiNeo4j(req, res, next) {
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
                console.log(copil);
            });
            req.copii = copiiArr;
            return next();
        }).catch(function (error) {
            console.log(error);
            if (error || !rows.length) {
                return next(error);
            }
        });
}

//POST Copil sau instructor
function addCopilSauInstructor(req, res, next) {
    var tipUser = req.body.inregistrare_user_tip;
    var nume = req.body.inregistrare_user_nume;
    var adresa = req.body.inregistrare_user_adresa;
    var sex = req.body.inregistrare_user_sex;
    var varsta = req.body.inregistrare_user_varsta;
    if (!isBlank(tipUser)) {
        var createUser = "";
        if (tipUser === "copil") {
            createUser = 'CREATE(copil:Copil{nume:{numeParam},adresa:{adresaParam},sex:{sexParam},varsta:{varstaParam}}) RETURN copil'
        } else {
            createUser = 'CREATE(instructor:Instructor{nume:{numeParam},adresa:{adresaParam},sex:{sexParam},varsta:{varstaParam}}) RETURN instructor'
        }
        session.run(createUser, {
            numeParam:nume,
                adresaParam: adresa,
                sexParam: sex,
                varstaParam: varsta
            })
            .then(function (result) {
                res.redirect('/inregistrare');
                session.close();
            }).catch(function (error) {
                console.log(error);
                if (error || !rows.length) {
                    return next(error);
                }
            });
    }
}

function renderInregistrare(req, res) {
    res.render('pages/inregistrare', {
        instructori: req.instructori,
        copii: req.copii
    })
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}
module.exports = router;