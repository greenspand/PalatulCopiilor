var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver').v1;
var app = express();

//View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view_engine', 'jsx');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'assets')));

const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'nemesis'));
var session = driver.session();

app.get('/', function(req, res){
   session.run('MATCH(n:Movie) RETURN n LIMIT 25')
   .then(function(result){
       result.records.forEach(function(record){console.log(record);});
   }).catch(function(error){
       console.log(error);
   });
});

app.listen(3000);

console.log('Server Started on Port 3000');

module.exports  = app;