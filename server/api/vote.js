let mongoose = require("mongoose");
let io              = require('socket.io')();

let Polls = require('../models/Polls');
let config = require('../config');

let ioOption = {
    origins: '*:*',
    'pingTimeout' : 60000,
    'allowUpgrades' : true,
    'transports': [
        'polling',
        'websocket'
    ]
};

let socket = io.listen(config.websocketPort,ioOption);

module.exports = function(req, res, next) {
	socket.on('send:vote', function(data) {
		Poll.findById(data.id, function(err, poll) {
			var choice = poll.choices.id(data.choice);
			choice.votes += data.gold;      
			poll.save(function(err, doc) {
				var theDoc = { 
					name: doc.name, 
					_id: doc._id, 
					choices: doc.choices, 
					totalVotes: 0 
				};
				socket.emit('myvote', theDoc);
				socket.broadcast.emit('vote', theDoc);
			});     
		});
	});
}
