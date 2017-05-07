
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();
var path = require("path");

Movie = require("./model/db");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));


//Calls to services
router.get("/", function(req,res) {
	res.json({"error" : false, "message": "Hello World"});
});


//route will allow you to use same path for different HTTP operation
router.route("/movies")
	.get(function(req,res) {
		var response = {};
		Movie.find(function(err, data) {
			//Mongo command to fetch all data from collection.
			if(err) {
				response = {"error": true, "message": "Error fetching data"};
			} else {
				response = {"error": false, "message": data};
			}
			res.json(response);
		});
	})
	.post(function(req,res) {
		
		var result = {};
		console.log('Adding movie: ' + JSON.stringify(req.body));
		var movie = new Movie(req.body);
	
		movie.save(function(err) {
			//save will run insert() command of MongoDB
			//it will add new data in collection
			if(err) {
				result = {"error": true, "message": "Error adding data"};
			} else {
				result = {"error": false, "message": "Data added"};
			}
			res.json(result);
		});
	});
	
router.route("/movies/:id")
	.get(function(req,res) {
		var result = {};
		Movie.findOne({ id: req.params.id}, function(err,data) {
			//This will run Mongo Query to fetch data based on Id
			if((err) || (!data)) {
				result = {"error": true, "message": "Error fetching data"};
			} else {
				result = {"error": false, "message": data};
			}
			res.json(result);
		});
	})
	.put(function(req,res){
		var result = {};
		//first find out if record exists or not
		//it it does then update the record
		Movie.findOne({ id: req.params.id}, function(err,data) {
			if(err) {
				result = {"error": true, "message": "Error fetching data"};
				res.json(result);
			} else {
				if(!data) {
					result = {"error": true, "message": "Error finding data"};
					res.json(result);
				} else {
					
					if(req.body.title !== undefined) {
						data.title = req.body.title;
					}
					if(req.body.description !== undefined) {
						data.description = req.body.description;
					}
					if(req.body.rating !== undefined) {
						data.rating = req.body.rating;
					}
					if(req.body.released !== undefined) {
						data.released = req.body.released;
					}
					
					//save the data
					data.save(function(err) {
						if(err) {
							result = {"error": true, "message": "Error updating data"};
						} else {
							result = {"error": false, "message": "Data is updated for " + req.params.id};
						}
						res.json(result);
					});
				}
			}
		});
	})
	.delete(function(req,res) {
		
		var result = {};
		
		Movie.findOne({ id: req.params.id}, function(err,data) {
			if(err) {
				result = {"error": true, "message": "Error fetching data"};
				res.json(result);
			} else {
				if(!data) {
					result = {"error": true, "message": "Error finding data"};
					res.json(result);
				} else {
				//data exists, remove it
					data.remove(function(err) {
						if(err) {
							result = {"error": true, "message": "Error deleting data"}
						} else {
							result = {"error": false, "message": "Data associated with " + req.params.id + " is deleted"};
						}
						res.json(result);
					});
				}
			}
		})
	})


//Navigation
app.get("/index*", function(req,res) {
	res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/js/application.js", function(req,res) {
	res.sendFile(path.join(__dirname + "/js/application.js"));
});

app.use("/",router);

app.listen(3000);
console.log("Listening to Port 3000");