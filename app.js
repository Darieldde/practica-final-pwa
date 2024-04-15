var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');


var hbs = require('hbs');
var session = require('express-session');

var indexRouter = require('./routes/index');

var app = express();


mongoose.connect('mongodb://localhost:27017/Cart', { useNewUrlParser: true, useUnifiedTopology: true });

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// Middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Variables locales para las vistas
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

// Montaje de rutas
app.use('/', indexRouter);

// Manejo de errores 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Manejo de errores
app.use(function(err, req, res, next) {
  // Configuración de variables locales
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderizado de la página de error
  res.status(err.status || 500);
  res.render('error');
});

// Escucha en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
