var app = angular.module('weatherApp', [ 'ngMaterial' ]);

app.controller('WeatherController', function($mdSidenav, $scope, $http) {
	var self = this;
	var geoPosition = "";
	$scope.tags = [];
	$scope.apiKey = '83d93afaf33ce5655b548adb305809e2';
	$scope.url = 'http://api.openweathermap.org/data/2.5/forecast/daily?';

	self.toggleSidenav = function(menuId) {
		$mdSidenav(menuId).toggle();
	};
	$scope.cityArray = [];
	$scope.cities = {};
	$scope.addCity = function(city) {
		console.log('City Name :: ' + city);
		$scope.addTab(city, '');
		$scope.loading = true;
		if (city == 'Current City') {
			$http.get(
					$scope.url + 'lat=' + geoPosition.coords.latitude + '&lon='
							+ geoPosition.coords.longitude
							+ '&mode=json&units=metric&cnt=14&APPID='
							+ $scope.apiKey).then(function(response) {
				var resp = angular.fromJson(response);
				$scope.cities[city] = resp.data;
				$scope.cityArray.push($scope.cities[city]);
				})
				.finally(function () {
				      $scope.loading = false;
				 });
			
		} else {
			$http.get(
					$scope.url + 'q=' + city
							+ '&mode=json&units=metric&cnt=14&APPID='
							+ $scope.apiKey).then(function(response) {
				var resp = angular.fromJson(response);
				$scope.cities[city] = resp.data;
				$scope.cityArray.push($scope.cities[city]);
			})
			.finally(function () {
			      $scope.loading = false;
			 });
		}
		return city;
	};

	var tabs = [], selected = null, previous = null;
	$scope.tabs = tabs;
	$scope.selectedIndex = 0;
	$scope.$watch('selectedIndex', function(current, old) {
		previous = selected;
		selected = tabs[current];
	});
	$scope.addTab = function(title, view) {
		view = view || title + " Content View";
		tabs.push({
			title : title,
			content : 'report.html',
			disabled : false
		});
	};
	$scope.removeTab = function(tab) {
		var index = tabs.indexOf(tab);
		tabs.splice(index, 1);
	};

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition, showError);
		} else {
			alert("Geolocation is not supported by this browser.");
		}
	}

	function showPosition(position) {
		geoPosition = position;
		$scope.addCity('Current City');
	}
	function showError(error) {
		switch (error.code) {
		case error.PERMISSION_DENIED:
			alert("User denied the request for Geolocation.");
			break;
		case error.POSITION_UNAVAILABLE:
			alert("Location information is unavailable.");
			break;
		case error.TIMEOUT:
			alert("The request to get user location timed out.");
			break;
		case error.UNKNOWN_ERROR:
			alert("An unknown error occurred.");
			break;
		}
	}
	getLocation();

});


