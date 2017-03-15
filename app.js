var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expander = require('unshortener');
var RateLimit = require('express-rate-limit');


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

var limiter = new RateLimit({
    windowMs: 15*60*1000, // 15 minutes
    max: 200, // limit each IP to 10 requests per windowMs
    delayMs: 0,
    message: "Too many requests, please try again in 15 mins"
});

app.post('/api/expand', limiter, function(req, res){
    // route to create and return a shortened URL given a long URL
    var shorturl = req.body.url;
    var longurl = '';

    if(shorturl && shorturl.replace(/ /g,'') != "") {
        expander.expand(shorturl,
            function (err, url) {
                // url is a url object
                longurl = url.href;

                res.send({'longUrl': url.href});
            });
    }
});


var server = app.listen(3000, function(){
    console.log('Server listening on port 3000');
});


/*

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/
module.exports = app;
