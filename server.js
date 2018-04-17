var express         = require('express');
var bodyParser      = require('body-parser');
var mongoose = require('mongoose');
var Router = require('react-router');
var swig  = require('swig');

var app = express();

//app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
});

app.get('/api/test', function(req, res, next) {
	res.send("hello world");
});

app.use(function(req, res, next) {
    res.status(err.status || 500);
    res.send({ message: err.message });
});

app.listen(8000, function() {
    console.log('http server running on port 8000');
});