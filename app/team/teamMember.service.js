(function(){
	
	'use strict';

	angular
		.module('guims')
		.factory('TeamMembers', TeamMembers);

	TeamMembers.$inject = ['$firebaseArray', 'FirebaseUrl'];
	function TeamMembers($firebaseArray, FirebaseUrl){
		var ref = $firebaseArray(new Firebase(FirebaseUrl + 'teamMember'));
		return {
			ref : ref,
			getTeamMembers : getTeamMembers,
			getTeamsWithHouse : getTeamsWithHouse,
			getTeamsWithHouseBulk : getTeamsWithHouseBulk
		}

		function getTeamMembers(teamId){
			return $firebaseArray(new Firebase(FirebaseUrl + 'teamMember/' + teamId)).$loaded();
		}

		function getTeamsWithHouse(hId){
			var output = [];
			return ref.$loaded()
				.then(function(data){
					for(var idx in data){
						if(data[idx].$id != undefined && data[idx][hId]){
							output.push(data[idx]);
						}
					}
					return output;
				});
		}

		function getTeamsWithHouseBulk(hArr){
			var output = [];
			return ref.$loaded().then(function(data){
				for(var i in data){
					if(data[i].$id != undefined){
						var temp = Object.keys(data[i]);
						for(var j in temp){
							if(temp[j].indexOf('$') == -1 && data[i][temp[j]] && hArr.indexOf(temp[j]) > -1){
								output.push(data[i].$id);
								break;
							}
						}
					}
				}
				return output;
			});
		}
	}

}());