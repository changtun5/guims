(function(){
	
	'use strict';

	angular
		.module('guims')
		.controller('PeopleController', PeopleController);

	PeopleController.$inject = ['$state', 'People', 'House'];
	function PeopleController($state, People, House){
		var self = this;

		self.people = [];
		self.houses = [];

		self.loaded = false;

		self.personData = {};

		self.addPerson = addPerson;


		people().then(function(){
			// houses().then(function(){});
			self.loaded = true;
			return self.loaded;
		});

		function people(){
			return People.ref()
				.then(function(data){
					self.people = data;
					return self.people;
				});
		}

		function houses(){
			return House.getAllHouse()
				.then(function(data){
					self.houses = data;
					return self.houses;
				});
		}

		function addPerson(gg){

			var temp = {
				house: {},
				name: ''
			};

			if(gg != undefined){
				//console.log(gg);
				temp.house[gg.house] = true;
				temp['name'] = gg.name.trim();
				var pId = gg.name.trim().toLowerCase().replace(/ /g, '_');
				if(self.people.$indexFor(pId) == -1){
					self.people.$ref().child(pId).set(temp);
					console.log(pId + ' added');

				}else{
					console.log('Id ' + pId + ' Taken');				
				}
				return people().then(function(){
					var idx = self.houses.$indexFor(gg.house);
					var hTemp = self.houses[idx];
					self.houses.$ref().child(gg.house+'/member/'+pId).set(true);
					self.personData = {};
					return self.personData;
				});				
			}else{
				temp.house[self.personData.house] = true;
				temp['name'] = self.personData.name.trim();
				var pId = self.personData.name.trim().toLowerCase().replace(/ /g, '_');
				if(self.people.$indexFor(pId) == -1){
					self.people.$ref().child(pId).set(temp);
					console.log(pId + ' added');
					return people().then(function(){
						var idx = self.houses.$indexFor(self.personData.house);
						var hTemp = self.houses[idx];
						self.houses.$ref().child(self.personData.house+'/member/'+pId).set(true);
						self.personData = {};
						return self.personData;
					});
				}
				console.log('Id Taken');
			}
			return false;		
		}

	}
}());