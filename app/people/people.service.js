(function(){
	
	'use strict';

	angular
		.module('guims')
		.factory('People',People);

	People.$inject = ['$firebaseArray', 'FirebaseUrl'];
	function People($firebaseArray, FirebaseUrl){
		return {
			ref : ref,
			getPeople: getPeople,
			getPeopleBulk : getPeopleBulk,
			getPeopleByHouse : getPeopleByHouse
		}

		function ref(){
			return $firebaseArray(new Firebase(FirebaseUrl+'people')).$loaded();
		}

		function getPeople(id){
			return $firebaseArray(new Firebase(FirebaseUrl+'people/'+id)).$loaded();
		}

		function getPeopleBulk(arr){
			var output = [];
			return ref().then(function(data){
				for(var i in arr){
					if(data.$indexFor(arr[i]) > -1){
						output.push(data[data.$indexFor(arr[i])]);
					}
				}
				return output;
			});
		}

		function getPeopleByHouse(hId){
			var output = [];
			return ref().then(function(data){
				for(var i in data){
					if(data[i].$id != undefined && data[i].house[hId]){
						output.push(data[i]);
					}
				}
				return output;
			});
		}

	}
}());