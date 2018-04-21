let mongoose = require("mongoose");
let moment = require("moment");

let Polls = require('../models/Polls');
let User = require('../models/User');
let config = require('../config');

module.exports = function(req, res, next){
    // if(req.params.id){
    //     Polls.findOne({'_id':req.params.id})
    //         .then(function(poll){
    //             if(!poll){
    //                 res.status(404).json({"detail": "not found Polls"})
    //             }else{
    //                 let totalVotes = 0;
    //                 for(c in poll.choices) {
    //                     let choice = poll.choices[c];
    //                     // for(v in choice.votes) {
    //                     //   var vote = choice.votes[v];
    //                     //   totalVotes += parseFloat(vote.votes || 0);
    //                     // }
    //                     totalVotes += parseFloat(choice.votes || 0);
    //                 }
    //                 poll.totalVotes = totalVotes;
    //                 res.send(poll);
    //             } 
    //         })
 
    // }else{
        if(req.method == "POST"){
            let reqBody = req.body,
                choices = [];//reqBody.choices.filter(function(v) { return v.text != ''; }),
                pollObj = {name: reqBody.name, choices: choices, author: reqBody.coinbase_address};
            let poll = new Polls(pollObj);
/*
            poll.save(function(err, poolPromiseResult) {
                if(err || !promiseResult) {
                  res.status(500).send(err);
                } else {
                  res.send(poolPromiseResult);
                }   
            });
*/
            User.findOne({"coinbase_address":reqBody.coinbase_address})
            .exec()
            .then(function(promiseResult){
                if(!promiseResult){
                   res.status(404).json({"detail": "not found User"})
                }else{
//                     if(promiseResult.gold < config.pollCreateGold){
//                         res.status(400).json({"detail": "user gold not enough"})
//                     }else{
                        User.update({coinbase_address: reqBody.coinbase_address},{'gold':promiseResult.gold-config.pollCreateGold},function (err, data) {});
                        poll.save(function(err, poolPromiseResult) {
                            if(err || !promiseResult) {
                              res.status(500).send(err);
                            } else {
                              res.send(poolPromiseResult);
                            }   
                        });
//                     }   
                }
            })
        }else{
            let params = {};
            let limit = req.query.limit?req.query.limit:10;
            let skip = req.query.skip?req.query.skip:0;
            let sort = {};

            Polls.find(params)
            .sort(sort)
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .exec()
            .then(function(promiseResult){
                res.send(promiseResult);
            })
        }
    //}
}
