(function(){
	
	'use strict';

	angular
		.module('guims')
			.factory('PrelimScore', Score);

	Score.$inject = ['$firebaseArray', 'FirebaseUrl'];
	function Score($firebaseArray, FirebaseUrl){
		var ref = $firebaseArray(new Firebase(FirebaseUrl+'prelimScore'));
		return {
			ref: getRef,
			getSportScore: getSportScore,
			getSportLeagueScore: getSportLeagueScore,
			getGameScore: getGameScore,
			getSlot : getSlot,
			getSportTeamScore: getSportTeamScore,
			getAllTeamsInPrelim : getAllTeamsInPrelim
		}

		function getRef(){
			return ref.$loaded();
		}

		function getSportScore(s){
			return $firebaseArray(new Firebase(FirebaseUrl+'prelimScore/'+s)).$loaded();
		}

		function getSportLeagueScore(s, l){
			return $firebaseArray(new Firebase(FirebaseUrl+'prelimScore/'+s+'/'+l)).$loaded();			
		}

		function getGameScore(s,l,slot){
			return getSportLeagueScore(s,l)
				.then(function(data){
					var idx = data.$indexFor(slot);
					return data[idx];
				});
		}

		function getSlot(s,l,slot){
			return $firebaseArray(new Firebase(FirebaseUrl+'prelimScore/'+s+'/'+l+'/'+slot)).$loaded();
		}

		function getSportTeamScore(s,l,slot,id){
			return $firebaseArray(new Firebase(FirebaseUrl+'prelimScore/'+s+'/'+l+'/'+slot+'/'+id)).$loaded();
		}

		function getAllTeamsInPrelim(s,l){
			var output = [];
			return getSportLeagueScore(s,l).then(function(data){
				for(var i in data){
					if(data[i].$id != undefined){
						for(var j in data[i]){
							if(j.indexOf('$') < 0 && output.indexOf(j) < 0){
								output.push(j);
							}
						}
					}
				}
				output = output.sort();
				return output;
			});
		}
	}

}());