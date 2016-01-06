(function(){
	'use strict';

	angular
		.module('guims')
		.controller('HouseStatsController', HouseStatsController);

	HouseStatsController.$inject = ['$state', 'House', 'Sport'];
	function HouseStatsController($state, House, Sport){
		var self = this;
		console.log($state.params);
		self.houseId = $state.params.houseId;
		self.house = [];
		self.sport = {};
		self.loaded = false;

		self.getHouse = getHouse;

		house().then(function(){
			sport().then(function(){
				loaded();
			});
		});

		function house(){
			return House.getHouse(self.houseId).then(function(data){
				self.house = data;
				return self.house;
			});
		}

		function sport(){
			return Sport.getSportByType(self.house.$getRecord('gender').$value, true).then(function(data){
				self.sport = data;
				return self.sport;
			});
		}

		function loaded(){
			self.loaded = true;
			return self.loaded;
		}

		function getHouse(key){
			return (self.loaded && self.house.length > 0)? self.house.$getRecord(key).$value : '';
		}
	}
}());