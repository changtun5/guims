(function(){
	'use strict';

	angular
		.module('guims')
		.controller('HouseSportStatsController', HouseSportStatsController);

	HouseSportStatsController.$inject = ['$state', 'House', 'Entrant', 'Team', 'Sport', 'Prelim', 'PrelimScore'];
	function HouseSportStatsController($state, House, Entrant, Team, Sport, Prelim, PrelimScore){
		var self = this;

		self.houseId = $state.params.houseId;
		self.sportId = $state.params.sportId;

		self.house = [];
		self.entrant = [];
		self.teams = {};
		self.sport = [];
		self.prelim = [];
		self.prelimScore = [];

		function house(){
			return House.getHouse(self.houseId).then(function(data){
				self.house = data;
				return self.house;
			});
		}

		function sport(){
			return Sport.getSport(self.sportId).then(function(data){
				self.sport = data;
				return self.sport;
			});
		}

		function entrant(){
			return Entrant.getSportEntrant(self.sportId).then(function(data){
				self.entrant = data;
				return self.entrant;
			});
		}

		function teams(arr){
			return Team.getTeamBulk(arr, true).then(function(data){
				self.teams = data;
				return self.teams;
			});
		}

		function getAllTeamsInEntrant(ent){
			var tms = [];
			for(var i in ent){
				if(ent[i].$id != undefined){
					for(var j in ent[i]){
						if(tms.indexOf(j) < 0 && j.indexOf('$') < 0){
							tms.push(j);
						}
					}
				}
			}
			return tms;
		}
	}
}());