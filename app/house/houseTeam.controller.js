(function(){
	'use strict';

	angular
		.module('guims')
		.controller('HouseTeamController', HouseTeamController);

	HouseTeamController.$inject = ['$state', 'House', 'Team', 'TeamMembers', 'Account', 'Sidenav'];
	function HouseTeamController($state, House, Team, TeamMembers, Account, Sidenav){
		var self = this;

		self.hId = $state.params.houseId;
		self.house = [];
		self.inTeams = [];
		self.loaded = false;

		self.nav = Sidenav.open();

		self.account = [];

		self.auth = Account.auth().$getAuth();
		if(self.auth == undefined){
			$state.go('home');
		}

		self.getHouse = getHouse;
		self.goTeamRoster = goTeamRoster;

		account().then(function(){
			house().then(function(){
				getTeamsWithHouse().then(function(){
					//console.log(getAccount('house'));
					if(getAccount('house') != self.hId && getAccount('position') == 'rep'){
						$state.go('houseTeam', {houseId : getAccount('house')});
					}					
					loaded();
				});
			});			
		});

		function account(){
			return Account.getRef().then(function(data){
				self.account = data;
				return self.account;
			});
		}

		function getAccount(key){
			return (self.account.length > 0 && self.auth != null)? self.account.$getRecord(self.auth.uid)[key] : ''; 
		}

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