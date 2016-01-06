(function(){

	'use strict';

	angular
		.module('guims')
		.factory('Entrant', Entrant);

	Entrant.$inject = ["$firebaseArray", "FirebaseUrl"];
	function Entrant($firebaseArray, FirebaseUrl){
		var ref = $firebaseArray(new Firebase(FirebaseUrl + 'entrant'));
		return {
			getRef: getRef,
			getEntrant: getEntrant,
			getSportEntrant : getSportEntrant
		}

		function getEntrant(sportId, l){
			return $firebaseArray(new Firebase(FirebaseUrl + 'entrant/' + sportId + '/' + l)).$loaded();
		}

		function getRef(){
			return ref;
		}

		function getSportEntrant(s){
			return $firebaseArray(new Firebase(FirebaseUrl + 'entrant/' + s)).$loaded();
		}
	}

}());