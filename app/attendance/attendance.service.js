(function(){
	
	'use strict';

	angular
		.module('guims')
		.factory('Attendance', Attendance);

	Attendance.$inject = ['$firebaseArray', 'FirebaseUrl'];
	function Attendance($firebaseArray, FirebaseUrl){
		return {
			getRef: getRef,
			getPrelim: getPrelim,
			getPrelimBySport: getPrelimBySport,
			getPrelimBySportLeague: getPrelimBySportLeague,
			getPrelimBySportLeagueSlot: getPrelimBySportLeagueSlot,
			getAttendanceOfPrelimSportLeague: getAttendanceOfPrelimSportLeague
		};

		function getRef(){
			return $firebaseArray(new Firebase(FirebaseUrl + 'attendance')).$loaded();
		}

		function getPrelim(){
			return $firebaseArray(new Firebase(FirebaseUrl + 'attendance/prelim')).$loaded();
		}

		function getPrelimBySport(sportId){
			return $firebaseArray(new Firebase(FirebaseUrl + 'attendance/prelim/' + sportId)).$loaded();
		}

		function getPrelimBySportLeague(sportId, league){
			return $firebaseArray(new Firebase(FirebaseUrl + 'attendance/prelim/' + sportId + '/' + league)).$loaded();			
		}

		function getPrelimBySportLeagueSlot(sportId, league, slot){
			return $firebaseArray(new Firebase(FirebaseUrl + 'attendance/prelim/' + sportId + '/' + league + '/' + slot)).$loaded();
		}

		function getAttendanceOfPrelimSportLeague(s,l){
			var output = {};
			return getPrelimBySportLeague(s, l).then(function(data){
				//console.log(data);
				for(var i in data){
					if(data[i].$id != undefined){
						var temp = data.$getRecord(data[i].$id);
						for(var j in temp){
							if(j.indexOf('$') < 0){
								for(var k in temp[j]){
									if(temp[j][k]){
										output[k] = (output[k] == undefined)? 1 : ++output[k];
									}
								}
							}
						}
					}
				}
				//console.log(output);
				return output;
			});
		}

		function getTourny(){
			return $firebaseArray(new Firebase(FirebaseUrl + 'attendance/tourny')).$loaded();
		}
	}

}());