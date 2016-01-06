(function(){

	'use strict';
	angular
		.module('guims')
		.factory('Roster', Roster);

	Roster.$inject = ['$firebaseArray', 'FirebaseUrl'];
	function Roster($firebaseArray, FirebaseUrl){
		return {
			getRef : getRef,
			getTeamRoster : getTeamRoster,
			getTeamRosterBulk : getTeamRosterBulk
		}

		function getRef(){
			return $firebaseArray(new Firebase(FirebaseUrl + 'roster')).$loaded();
		}

		function getTeamRoster(t){
			return $firebaseArray(new Firebase(FirebaseUrl + 'roster/' + t)).$loaded();
		}

		function getTeamRosterBulk(arr){
			var output = {};
			return getRef().then(function(data){
				for(var i in arr){
					output[arr[i]] = [];
					if(data.$indexFor(arr[i]) > -1){
						var r = data[data.$indexFor(arr[i])];
						for(var ii in r){
							if(ii.indexOf('$') == -1){
								output[arr[i]].push(ii);
							}
						}
					}
				}
				return output;
			});
		}
	}

}());