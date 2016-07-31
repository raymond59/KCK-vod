//    A little bit of data needed to get jsfiddle to fake an ajax request
/*
var fiddleResponse = 'json=' + encodeURIComponent(angular.toJson({
    name: "Dave"
}));
var fiddleHeaders = {
    headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
};
*/
var app = angular.module('app', []);

//================================================================================================
//==================initialize carousel module after ng-repeat render finish =====================
//================================================================================================
app.directive("owlCarousel", ['$timeout',function($timeout) {
	return {
		restrict: 'E',
		transclude: false,
		link: function (scope) {
			scope.initCarousel = function(element) {
			  // provide any default options you want
			  
			  $timeout(function () {
				var defaultOptions = {
				};
				var customOptions = scope.$eval($(element).attr('data-options'));
				// combine the two options objects
				for(var key in customOptions) {
					defaultOptions[key] = customOptions[key];
				}
				// init carousel
				//$(element).owlCarousel(defaultOptions);
			  startOwl(3);
			   },50);
			  //startOwl();
	  //alert("df");
			  
			};
		}
	};
}])
.directive('owlCarouselItem', [function() {
	return {
		restrict: 'A',
		transclude: false,
		link: function(scope, element) {
		  // wait for the last item in the ng-repeat then call init
			if(scope.$last) {
				scope.initCarousel(element.parent());
			}
		}
	};
}]);


//================================================================================================
//==================Enter Key binding to carousel =====================
//================================================================================================
app.directive('enterKey', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
				//alert(attrs.enterKey);
                scope.$apply(function (){
					
                    scope.$eval(attrs.enterKey);
                });

                event.preventDefault();
            }
        });
    };
});


//================================================================================================
//==================Ajax Get movie list from demo api service=====================
//================================================================================================
app.factory('moviesService', function($http, $q) {

    //    Create a class that represents our movies service.
    function moviesService() {
    
        var self = this;
          
        //    getmovies returns a promise which when fulfilled returns the movies.
        self.getMovies = function(url) {
            
            //    Create a deferred operation.
            var deferred = $q.defer();
            
                //    Get the movies from the server.
                //$http.post('/echo/json/', fiddleResponse, fiddleHeaders)
                $http.get(url)
                
                .success(function(response) {
                
                    //self.movies = response.movies;
                    deferred.resolve(response);
					
					
                })
                .error(function(response) {
                    deferred.reject(response);
                });
            
            
            //    Now return the promise.
            return deferred.promise;
        };
    }
    
    return new moviesService();
});

//================================================================================================
//==================Ajax Post data service to retrive/update data @ mysql =====================
//================================================================================================
app.factory('PostService', function($http, $q) {

    //    Create a class that represents our viewData service.
    function PostService() {
    
        var self = this;

//'json=' + 

var dataHeaders = {
    headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
};
         
        //    getName returns a promise which when fulfilled returns the viewData.
        self.postViewData = function(url, dataResponse) {
            
            //    Create a deferred operation.
            var deferred = $q.defer();

                //    Get the viewData from the server.
				console.log(dataResponse);
                console.log(url);
				$http.post(url, dataResponse)
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(response) {
                    deferred.reject(response);
                });
            
            //    Now return the promise.
            return deferred.promise;
        };
    }
    
    return new PostService();
});

//================================================================================================
//==================Generate video player on page start=====================
//================================================================================================
app.directive('videoTemplate', function() {
  return {
    restrict: 'E',
    scope: {},
	transclude: true,
    templateUrl: 'videoPlayer.html',
	link: function (scope,element) {
		//alert(scope.$parent.selectedMovie);
      //element.find('source').attr("src", scope.$parent.selectedMovie.contents[0].url);
	  //element.find('video').load();
	  //alert("dfdfdf");
setVideoSize();
	  //$("#vodPlayer").load();
	  
	  
	  playPause();
      onWindowsSizeChange();
	  // $("#vodPlayer").get(0).play();
	}
	
  };
});


//================================================================================================
//==================Main Controller =====================
//================================================================================================
app.controller('MainController', function ($scope, moviesService, PostService, $timeout) {

    //    We have movies on the code, but it's initially empty...
    $scope.movies = "";
	$scope.viewData = "";
    $scope.showCarou = false;
	$scope.showMovie = false;
	$scope.selectedMovie = "http://dsfasf";
    
	
	//    update the movie list.
    $scope.updateMovies = function() {
		
		var url = 'https://demo2697834.mockable.io/movies';
        moviesService.getMovies(url)
            .then(
                /* success function */
                function(movies) {
                    $scope.movies = movies.entries;
					$scope.showCarou = true;
					
                },
                /* error function */
                function(result) {
                    console.log("Failed to get the movies, result is " + result); 
            });
    };
	
	//    check/get/generate current session.
	$scope.getSessionID = function(){
		var ss_id = "";
		var ssid_Obj = {};
		
		if (localStorage.getItem("ss_id")){
			ss_id = localStorage.getItem("ss_id");
			ssid_Obj.checking = true;
		}else{
			ss_id = "vod" + Date.now();
			localStorage.setItem("ss_id", ss_id);
			ssid_Obj.checking = false;
		}
		
		
		ssid_Obj.ss_id = ss_id;
		
		return ssid_Obj;
		
	};
	
	// get viewing data
    $scope.getViewData = function() {
		
		var url = '/vod/data/readPlayData.php';
		var ssid_obj = $scope.getSessionID();
		if (ssid_obj.checking){
		var dataResponse = angular.toJson({
			"ss_id": ssid_obj.ss_id
		});
		//alert(dataResponse);
		
        PostService.postViewData(url, dataResponse)
            .then(
                /* success function */
                function(viewData) {
                    $scope.viewData = viewData;
					//alert(JSON.parse(JSON.stringify($scope.viewData)));
                },
                /* error function */
                function(result) {
                    console.log("Failed to get the movies, result is " + result); 
            });
			
		}
    };
	
	$scope.updateMovies();
	
	//Save viewing data
	$scope.saveViewData = function(movie_id) {
		
		var url = '/vod/data/savePlayData.php';
		var ssid_obj = $scope.getSessionID();
		if (ssid_obj.checking){
		var dataResponse = angular.toJson({
			"ss_id": ssid_obj.ss_id,
			"movie_id": movie_id
		});
	
        PostService.postViewData(url, dataResponse)
            .then(
                /* success function */
                function(viewData) {
					//$scope.viewData = viewData;
					console.log("saved successfully"); 
                },
                /* error function */
                function(result) {
                    console.log("Failed to get the movies, result is " + result); 
            });
		}
    };
	
	//to play movie
	$scope.playMovie = function(thisMovie) {
		
		
		$scope.selectedMovie = thisMovie;
		      $(document).find('source').attr("src", $scope.selectedMovie.contents[0].url);
	  //element.find('video').load();
	  //alert("dfdfdf");
//setVideoSize();
	  $("#vodPlayer").load();
	  $("#vodPlayer").get(0).play();
		
		$scope.showMovie = true;
		$scope.showCarou = false;
		$scope.showHistory = false;
		
	};
	
	//go to home page
	$scope.setCarou = function() {
		$("#vodPlayer").get(0).pause();
		$scope.showCarou = true;
		$scope.showMovie = false;
		$scope.showHistory = false;
	};
	
	//go to history page
	$scope.setHisotry = function() {
		$("#vodPlayer").get(0).pause();
		$scope.getViewData();
		$scope.showCarou = false;
		$scope.showHistory = true;
		$scope.showMovie = false;
	};
	
	//to trigger an ng click for enter key binding purpose
	$scope.triggerClick = function () {
		//alert("df");
		//alert(angular.element(document.querySelectorAll('[position="center"]')).children().eq(0).html());
  $timeout(function() {

var el = angular.element(document.querySelectorAll('[position="center"]')).children().eq(0).find('a').eq(0);
//alert(	  angular.element(el).html());
angular.element(el).triggerHandler('click');

  }, 0);
};
	
	$scope.unavailable = "/vod/img/unavailable.jpg";
	
	});

