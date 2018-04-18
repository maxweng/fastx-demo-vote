let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    coinbase_address: { type: String, unique: true, default: '' },
    balance: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    last_login: Date,
    created: Date
},{
  toJSON: {virtuals: true},
  toObject: {
      virtuals: true
    }
});

module.exports = mongoose.model('user', userSchema);