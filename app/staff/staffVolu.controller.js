(function(){
	'use strict';

	angular
		.module('guims')
		.controller('StaffVoluDialogController', StaffVoluDialogController);

	StaffVoluDialogController.$inject = ['$state', '$mdDialog', 'People', 'Staff', 'Toast', 'matchName', 'sport'];
	function StaffVoluDialogController($state, $mdDialog, People, Staff, Toast, matchName, sport){
		var self = this;
		self.sportId = $state.params.sportId;
		self.leagueId = $state.params.league;
		self.slot = $state.params.slot;
		self.matchName = matchName;
		self.sport = (self.leagueId == 'N')? sport : sport + ' ' + self.leagueId;

		self.voluPPl = {};

		self.people = [];
		self.staff = [];

		self.close = closeDialog;
		self.saveVolu = saveVolu;

		people().then(function(){
			staff().then(function(){
				voluPPl();
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

		function saveVolu(){
			var newObj = {};
			for(var i in self.voluPPl){
				if(self.voluPPl[i] == true){
					newObj[i] = true;
				}
			}
			if(Object.keys(newObj).length > 0){
				self.staff.$ref().child('volunteer').set(newObj);
				Toast.show('Volunteer Staff Saved');
			}else{
				if(self.staff.$indexFor('volunteer') > -1){
					self.staff.$remove(self.staff.$indexFor('volunteer')).then(function(){
						Toast.show('No Volunteer Staff');
					});					
				}else{
					Toast.show('No Volunteer Staff');
				}
			}
			$mdDialog.hide();
		}

		function voluPPl(){
			self.voluPPl = (self.staff && self.staff.$indexFor('volunteer') > -1)? self.staff.$getRecord('volunteer') : {};
			return self.voluPPl;
		}

		function closeDialog(){
			$mdDialog.cancel();
		}
	}
}());