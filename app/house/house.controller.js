(function(){
	
	'use strict';

	angular
		.module('guims')
		.controller('HouseController', HouseController);

	HouseController.$inject = ['$state', 'House'];
	function HouseController($state, House){
		var self = this;

		self.gender = [
			{
				label: 'Select',
				val: 0
			},
			{
				label: 'Ladies',
				val: 1
			},
			{
				label: 'Gents',
				val: 2
			},
			{
				label: 'Uni',
				val: 4
			}
		];

		self.loaded = false;

		self.house = {
			name: '',
			gender: 0
		}

		self.ladies = [];
		self.gents = [];
		self.allHalls = [];

		houses().then(function(){
			loaded();
		});
		//gents();
		//ladies();

		self.add = add;
		self.rem = rem;
		self.sav = sav;

		self.goHouseTeam = goHouseTeam;
		self.goHouseStats = goHouseStats;

		function add(){
			var houseRef = House.ref.$ref().child(self.house.name.trim().toLowerCase().replace(/ /g,'_'));
			houseRef.set(self.house)
			self.house = {
				name: '',
				gender: ''
			}
			return self.allHalls = House.getAllHalls();			
		}

		function rem(item){
			House.ref.$remove(item)
				.then(function(data){
					console.log(data + 'removed');
				});
		}

		function sav(id){
			var idx = self.allHalls.$indexFor(id);
			return self.allHalls.$save(idx).then(function(){
				return getAllHouse();
			});
		}

		function compare(a,b){
			if(a.name < b.name){
				return -1;
			}
			if(a.name > b.name){
				return 1;
			}
			return 0;
		}

		function houses(){
			return House.getAllHouse()
				.then(function(data){
					//console.log(data);
					self.allHalls = data.sort(compare);
					return self.allHalls;
				});
		}

		function gents(){
			return House.getGents()
				.then(function(data){
					self.gents = data.sort(compare);
					return self.gents;
				});
		}

		function ladies(){
			return House.getLadies()
				.then(function(data){
					self.ladies = data.sort(compare);
					return self.ladies;
				});
		}

		function goHouseTeam(hId){
			$state.go('houseTeam', {houseId: hId});
		}

		function goHouseStats(hId){
			console.log(hId);
			$state.go('houseStats', {houseId: hId});
		}

		function loaded(){
			self.loaded = true;
			return self.loaded;
		}

	}

}());