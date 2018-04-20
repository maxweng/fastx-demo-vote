let mongoose = require('mongoose');

let voteSchema = new mongoose.Schema({ 
	user: String,
	votes: { type: Number, default: 0 }
});

// let choiceSchema = new mongoose.Schema({ 
// 	text: String,
// 	votes: [voteSchema]
// });

let pollsSchema = new mongoose.Schema({
	name: { type: String, default: '',required: true },
	author: { type: String, default: '',required: true },
	choices: [voteSchema],
	totalVotes: { type: Number, default: 0 },
	update: Date,
    created: Date
},{
  toJSON: {virtuals: true},
  toObject: {
      virtuals: true
    }
});

module.exports = mongoose.model('polls', pollsSchema);