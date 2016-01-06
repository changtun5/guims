(function(){

	'use strict';

	angular
		.module('guims')
		.factory('House', housing);

	housing.$inject = ['$firebaseArray', 'FirebaseUrl'];
	function housing($firebaseArray, FirebaseUrl){
		var ref = $firebaseArray(new Firebase(FirebaseUrl+'house'));
		return {
			ref : ref,
			getAllHouse : getAllHouse,
			getGents : getGents,
			getLadies : getLadies,
			getHouse : getHouse,
			getHouseMembers : getHouseMembers,
			getHouseMembersBulk : getHouseMembersBulk
		};

		function getAllHouse(){
			return ref.$loaded();
		}

		function getGents(){
			var gents = [];
			return ref.$loaded().then(function(data){
				for(var h in data){
					if(data[h].gender == 2 || data[h].gender == 4){
						gents.push(data[h]);						
					}
				}
				return gents;
			});
		}

		function getLadies(){
			var ladies = [];
			return ref.$loaded().then(function(data){
				for(var h in data){
					if(data[h].gender == 1 || data[h].gender == 4){
						ladies.push(data[h]);						
					}
				}
				return ladies;
			});
		}

		function getHouse(hId){
			return $firebaseArray(new Firebase(FirebaseUrl + 'house/' + hId)).$loaded();
		}

		function getHouseMembers(hId){
			return $firebaseArray(new Firebase(FirebaseUrl + 'house/' + hId + '/member')).$loaded();
		}

		function getHouseMembersBulk(hArr){
			var output = [];
			return getAllHouse().then(function(data){
				for(var i in hArr){
					output = output.concat(Object.keys(data[data.$indexFor(hArr[i])].member));
				}
				return output;
			});
		}		
	}

}());