(function(){
	
	'use strict';

	angular
		.module('guims')
			.controller('SportIdController', SportIdController);

	SportIdController.$inject = ['$state', 'Sport', 'Team', 'TeamMembers'];
	function SportIdController($state, Sport, Team, TeamMembers){
		var self = this;

		self.sport = {};


		self.gridMenu = [
			{
				label:'Prelim',
				go: goPrelim,
				bg: "#ffff8d"
			},
			{
				label:'Tournament',
				go: goTourny,
				bg: "#b9f6ca"
			}
		];

		sport();


		function sport(){
			var key = $state.params.sportId;			
			return Sport.getSport(key)
				.then(function(data){
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

		function goTourny(){

		}
	}

}());