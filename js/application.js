
var app = angular.module("myMovieList", []);

app.service("MoviesService", function ($http) {

	return {
			getAllMovies: function () {
                return $http.get("http://localhost:3000/movies");
            }
			,
            createNewMovie: function (movie) {
                return $http({
                    method: 'POST', 
					url: "http://localhost:3000/movies",
					//data: "{'id':" + movie.id + ", 'title': '" + movie.title + "', 'description': '" + movie.description + "', 'rating':" + movie.rating + ",'released': '2005-01-01T15:00:00Z'}"
					data: movie
                });
            }
			,
			getMovie: function (id) {
                return $http.get("http://localhost:3000/movies/" + id);
            }
			,
			updateMovie: function (movie) {
                 return $http({
                    method: 'PUT', 
					url: "http://localhost:3000/movies/" + movie.id,
					data: movie
                });
            }
			,
			deleteMovie: function (id) {
                return $http.delete("http://localhost:3000/movies/" + id);
            }
    };
});

app.controller("homeCtrl", ['$scope', 'MoviesService', function($scope, MoviesService) {
    
	$scope.createMovie = function(movie) {
		
		//released date is hardcoded in order to avoid datepicker
		movie.released = "2005-01-01T15:00:00Z";
		
		MoviesService.createNewMovie(movie)
			.then(function(response){
				init();
				alert("Movie has been created successfully!");
		   })
		   .catch(function(){
				alert("Error!!");
		});
	}
	
	$scope.deleteMovie = function(movie) {
		MoviesService.deleteMovie(movie.id)
			.then(function(response){
			  init();
			  alert("Movie has been deleted successfully!");
		   })
		   .catch(function(){
				alert("Error!!");
		});	
	}
	
	$scope.editMovie = function(movie) {
		MoviesService.getMovie(movie.id)
			.then(function(response){
				$scope.movie = response.data.message;
		   })
		   .catch(function(){
				alert("Error editing one movie!!");
		});
	}
	
	$scope.resetMovie = function(movie) {
		$scope.movie = null;
	}
	
	$scope.updateMovie = function(movie) {
		MoviesService.updateMovie(movie)
			.then(function(response){
			  init();
			  alert("Movie has been updated successfully!");
		   })
		   .catch(function(){
				alert("Error updating the movie!!");
		});
	}
	
	function init() {
		MoviesService.getAllMovies()
		.then(function(response){
		  //assign value
		  $scope.movies = response.data.message;
	   })
	   .catch(function(){
			alert("Error!!");
	   });
   }
   
   init();
   
}]);
