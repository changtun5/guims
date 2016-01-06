(function(){
	
	'use strict';

	angular
		.module('guims')
		.controller('RegisterController', RegisterController);

	RegisterController.$inject = ['$state', 'Account'];
	function RegisterController($state, Account){
		var self = this;

		self.pMatch = true;
		self.account = [];
		self.form = {};

		account();

		self.register = register;
		self.returnCPassObj = returnCPassObj;

		function account(){
			return Account.getRef().then(function(data){
				self.account = data;
				return self.account;
			});
		}

		function returnCPassObj(error){
			error['passMatch'] = !(self.form.password == self.form.cPassword);
			return error;
		}

		function register(){
			if(Object.keys(self.form).length == 4){
				if(self.form.password == self.form.cPassword){
					var auth = Account.auth();
					console.log(auth);
					auth.$createUser(self.form).then(function(response){
						console.log('success');
						console.log(response);
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

}());