(function(){
	
	'use strict';

	angular
		.module('guims')
		.controller('RegisterController', RegisterController);

	RegisterController.$inject = ['$state', 'Account', 'People', 'House', 'Sidenav', 'Toast'];
	function RegisterController($state, Account, People, House, Sidenav, Toast){
		var self = this;
		self.nav = Sidenav.open();
		self.house = [];
		self.pMatch = true;
		self.account = [];
		self.form = {};
		self.people = [];
		self.querySearch = querySearch;
		self.getHouse = getHouse;

		self.auth = Account.auth();

		self.loaded = false;

		account().then(function(){
			if(self.auth.$getAuth() == undefined){
				$state.go('home');
			}else{
				if(!isSup()){
					$state.go('home');
				}
			}
			house().then(function(){
				people().then(function(){
					loaded();
				});
			});
		});

		self.register = register;
		self.returnCPassObj = returnCPassObj;

		function account(){
			return Account.getRef().then(function(data){
				self.account = data;
				return self.account;
			});
		}

		function getAccount(key){
			return (self.account.length > 0)? self.account.$getRecord(self.auth.$getAuth().uid)[key] : '';
		}

		function returnCPassObj(error){
			error['passMatch'] = !(self.form.password == self.form.cPassword);
			return error;
		}

		function register(){
			if(isSup()){
				console.log('in register');
				if(Object.keys(self.form).length == 5){
					console.log('validation donde');
					if(self.form.password == self.form.cPassword){
						var auth = Account.auth();
						return auth.$createUser(self.form).then(function(response){
							var login = {
								email: self.form.email,
								password: self.form.password
							}
							delete self.form.cPassword;
							delete self.form.password;
							delete self.form.email;
							self.form['id'] = self.form.name.id;
							self.form['house'] = self.form.name.house;
							//console.log(self.form.name);							
							self.form.name = self.form.name.name;
							return Account.getRef().then(function(data){
								data.$ref().child(response.uid).set(self.form);
								Toast.show('Account created');
								$state.go('home');
							});
						}, function(error){
							console.log('error');
							console.log(error);
						});					
					}else{
						console.log('Passwords dont match');
						self.pMatch = false;
					}
				}				
			}
		}

		function people(){
			return People.ref().then(function(data){
				self.people = data.map(function(item){
					return {
						name: item.name,
						id: item.$id,
						house: Object.keys(item.house)[0]
					}
				});
				//console.log(self.people);
				return self.people;
			});
		}

		function house(){
			return House.getAllHouse().then(function(data){
				self.house = data;
				return self.house;
			});
		}

		function getHouse(id, key){
			return self.loaded ? self.house.$getRecord(id)[key] : '';
		}

		function querySearch(query){
			var r = query? self.people.filter(createFilterFor(query)) : [];
			return r;
		}

		function createFilterFor(query){
			//if(query) console.log(query);
			var l = angular.lowercase(query);
			return function filterFn(p){
				return (p.name.toLowerCase().indexOf(l) > -1);
			};
		}

		function loaded(){
			self.loaded = true;
			return self.loaded;
		}

		function isSup(){
			var h = ['adm','adv','dir'];
			if(h.indexOf(getAccount('position')) > -1){
				return true;
			}
			return false;
		}

	}

}());