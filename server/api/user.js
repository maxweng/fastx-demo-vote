let mongoose = require("mongoose");
let moment = require("moment");

let User = require('../models/User');
let config = require('../config');

module.exports = function(req, res, next){
    if(!req.query.coinbase_address){
        res.status(404).json({"detail": "not found coinbase_address"})
    }else{
        User.findOne({"coinbase_address":req.query.coinbase_address})
        .exec()
        .then(function(promiseResult){
            if(!promiseResult){
                let params = {};
                params['coinbase_address'] =  req.query.coinbase_address;
                params['gold'] =  0;
                params['last_login'] =  moment();
                params['created'] =  moment();
                User.create(params, function(err, promiseResult){
                    if(err){
                        res.status(500).json({"detail": "create error :" + err});
                    }else{
                        res.send(promiseResult);
                    }
                })
            }else{
                let params = {};
                params['last_login'] =  moment();
                let diffMinutes = moment().diff(moment(promiseResult['last_login']),'minutes');
                params['gold'] =  parseFloat(diffMinutes) * config.goldPerMinute + promiseResult['gold'];

                User.update({coinbase_address: req.query.coinbase_address},params,function (err, data) {
                    if(err){
                        res.status(500).json({"detail": "something went wrong :"+err});
                    }else{
                        res.send({...JSON.parse(JSON.stringify(promiseResult)),...JSON.parse(JSON.stringify(params))});
                    }
                });  
            }
        })
    }
}
