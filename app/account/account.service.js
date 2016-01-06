(function(){
	'use strict';

	angular
		.module('guims')
		.factory('Account', Account);

	Account.$inject = ['$firebaseAuth','$firebaseArray', 'FirebaseUrl'];
	function Account($firebaseAuth, $firebaseArray, FirebaseUrl){
		return {
			ref : ref,
			getRef: getRef,
			auth : getAuth
		};

		function ref(){
			return new Firebase(FirebaseUrl);
		}

		function getRef(){
			return $firebaseArray(new Firebase(FirebaseUrl + 'account')).$loaded();
		}

		function getAuth(){
			return $firebaseAuth(new Firebase(FirebaseUrl));
		}		
	}
}());