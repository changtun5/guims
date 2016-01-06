(function(){
	'use strict';

	angular
		.module('guims')
		.controller('HouseTeamController', HouseTeamController);

	HouseTeamController.$inject = ['$state', 'House', 'Team', 'TeamMembers'];
	function HouseTeamController($state, House, Team, TeamMembers){
		var self = this;

		self.hId = $state.params.houseId;
		self.house = [];
		self.inTeams = [];
		self.loaded = false;

		self.getHouse = getHouse;
		self.goTeamRoster = goTeamRoster;

		house().then(function(){
			getTeamsWithHouse().then(function(){
				loaded();
			});
		});

		function house(){
			return House.getHouse(self.hId)
				.then(function(data){
					//console.log(data);
					self.house = data;
					return self.house;
				});
		}

		function getTeamsWithHouse(){
			return TeamMembers.getTeamsWithHouse(self.hId)
				.then(function(data){
					// for(var i in data){
					// 	console.log(data[i]);
					// }
					return Team.getTeamBulk(data)
						.then(function(data){
							self.inTeams = data;
							return self.inTeams;
						});
				});
		}

		function loaded(){
			self.loaded = true;
			return self.loaded;
		}

		function getHouse(key){
			if(self.loaded){
				return self.house[self.house.$indexFor(key)].$value;
			}
			return '';
		}

		function goTeamRoster(teamId){
			$state.go('roster', {houseId: self.hId, teamId: teamId});
		}

	}
}());