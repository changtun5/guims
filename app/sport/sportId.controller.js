(function(){
	
	'use strict';

	angular
		.module('guims')
			.controller('SportIdController', SportIdController);

	SportIdController.$inject = ['$state', 'Sport', 'Team', 'TeamMembers', 'Sidenav', 'Account'];
	function SportIdController($state, Sport, Team, TeamMembers, Sidenav, Account){
		var self = this;

		self.sport = {};

		self.auth = Account.auth();
		self.nav = Sidenav.open();
		self.isLoggedIn = isLoggedIn;

		self.gridMenu = [
			{
				label:'Prelim',
				go: goPrelim,
				bg: "#448aff",
				disable: false,
				cla : 'md-accent'
			},
			{
				label:'Tournament (Not Available)',
				go: goTourny,
				bg: "#80d8ff",
				disable: true,
				cla: 'md-accent'
			}
		];

		sport();


		function sport(){
			var key = $state.params.sportId;			
			return Sport.getSport(key)
				.then(function(data){
					if(!data.$getRecord('inSeason').$value){
						$state.go('sport');
					}
					self.sport.key = key;
					self.sport.ref = data;
					self.sport.league = $state.params.league;
					for(var i in data){
						var iKey = data[i].$id;
						if(data[i].$id != "league"){
							self.sport[iKey] = data[i].$value;							
						}
					}
					//console.log(self.sport.ref);
					return self.sport;
				});
		}

		function goPrelim(){
			var s = $state.params.sportId;
			var l = $state.params.league;
			$state.go('prelim',{sportId: s, league: l});
		}

		function isLoggedIn(){
			return (self.auth.$getAuth() != undefined);
		}

		function goTourny(){

		}
	}

}());