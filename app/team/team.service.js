(function(){
	
	'use strict';

	angular
		.module('guims')
		.factory('Team', teaming);

	teaming.$inject = ['$firebaseArray', 'FirebaseUrl'];
	function teaming($firebaseArray, FirebaseUrl){
		var ref = $firebaseArray(new Firebase(FirebaseUrl+'team'));
		return {
			ref: ref,
			getAllTeamNames : getAllTeamNames,
			getAll : getAll,
			getValidTeams: getValidTeams,
			getTeam : getTeam,
			getTeamBulk : getTeamBulk
		}

		function getAllTeamNames(){
			var teamNames = [];
			return ref.$loaded()
				.then(function(data){
					for(var t in data){
						if(typeof(data[t]) === 'object'){
							if(data[t].name){
								teamNames.push(data[t].name);							
							}
						}
					}
					return teamNames;
				});			
		}

		function getAll(){
			return ref.$loaded();
		}

		function getValidTeams(t, l){
			var output = [];
			return ref.$loaded()
				.then(function(data){
					for(var i in data){
						if(typeof(data[i]) === 'object'){
							if((data[i].type == t || data[i].type == 4) && data[i].league == l){
								output.push(data[i]);
							}
						}
					}
					return output;
				});
		}

		function getTeam(id){
			return $firebaseArray(new Firebase(FirebaseUrl + 'team/' + id)).$loaded();
		}

		function getTeamBulk(arr, obj){
			//when obj arr is a list of team names and returns an object
			//when not obj arr is a list of objects and returns a list
			var output = [];
			if(obj){
				output = {};
				return getAll().then(function(data){
					for(var b in arr){
						if(data.$indexFor(arr[b]) > -1){
							output[data[data.$indexFor(arr[b])]] = data.$getRecord(arr[b]);
						}
					}
					return output;
				});
			}else{
				return getAll()
					.then(function(data){
						for(var a in arr){
							var idx = data.$indexFor(arr[a].$id);
							if(idx > -1){
								output.push(data[idx]);
							}
						}
						return output;						
					});
			}
		}
	}

}());