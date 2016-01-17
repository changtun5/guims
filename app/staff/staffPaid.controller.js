(function(){
	'use strict';

	angular
		.module('guims')
		.controller('StaffPaidDialogController', StaffPaidDialogController);

	StaffPaidDialogController.$inject = ['$state', '$mdDialog', 'People', 'Staff', 'Toast', 'matchName', 'sport'];
	function StaffPaidDialogController($state, $mdDialog, People, Staff, Toast, matchName, sport){
		var self = this;
		self.sportId = $state.params.sportId;
		self.leagueId = $state.params.league;
		self.slot = $state.params.slot;
		self.matchName = matchName;
		self.sport = (self.leagueId == 'N')? sport : sport + ' ' + self.leagueId;

		self.paidPPl = {};

		self.people = [];
		self.staff = [];

		self.close = closeDialog;
		self.savePaid = savePaid;

		people().then(function(){
			staff().then(function(){
				paidPPl();
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

		function savePaid(){
			var newObj = {};
			for(var i in self.paidPPl){
				if(self.paidPPl[i] == true){
					newObj[i] = true;
				}
			}
			if(Object.keys(newObj).length > 0){
				self.staff.$ref().child('paid').set(newObj);
				Toast.show('Paid Staff Saved');
			}else{
				if(self.staff.$indexFor('paid') > -1){
					self.staff.$remove(self.staff.$indexFor('paid')).then(function(){
						Toast.show('No Paid Staff');
					});					
				}else{
					Toast.show('No Paid Staff');
				}
			}
			$mdDialog.hide();
		}

		function paidPPl(){
			self.paidPPl = (self.staff && self.staff.$indexFor('paid') > -1)? self.staff.$getRecord('paid') : {};
			return self.paidPPl;
		}

		function closeDialog(){
			$mdDialog.cancel();
		}
	}
}());