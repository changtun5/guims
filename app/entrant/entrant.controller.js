(function(){

	'use strict';

	angular
		.module('guims')
			.controller('EntrantController', EntrantController);

	EntrantController.$inject = ['$state', 'Sport', 'Team', 'Entrant', 'Prelim','PrelimScore'];
	function EntrantController($state, Sport, Team, Entrant, Prelim, PrelimScore){
		var self = this;

		self.sport = [];
		self.entrees = {};
		self.validTeams = [];
		self.prelim = [];
		self.prelimScore = [];
		self.league = $state.params.league;

		self.enteredTeams = [];

		self.allTeams = false;
		self.loaded = false;

		sport().then(function(){
			validTeams().then(function(){
				entrees().then(function(){
					prelim().then(function(){
						prelimScore().then(function(){
							enteredTeams();
							self.loaded = true;
							return self.loaded;	
						});
					});					
				});
			});
		});

		self.disableThis = disableThis;
		self.saveTeams = saveTeams;

		function entrees(){
			var sportId = $state.params.sportId;
			var league = $state.params.league;
			return Entrant.getEntrant(sportId, league)
				.then(function(data){
					for(var i in data){
						if(data[i].$id != undefined){
							self.entrees[data[i].$id] = data[i].$value;
						}
					}
					//self.entrees = data;
					return self.entrees;
				});
		}

		function sport(){
			var sportId = $state.params.sportId;
			return Sport.getSport(sportId)
				.then(function(data){
					for(var i in data){
						if(data[i].$id != undefined){
							self.sport[data[i].$id] = data[i].$value;
						}
					}
					return self.sport;
				});
		}

		function prelim(){
			var s = $state.params.sportId;
			var l = $state.params.league;
			return Prelim.getPrelim(s, l).then(function(data){
				self.prelim = data;
				return self.prelim;
			});
		}

		function validTeams(){
			var t = self.sport.type;
			var l = self.league;
			return Team.getValidTeams(t,l)
				.then(function(data){
					self.validTeams = data;
					return self.validTeams;
				});
		}

		function prelimScore(){
			var s = $state.params.sportId;
			var l = $state.params.league;			
			return PrelimScore.getAllTeamsInPrelim(s,l).then(function(data){
				self.prelimScore = data;
				//console.log(data);
				return self.prelimScore;
			});
		}

		function disableThis(tId){
			return (self.prelim.length > 0 && self.enteredTeams.indexOf(tId) > -1) && self.prelimScore.indexOf(tId) > -1;
		}

		function enteredTeams(){
			//console.log('Hello');
			self.enteredTeams = Object.keys(self.entrees);
			return self.enteredTeams;
		}

		function saveTeams(){
			var sportId = $state.params.sportId;
			var league = $state.params.league;
			var ref = Entrant.getRef().$ref().child(sportId+'/'+league);
			for(var k in self.entrees){
				if(!self.entrees[k]){
					delete self.entrees[k];
				}
			}
			ref.set(self.entrees);
			$state.go('sportId', {sportId: sportId, league: league});		
		}

	}

}());