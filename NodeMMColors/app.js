
/**
 * Module dependencies.
 */

var express = require('express');
var hbs = require('express-hbs');
var http = require('http');
var path = require('path');
var less = require('less-middleware');
var app = express();

app.engine('hbs', hbs.express3({
  partialsDir: __dirname + '/views/partials',
  layoutsDir:__dirname + '/views/layouts',
  defaultLayout:__dirname + '/views/layouts/layout.hbs'
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use( express.cookieParser() );
app.use(express.session({ secret: 'blah blah blah' }));

app.use(less({
        src: __dirname + '/public',
        compress: true
    }));

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//this needs to happen before the router middleware is 'used' or before any route are configured.
var pi = require('./init-passport')(app);

//routes get configured here
var mvc = require('../mvc')(app, createServer);
app.use(app.router);

function createServer() {
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });

}
