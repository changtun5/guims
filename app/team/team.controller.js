(function(){
	
	'use strict';

	angular
		.module('guims')
		.controller('TeamController', TeamController);

	TeamController.$inject = ['$state','Team', 'House', 'TeamMembers', 'Sidenav', 'Account', 'Toast'];
	function TeamController($state, Team, House, TeamMembers, Sidenav, Account, Toast){
		var self = this;

		self.account = [];
		self.auth = Account.auth();
		if(self.auth.$getAuth() == undefined){
			$state.go('home');
		}
		self.nav = Sidenav.open();

		self.members = [{
			teamId : 0
		}];

		self.leagues = [
			{
				value: 'N',
				label: 'No League'
			},
			{
				value: 'A',
				label: 'A League'
			},
			{
				value: 'B',
				label: 'B League'
			},
			{
				value: 'C',
				label: 'C League'
			}
		];

		self.house = [];
		self.teams = [];

		self.gents = [];
		self.ladies = [];
		self.existingTeams = [];
		self.team = {
			name: '',
			league: 'N',
			type: -1
		};

		self.loaded = false;

		account().then(function(){
			if(getAccount('position') == 'rep'){
				$state.go('home');
			}
			house().then(function(){
				teams().then(function(){
					gents().then(function(){
						ladies().then(function(){
							existingTeams().then(function(){
								loaded();								
							});
						});
					});
				});
			});			
		});	

		self.moreMember = moreMember;
		self.lessMember = lessMember;
		self.showMemberOption = showMemberOption;
		self.add = add;
		self.checkDup = checkDup;
		self.checkTeamName = checkTeamName;
		self.getAccount = getAccount;
		self.toggleForm = toggleForm;
		self.goNewTeam = goNewTeam;
		self.goEditTeam = goEditTeam;
		self.cancel = cancel;

		function cancel(){
			$state.go('team');
		}

		function account(){
			return Account.getRef().then(function(data){
				self.account = data;
				return self.account;
			});
		}

		function goNewTeam(){
			$state.go('newTeam');
		}

		function goEditTeam(tId){
			$state.go('editTeam', {teamId: tId});
		}

		function toggleForm(){
			self.showForm = !self.showForm;
		}

		function getAccount(key){
			var a = self.auth.$getAuth();
			return (self.account.length > 0 && a)? self.account.$getRecord(a.uid)[key] : '';
		}

		function showMemberOption(id){
			var out = true;
			for(var i in self.members){
				if(self.members[i].teamId == id){
					out = false;
					break;
				}
			}
			return out;
		}

		function moreMember(){
			self.members.push({teamId : 0});
		}

		function lessMember(){
			self.members.splice(self.members.length - 1, 1);
		}

		function add(){
			if(!(self.checkTeamName(self.team.name) || self.members[0].teamId == 0) && self.auth.$getAuth() && getAccount('position') != 'rep'){
				// var teamId = self.team.name.trim().toLowerCase().replace(/ /g,'_');
				// var teamRef = Team.ref.$ref().child(teamId);
				var members = {};
				for (var i in self.members){
					if(!(self.members[i].teamId in Object.keys(members))){
						members[self.members[i].teamId] = true;
						var houseTemp = House.ref[House.ref.$indexFor(self.members[i].teamId)];
						if(houseTemp.gender != 4){
							if(self.team.type == -1){
								self.team.type = houseTemp.gender;
							}else{
								self.team.type = (self.team.type == houseTemp.gender)? self.team.type : 3;								
							}
						}else if(houseTemp.gender == 4){
							self.team.type = 4;
						}					
					}
				}
				return self.existingTeams.$add(self.team).then(function(newTeam){
					var newId = newTeam.key();
					return TeamMembers.getRef().then(function(tmData){
						tmData.$ref().child(newId).set(members);
						Toast.show(self.team.name + ' added!');				
						$state.go('team');								
					});				
				});
				// self.showForm = false;
			}else{

			}
		}

		function compare(a,b){
			if(a.name < b.name){
				return -1;
			}
			if(a.name > b.name){
				return 1;
			}
			return 0;
		}

		function checkDup(id){
			for(var i in self.members){
				if(self.members[i].teamId == id){
					return true;
				}
			}
			return false;
		}

		function checkTeamName(a){
			if(a){
				for(var i in self.teams){
					if(self.teams[i].toLowerCase().trim() == a.toLowerCase().trim()){
						return true;
					}
				}				
			}
			return false;
		}

		function house(){
			return House.getAllHouse()
				.then(function(data){
					for(var i in data){
						if(typeof(data[i]) === "object"){
							self.house.push(data[i]);
						}
					}
					return self.house;
				});
		}

		function teams(){
			return Team.getAllTeamNames()
				.then(function(data){
					self.teams = data.sort(compare);
					return self.teams;
				});
		}

		function gents(){
			return House.getGents()
				.then(function(data){
					var temp = data.sort(compare);
					for(var g in temp){
						self.gents.push(temp[g].$id);
					}
					return self.gents;
				});
		}

		function ladies(){
			return House.getLadies()
				.then(function(data){
					var temp = data.sort(compare);
					for(var l in temp){
						self.ladies.push(temp[l].$id);
					}
					return self.ladies;
				});
		}

		function existingTeams(){
			return Team.getAll()
				.then(function(data){
					self.existingTeams = data;
					return self.existingTeams;
				});
		}

		function loaded(){
			self.loaded = true;
			return self.loaded;
		}

	}
}());