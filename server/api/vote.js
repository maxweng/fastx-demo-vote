let mongoose = require("mongoose");

let Poll    = require('../models/Polls');
let User    = require('../models/User');
let config   = require('../config');

let ioOption = {
    origins: '*:*',
    'pingTimeout' : 60000,
    'allowUpgrades' : true,
    'transports': [
        'polling',
        'websocket'
    ]
};

const exec = require('child_process').exec;


module.exports = function(socket) {
	socket.on('send:vote', function(data) {
		Poll.findById(data.id, function(err, poll) {
			if(!poll)return;
			// let choice = poll.choices.id(data.choice);
			let choice = poll.choices;
			let userVoted = false;
			for(let c in choice){
				if(choice[c].user == data.coinbase_address){
					userVoted = true;
					choice[c].votes += data.gold;
				}
			}
			if(!userVoted){
				choice.push({'user':data.coinbase_address,'votes':data.gold || 0})
			}

			User.findOne({"coinbase_address":data.coinbase_address})
            .exec()
            .then(function(promiseResult){
                if(!promiseResult){
                    socket.emit('vote:'+data.id, {"detail": "not found User"});
                }else{
//                     if(promiseResult.gold < config.pollCreateGold){
//                         socket.emit('vote:'+data.id, {"detail": "user gold not enough"});
//                     }else{
//                         User.update({coinbase_address: data.coinbase_address},{'gold':promiseResult.gold-data.gold},function (err, data) {});
					poll.save(function(err, doc) {
						Poll.find({}, function(err, list){
							socket.emit('vote', list);
						})
					});  
                }
            })     
		});
	});
}
