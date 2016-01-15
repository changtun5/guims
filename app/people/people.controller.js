(function(){
	
	'use strict';

	angular
		.module('guims')
		.controller('PeopleController', PeopleController);

	PeopleController.$inject = ['$state', 'People', 'House', 'Account', 'Sidenav', 'Toast'];
	function PeopleController($state, People, House, Account, Sidenav, Toast){
		var self = this;
		self.nav = Sidenav.open();
		self.auth = Account.auth();
		if(self.auth.$getAuth() == undefined){
			$state.go('home');
		}
		self.account = [];
		self.people = [];
		self.houses = [];

		self.loaded = false;

		self.showOption = showOption;
		self.showNew = false;
		self.showEdit = false;

		self.toggleNew = toggleNew;
		self.toggleEdit = toggleEdit;

		self.personData = {};

		self.addPerson = addPerson;
		self.getPeopleObj = getPeopleObj;
		self.querySearchPeople = querySearchPeople;
		self.autoCompleteHouseDisplay = autoCompleteHouseDisplay;
		self.selectEditPersonHouseModel = selectEditPersonHouseModel;
		self.editpersonSelected = editpersonSelected;
		self.saveEdit = saveEdit;
		self.deletePerson = deletePerson;

		account().then(function(){
			people().then(function(){
				houses().then(function(){
					if(!isHigherUp(getAccount('position'))){
						$state.go('home');
					}				
					self.loaded = true;
					return self.loaded;
				});
			});			
		});

		function account(){
			return Account.getRef().then(function(data){
				self.account = data;
				return self.account;
			});
		}

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

		function isHigherUp(pos){
			var h = ['adm','adv','dir','boa'];
			//console.log(pos);
			return (h.indexOf(pos) > -1);
		}

		function getAccount(key){
			return (self.account.length > 0 && self.auth.$getAuth())? self.account.$getRecord(self.auth.$getAuth().uid)[key] : '';
		}

		function getPerson(id, key){
			var out = '';
			if(self.people.length > 0){
				if(key){
					out = self.people.$getRecord(id)[key];
				}else{
					out = self.people.$getRecord(id);
				}				
			}
			return out;
		}

		function addPerson(){
			if(self.personData.house != undefined){
				var temp = {
					name: self.personData.fName.trim() + ' ' + self.personData.lName.trim(),
					house: {}
				}
				temp.house[self.personData.house] = true;
				self.people.$add(temp).then(function(data){
					//console.log(data.key());
					var hr = getHouse(self.personData.house);
					hr.member[data.key()] = true;
					self.houses.$save(self.houses.$indexFor(hr.$id));
					self.personData = {};
					Toast.show(temp.name + ' added!');
				}).catch(function(error){
					console.log(error);
				});
			}else{

			}
		}

		function autoCompleteHouseDisplay(obj){
			var out = '';
			if(obj){
				for(var i in obj){
					if(obj[i]){
						out = getHouse(i, 'name');
						break;
					}
				}
			}
			return out;
		}

		function selectEditPersonHouseModel(obj){
			var out = '';
			if(obj){
				for(var i in obj){
					if(obj[i]){
						out = i;
						break;
					}
				}
			}
			return out;
		}

		function getHouse(id, key){
			var out = '';
			if(key){
				out = (self.houses.length > 0)? self.houses.$getRecord(id)[key] : '';
			}else{
				out = (self.houses.length > 0)? self.houses.$getRecord(id) : '';
			}
			return out;
		}

		function showOption(){
			return (!self.showNew && !self.showEdit);
		}

		function toggleNew(){
			self.showNew = !self.showNew;
		}

		function toggleEdit(){
			self.showEdit = !self.showEdit;
		}

		function getPeopleObj(){
			var out = self.people.map(function(item){
				return item;
			});
			return out;
		}

		function querySearchPeople(query){
			var r = query? getPeopleObj().filter(createFilterForPeople(query)) : [];
			return r;
		}

		function createFilterForPeople(query){
			var l = angular.lowercase(query);
			return function filterFn(p){
				return (p.name.toLowerCase().indexOf(l) > -1);
			};
		}

		function editpersonSelected(){
			// console.log(self.editperson);
			if(self.editperson){
				self.editperson.eHouse = selectEditPersonHouseModel(self.editperson.house);				
			}
			return self.editperson;
		}

		function saveEdit(){
			var h = Object.keys(self.editperson.house);
			var oldHouse = '';
			var eHouse = self.editperson.eHouse;
			var id = self.editperson.$id;
			var hFlag = true;
			for(var i in h){
				if(h[i] == eHouse){
					hFlag = false;
					console.log(oldHouse);
					console.log('House no change');
					break;
				}else{
					oldHouse = h[i];					
				}
			}
			if(hFlag){
				//console.log(oldHouse);			
				House.getHouseMembers(oldHouse).then(function(hmRef){
					//console.log(hmRef);
					hmRef.$remove(hmRef.$indexFor(id)).then(function(d){
						self.houses.$getRecord(eHouse).member[id] = true;
						self.houses.$save(self.houses.$indexFor(eHouse));
						self.people.$getRecord(id).house = {};
						self.people.$getRecord(id).house[eHouse] = true;
						self.editperson.name = self.editperson.name.trim();
						delete self.editperson.eHouse;
						self.people.$save(self.people.$indexFor(self.editperson.$id)).then(function(data){
							Toast.show('Successfully edited!');
							delete self.searchText;
							delete self.editperson;					
						}).catch(function(error){
							Toast.show(error);
						});													
					});
				});
			}else{
				self.editperson.name = self.editperson.name.trim();
				delete self.editperson.eHouse;
				self.people.$save(self.people.$indexFor(self.editperson.$id)).then(function(data){
					Toast.show('Successfully edited!');
					delete self.searchText;
					delete self.editperson;					
				}).catch(function(error){
					Toast.show(error);
				});					
			}		
		}

		function deletePerson(){
			var h = Object.keys(self.editperson.house)[0];
			var id = self.editperson.$id;
			House.getHouseMembers(h).then(function(data){
				data.$remove(data.$indexFor(id)).then(function(){
					self.people.$remove(self.people.$indexFor(id)).then(function(){
						Toast.show(self.editperson.name + ' removed!');
						delete self.searchText;
						delete self.editperson;							
					});
				});
			});
		}

	}
}());