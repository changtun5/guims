(function(){
	
	'use strict';

	angular
		.module('guims')
		.controller('AddRosterDialogController', AddRosterDialogController);

	AddRosterDialogController.$inject = ['$state', 'Team', 'House', 'TeamMembers', 'People', '$mdDialog', 'thisTeam', 'thisRoster'];
	function AddRosterDialogController($state, Team, House, TeamMembers, People, $mdDialog, thisTeam, thisRoster){
		var self = this;

		self.people = [];
		self.teamMembers = [];
		self.teams = [];
		self.thisTeam = thisTeam;

		self.newMembers = {};

		teams().then(function(){
			teamMembers().then(function(){
				people().then(function(){
					newMembers();
				});
			});
		});

		self.hide = hide;
		self.cancel = cancel;
		self.add = add;
		self.inOtherRoster = inOtherRoster;
		self.getTeam = getTeam;

		function teamMembers(){
			return TeamMembers.getTeamMembers(thisTeam).then(function(data){
				for(var i in data){
					if(data[i].$id != undefined){
						self.teamMembers.push(data[i].$id);
					}
				}
				//console.log(self.teamMembers);
				return self.teamMembers;
			});
		}

		function people(){
			return House.getHouseMembersBulk(self.teamMembers).then(function(data){
				var m = data.sort();
				m = m.filter(removeRoster);
				return People.getPeopleBulk(m).then(function(data){
					self.people = data;
					return self.people;
				});
			});
		}

		function teams(){
			return Team.getAll().then(function(data){
				self.teams = data;
				return self.teams;
			});
		}

		// function getTeamWithMembers(){
		// 	return TeamMembers.getTeamsWithHouseBulk(self.teamMembers).then(function(data){
		// 		var temp = data;
		// 		if(temp.indexOf(thisTeam) > -1){
		// 			temp.splice(temp.indexOf(thisTeam), 1);
		// 		}
		// 		console.log(temp);
		// 	});
		// }

		function hide(){
			$mdDialog.hide();
		}

		function cancel(){
			$mdDialog.cancel();
		}

		function add(){
			var temp = Object.keys(self.newMembers);
			temp = temp.filter(removeFalse);
			$mdDialog.hide(temp);
		}

		function removeRoster(item){
			return thisRoster.indexOf(item) < 0;
		}

		function inOtherRoster(teamObj, cond){
			var flag = false;
			var otherTeam = '';
			for(var i in teamObj){
				if(teamObj[i] && i != thisTeam){
					flag = true;
					otherTeam = i;
					break;
				}
			}
			if(cond == 'disabled'){
				return flag;
			}else{
				return (flag)? '#' + self.teams[self.teams.$indexFor(i)].name : '';
			}
		}

		function getTeam(id, key){
			if(self.teams.$indexFor(id) > -1){
				//console.log(self.teams[self.teams.$indexFor(id)][key]);
				return self.teams[self.teams.$indexFor(id)][key];
			}
			return '';
		}

		function newMembers(){
			for(var i in self.people){
				if(self.people[i].$id != undefined){
					self.newMembers[self.people[i].$id] = false;
				}
			}
			return self.newMembers;
		}

		function removeFalse(l){
			return self.newMembers[l];
		}
	}

}());