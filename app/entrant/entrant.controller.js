(function(){

	'use strict';

	angular
		.module('guims')
			.controller('EntrantController', EntrantController);

	EntrantController.$inject = ['$state', 'Sport', 'Team', 'Entrant', 'Prelim','PrelimScore', 'Sidenav', 'Account'];
	function EntrantController($state, Sport, Team, Entrant, Prelim, PrelimScore, Sidenav, Account){
		var self = this;

		self.sport = [];
		self.entrees = {};
		self.validTeams = [];
		self.prelim = [];
		self.prelimScore = [];
		self.league = $state.params.league;
		self.nav = Sidenav.open();
		self.enteredTeams = [];

		self.allTeams = false;
		self.loaded = false;

		self.account = [];
		self.auth = Account.auth();
		if(self.auth.$getAuth == undefined){
			$state.go('home');
		}

		account().then(function(){
			if(getAccount('position') == 'rep'){
				$state.go('home');				
			}
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
		});

		self.disableThis = disableThis;
		self.saveTeams = saveTeams;
		self.getAccount = getAccount;
		self.isLoggedIn = isLoggedIn;

		function getAccount(key){
			return (self.account.length > 0 && isLoggedIn())? self.account.$getRecord(self.auth.$getAuth().uid)[key] : '';
		}

		function isLoggedIn(){
			return (self.auth.$getAuth != undefined);
		}

		function account(){
			return Account.getRef().then(function(data){
				self.account = data;
				return self.account;
			});
		}

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
			var h = ['adm', 'adv', 'dir', 'boa'];
			if(h.indexOf(getAccount('position')) > -1){
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

	}

}());