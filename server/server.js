let express    = require('express');
let app        = require('express')();
let http       = require('http').Server(app);
let io = require('socket.io')(http);
let bodyParser = require('body-parser');
let mongoose   = require('mongoose');
let Router     = require('react-router');
let swig       = require('swig');
let path       = require('path');


let config = require('./config');
let api = require('./api');

let options = { 
    poolSize: 5,
    autoReconnect: true,
    reconnectTries: 30, 
    reconnectInterval: 5000
};
mongoose.connect(config.dataBase,options, function(err){
    if(err){
        console.log('Error: Could not connect to MongoDB.');
        console.log(JSON.stringify(err));
    }
});



app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/api/user', api.user);

app.get('/api/polls/polls', api.poll);
app.get('/api/polls/:id', api.poll);
app.post('/api/polls', api.poll);

io.on('connection', api.vote);

http.listen(config.port, function(){
  console.log('http server running on port ' + config.port);
});  