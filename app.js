var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
//var users = require('./routes/users');
var log4js = require("log4js");
console.log("__dirname",__dirname);
log4js.configure(__dirname + '/conf/log4js_conf.json');
//使用默认logger
var loginLoger = log4js.getLogger();

//session操作
var session = require('express-session');
var url = require('url');
var app = express();
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}));

app.use(function (req, res, next) {
	var user = req.session.user;
	if (!user) {
		user = req.session.user = {};
	}
	next();
})

//var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//使用log4js输出http log
app.use(log4js.connectLogger(loginLoger, { level: 'auto', format: ':method :url :status :response-time ms' }));
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		if(err.status===404){
			res.redirect("/404.html");
		}else{
			res.render('error', {
				message: err.message,
				error: err
			});
		}
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});



module.exports = app;
