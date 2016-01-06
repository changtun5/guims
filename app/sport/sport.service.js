(function(){
	
	'use strict';

	angular
		.module('guims')
		.factory('Sport', sporting);

	sporting.$inject = ['$firebaseArray', 'FirebaseUrl'];
	function sporting($firebaseArray, FirebaseUrl){
		return {
			ref : $firebaseArray(new Firebase(FirebaseUrl + 'sport')),
			getAllSport : getAllSport,
			getSport : getSport,
			getSportBulk : getSportBulk,
			getSportByType : getSportByType
		}

		function getAllSport(){
			return $firebaseArray(new Firebase(FirebaseUrl + 'sport')).$loaded();
		}

		function getSport(id){
			return $firebaseArray(new Firebase(FirebaseUrl + 'sport/' + id)).$loaded();
		}

		function getSportBulk(arr){
			var output = [];
			for(var i in arr){
				if(arr[i].$id != undefined){
					var temp = getSport(arr[i].$id);
					console.log(temp);
				}
			}			
		}

		function getSportByType(type, mix){
			var output = {};
			return getAllSport().then(function(data){
				for(var i in data){
					if(data[i].$id != undefined){
						if(mix){
							if(data[i].type == type || data[i].type == 3){
								output[data[i].$id] = data[i];
							}
						}else{
							if(data[i].type == type){
								output[data[i].$id] = data[i];								
							}
						}
					}
				}
				return output;
			});
		}

	}

}());