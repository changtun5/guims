(function(){
	'use strict';

	angular
		.module('guims')
		.controller('StaffScorDialogController', StaffScorDialogController);

	StaffScorDialogController.$inject = ['$state', '$mdDialog', 'People', 'Staff', 'Toast', 'matchName', 'sport'];
	function StaffScorDialogController($state, $mdDialog, People, Staff, Toast, matchName, sport){
		var self = this;
		self.sportId = $state.params.sportId;
		self.leagueId = $state.params.league;
		self.slot = $state.params.slot;
		self.matchName = matchName;
		self.sport = (self.leagueId == 'N')? sport : sport + ' ' + self.leagueId;

		self.scorPPl = {};

		self.people = [];
		self.staff = [];

		self.close = closeDialog;
		self.saveScor = saveScor;

		people().then(function(){
			staff().then(function(){
				scorPPl();
			});
		});

		function people(){
			return People.ref().then(function(data){
				self.people = data;
				return self.people;
			});
		}

		function staff(){
			return Staff.getPrelimRefSlot(self.sportId, self.leagueId, self.slot).then(function(data){
				self.staff = data;
				return self.staff;
			});
		}

		function saveScor(){
			var newObj = {};
			for(var i in self.scorPPl){
				if(self.scorPPl[i] == true){
					newObj[i] = true;
				}
			}
			if(Object.keys(newObj).length > 0){
				self.staff.$ref().child('scorekeeper').set(newObj);
				Toast.show('Scorekeeper Staff Saved');
			}else{
				if(self.staff.$indexFor('scorekeeper') > -1){
					self.staff.$remove(self.staff.$indexFor('scorekeeper')).then(function(){
						Toast.show('No Scorekeeper Staff');
					});					
				}else{
					Toast.show('No Scorekeeper Staff');
				}
			}
			$mdDialog.hide();
		}

		function scorPPl(){
			self.scorPPl = (self.staff && self.staff.$indexFor('scorekeeper') > -1)? self.staff.$getRecord('scorekeeper') : {};
			return self.scorPPl;
		}

		function closeDialog(){
			$mdDialog.cancel();
		}
	}
}());