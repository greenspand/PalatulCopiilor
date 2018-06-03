var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var neo4j = require('neo4j-driver').v1;
const port = process.env.PORT || 5000;

//Define routing, currently NOT USED
/**var router = express.Router();
var indexRouter = require('./routes/index');
var copiiRouter = require('./routes/copii');
var instructoriRouter = require('./routes/instructori');
var cercuriRouter = require('./routes/cercuri');
//Setup routes
app.use('/', indexRouter);
app.use('/copii', copiiRouter);
app.use('/instructori', instructoriRouter);
app.use('/cercuri', cercuriRouter);*/

var app = express();

//Setup View Engine
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

//Setup neo4j driver 
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'nemesis'));
var session = driver.session();

app.get('/', function (req, res) {
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
      res.render('index', {
        instructori: instructorArr
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    errorMessage : err.message
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;