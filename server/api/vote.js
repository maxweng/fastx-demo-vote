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



module.exports = function(socket) {
	socket.on('send:vote', function(data) {
		if(data.id)
		Poll.findById(data.id, function(err, poll) {
			if(!poll)return;
			let choice = poll.choices.id(data.choice);
			let userVoted = false;
			for(let c in choice.votes){
				if(choice.votes[c].user == data.coinbase_address){
					userVoted = true;
					choice.votes[c].votes += data.gold;
				}
			}
			if(!userVoted){
				choice.votes.push({'user':data.coinbase_address,'votes':data.gold || 0})
			}

			User.findOne({"coinbase_address":data.coinbase_address})
            .exec()
            .then(function(promiseResult){
                if(!promiseResult){
                    socket.emit('vote', {"detail": "not found User"});
                }else{
                    if(promiseResult.gold < config.pollCreateGold){
                        socket.emit('vote', {"detail": "user gold not enough"});
                    }else{
                        User.update({coinbase_address: data.coinbase_address},{'gold':promiseResult.gold-config.pollCreateGold},function (err, data) {});
			      
						poll.save(function(err, doc) {
							let theDoc = { 
								name: doc.name, 
								_id: doc._id, 
								choices: doc.choices
							};
							socket.emit('vote', theDoc);
						});
                    }   
                }
            })     
		});
	});
}
