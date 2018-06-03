var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver').v1;
const port = process.env.PORT || 5000;
var logger = require('morgan');

var indexRouter = require('./routes/index');
var copiiRouter = require('./routes/copii');
var instructoriRouter = require('./routes/instructori');
var cercuriRouter = require('./routes/cercuri');

var app = express();

//Setup View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view_engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

//Setup neo4j driver 
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'nemesis'));
var session = driver.session();

//Setup routes
/**app.use('/', indexRouter);
app.use('/copii', copiiRouter);
app.use('/instructori', instructoriRouter);
app.use('/cercuri', cercuriRouter);*/

app.get('/', function (req, res) {
  session.run('MATCH(instructor:Instructor) RETURN instructor.nume LIMIT 25')
    .subscribe({
      onNext: function (record) {
        console.log(record.keys);
      },
      onCompleted: function () {
        session.close();
      },
      onError: function (error) {
        console.log(error);
      }
    });
  res.render('index');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;