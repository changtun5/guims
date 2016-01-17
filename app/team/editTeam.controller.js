(function(){
	'use strict';

	angular
		.module('guims')
		.controller('EditTeamController', EditTeamController);

	EditTeamController.$inject = ['$state','Toast', 'Sidenav', 'Account', 'Team', 'TeamMembers', '$mdDialog', 'House'];
	function EditTeamController($state, Toast, Sidenav, Account, Team, TeamMembers, $mdDialog, House){
		var self = this;
		self.teamId = $state.params.teamId;
		self.auth = Account.auth();
		if(self.auth.$getAuth() == undefined){
			$state.go('home');
		}
		self.nav = Sidenav.open();
		self.teamData = {};
		self.teamMembers = {};
		self.houses = [];

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

		teamData();
		teamMembers();
		houses();

		self.cancel = cancel;

		function teamData(){
			return Team.getAll().then(function(data){
				self.teamData = data.$getRecord(self.teamId);
				return self.teamData;
			});
		}

		function teamMembers(){
			return TeamMembers.getTeamMembers(self.teamId).then(function(data){
				//console.log(data);
				self.teamMembers = data;
				return self.teamMembers;
			});
		}

		function houses(){
			return House.getAllHouse().then(function(data){
				self.houses = data;
				return self.houses;
			});
		}

		function cancel(){
			$state.go('team');
		}
	}
}());