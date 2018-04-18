let mongoose = require('mongoose');

let choiceSchema = new mongoose.Schema({ 
	text: String,
	votes: { type: Number, default: 0 }
});

let pollsSchema = new mongoose.Schema({
	name: { type: String, default: '',required: true },
	author: { type: String, default: '',required: true },
	choices: [choiceSchema],
	update: Date,
    created: Date
},{
  toJSON: {virtuals: true},
  toObject: {
      virtuals: true
    }
});

module.exports = mongoose.model('polls', pollsSchema);