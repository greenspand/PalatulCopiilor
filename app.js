const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const neo4j = require('neo4j-driver').v1;
const port = process.env.PORT || 5000;

//Setup View Engine
app.set('view engine', 'ejs');

//Setup Logger
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

//Define routing
var router = express.Router();
var indexRouter = require('./routes/index');
var cercuriRouter = require('./routes/cercuri');
var inregistrareRouter = require('./routes/inregistrare');
var anunturiRouter = require('./routes/anunturi');

//Setup routes
app.use('/', indexRouter);
app.use('/cercuri', cercuriRouter);
app.use('/inregistrare', inregistrareRouter);
app.use('/anunturi', anunturiRouter);

//Error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('pages/error', {
    errorMessage : err.message
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;