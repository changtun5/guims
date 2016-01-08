(function(){
	
	'use strict';

	angular
		.module('guims')
		.controller('RosterController', RosterController);

	RosterController.$inject = ['$state', 'Team', 'TeamMembers', 'People', 'Roster', 'Account', 'Sidenav'];
	function RosterController($state, Team, TeamMembers, People, Roster, Account, Sidenav){
		var self = this;

		self.auth = Account.auth().$getAuth();
		if(self.auth == undefined){
			$state.go('home');
		}

		self.nav = Sidenav.open();

		self.houseId = $state.params.houseId;
		self.teamId = $state.params.teamId;
		self.account = [];
		self.allTeams = [];
		self.people = [];
		self.teamRoster = {};
		self.roster = [];
		self.showMembers = true;
		self.loaded = false;
		self.saved = false;

		account().then(function(){
			allTeams().then(function(){
				teamRoster().then(function(){
					if(getAccount('house') != self.houseId && getAccount('position') == 'rep'){
						$state.go('houseTeam',{houseId: getAccount('house')});
					}
					loaded();
				});
			});			
		});

		self.returnMinMaxSvg = returnMinMaxSvg;
		self.toggleShowMembers = toggleShowMembers;
		self.saveRoster = saveRoster;
		self.getTeam = getTeam;
		self.getPeopleInTeam = getPeopleInTeam;

		function account(){
			return Account.getRef().then(function(data){
				self.account = data;
				return self.account;
			});
		}

		function getAccount(key){
			return (self.account.length > 0 && self.auth != undefined)? self.account.$getRecord(self.auth.uid)[key] : '';
		}

		function allTeams(){
			return Team.getAll().then(function(data){
				self.allTeams = data;
				return self.allTeams;
			});
		}

		function roster(){
			return Roster.getTeamRoster(self.teamId).then(function(data){
				self.roster = data;
				//console.log(data);
				return self.roster;
			});
		}

		function people(){
			return People.getPeopleByHouse(self.houseId).then(function(data){
				self.people = data;
				//console.log(data);
				return self.people;
			});
		}

		function teamRoster(){
			return people().then(function(data){
				for(var i in data){
					self.teamRoster[data[i].$id] = {
						inRos: false,
						name: data[i].name,
						disabled: false,
						inTeam: ''
					}
					for(var j in data[i].team){
						if(data[i].team[j] && j != self.teamId){
							self.teamRoster[data[i].$id].disabled = true;
							self.teamRoster[data[i].$id].inTeam = j;
							break;
						}
					}
				}
				return roster().then(function(data){
					var missedName = []; 
					for(var ii in data){
						if(data[ii].$id != undefined && data[ii]){
							saved();
							if(self.teamRoster[data[ii].$id] == undefined){
								//console.log(data[ii].$id);
								self.teamRoster[data[ii].$id] = {
									inRos: data[ii].$value
								};
								missedName.push(data[ii].$id);
							}else{
								self.teamRoster[data[ii].$id].inRos = true;
							}
						}
					}
					return People.getPeopleBulk(missedName).then(function(data){
						for(var j in data){
							self.teamRoster[data[j].$id].name = data[j].name;
						}
						return self.teamRoster;
					});
				});
			});
		}

		function getTeam(id, key){
			return (self.loaded && id.length > 0)? self.allTeams.$getRecord(id)[key] : '';
		}

		function getPeopleInTeam(obj){
			var output = '';
			for(var i in obj){
				if(obj[i]){
					output = i;
					break;
				}
			}
			return output;
		}

		function returnMinMaxSvg(){
			if(self.showMembers){
				return './icons/up.svg';
			}
			return './icons/down.svg';
		}

		function toggleShowMembers(){
			self.showMembers = !self.showMembers;
		}

		function saveRoster(){
			var temp = {};
			for(var i in self.teamRoster){
				if(self.teamRoster[i].inRos){
					temp[i] = true;
				}
			}
			return People.ref().then(function(data){
				for(var ii in temp){
					if(self.roster.$indexFor(ii) == -1){
						data.$ref().child(ii+'/team/'+self.teamId).set(true);
					}
				}
				for(var j in self.roster){
					if(self.roster[j].$id != undefined){
						if(temp[self.roster[j].$id] == undefined){
							data.$ref().child(self.roster[j].$id+'/team/'+self.teamId).set(false);							
						}
					}
				}
				//console.log(self.roster);
				return Roster.getRef().then(function(data){
					data.$ref().child(self.teamId).set(temp);
					//console.log(temp);
					$state.go('houseTeam', {houseId: self.houseId});
				});
			});
		}

		function loaded(){
			self.loaded = true;
			return self.loaded;
		}

		function unload(){
			self.loaded = false;
			return self.loaded;
		}

		function saved(){
			if(!self.saved){
				self.saved = true;
			}
			return self.saved;
		}
	}
}());