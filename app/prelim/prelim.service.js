(function(){
	
	'use strict';

	angular
		.module('guims')
		.factory('Prelim', Prelim);

	Prelim.$inject = ['$firebaseArray','FirebaseUrl'];
	function Prelim($firebaseArray, FirebaseUrl){
		var ref = $firebaseArray(new Firebase(FirebaseUrl+'prelim'));
		return {
			ref: getRef,
			getPrelimRef: getPrelimRef,
			getPrelim : getPrelim,
			getSportPrelim : getSportPrelim,
			getPrelimSlot : getPrelimSlot,
			gamesPlayed: gamesPlayed
		}

		function getRef(){
			return ref;
		}

		function getPrelimRef(){
			return ref.$loaded();
		}

		function getPrelim(s, l){
			return $firebaseArray(new Firebase(FirebaseUrl+'prelim/'+s+'/'+l)).$loaded();
		}

		function getSportPrelim(s){
			return $firebaseArray(new Firebase(FirebaseUrl+'prelim/'+s)).$loaded();
		}

		function getPrelimSlot(s,l,slot){
			return $firebaseArray(new Firebase(FirebaseUrl+'prelim/'+s+'/'+l+'/'+slot)).$loaded();
		}

		function gamesPlayed(s,l){
			var output = false;
			return getPrelim(s,l).then(function(data){
				for(var i in data){
					if(data[i].$id != undefined){
						if(data[i].played){
							output = true;
							break;
						}
					}
				}
				return output;
			});
		}

	}

}());