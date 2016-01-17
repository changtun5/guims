(function(){
	'use strict';

	angular
		.module('guims')
		.factory('Staff', Staff);

	Staff.$inject = ['$firebaseArray', 'FirebaseUrl'];
	function Staff($firebaseArray, FirebaseUrl){
		var ref = $firebaseArray(new Firebase(FirebaseUrl+ 'staff'));
		return {
			getRef: getRef,
			getPrelimRefWithSport: getPrelimRefWithSport,
			getPrelimRefWithSportLeague: getPrelimRefWithSportLeague,
			getPrelimRefSlot: getPrelimRefSlot,
			getPrelimRefSlotPaid: getPrelimRefSlotPaid,
			getPrelimRefSlotVolun: getPrelimRefSlotVolun,
			getPrelimRefSlotScoreKeep: getPrelimRefSlotScoreKeep
		}

		function getRef(){
			return ref.$loaded();
		}

		function getPrelimRefWithSport(s){
			return $firebaseArray(new Firebase(FirebaseUrl + 'staff/prelim/' + s)).$loaded();
		}

		function getPrelimRefWithSportLeague(s,l){
			return $firebaseArray(new Firebase(FirebaseUrl + 'staff/prelim/' + s + '/' + l)).$loaded();
		}

		function getPrelimRefSlot(s,l,sl){
			return $firebaseArray(new Firebase(FirebaseUrl + 'staff/prelim/' + s + '/' + l + '/' + sl)).$loaded();
		}

		function getPrelimRefSlotPaid(s,l,sl){
			return $firebaseArray(new Firebase(FirebaseUrl + 'staff/prelim/' + s + '/' + l + '/' + sl + '/paid')).$loaded();
		}

		function getPrelimRefSlotVolun(s,l,sl){
			return $firebaseArray(new Firebase(FirebaseUrl + 'staff/prelim/' + s + '/' + l + '/' + sl + '/volunteer')).$loaded();			
		}

		function getPrelimRefSlotScoreKeep(s,l,sl){
			return $firebaseArray(new Firebase(FirebaseUrl + 'staff/prelim/' + s + '/' + l + '/' + sl + '/scorekeeper')).$loaded();			
		}		
	}	
}());