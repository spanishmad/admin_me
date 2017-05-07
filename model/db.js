
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/movieDb");

mongoose.connection.on("connected", function() {
	console.log("Mongoose connected successfully");
});

mongoose.connection.on("error", function() {
	console.log("ERROR: Mongoose is not connected");
});


//create schema
var movieSchema = new mongoose.Schema ({
	id : Number,
	title : String,
	description: String,
	rating: Number,
	released: Date
}, {collection: "movie"});
var Movie = mongoose.model('Movie', movieSchema);

module.exports = mongoose.model("Movie", movieSchema);

