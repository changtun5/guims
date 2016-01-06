(function(){
	'use strict';

	angular
		.module('guims')
		.controller('AccountController', AccountController);

	AccountController.$inject = ['$mdDialog', 'Account'];
	function AccountController($mdDialog, Account){
		var self = this;

		self.account = [];

		self.loginPage = {
			email: '',
			password: ''
		}

		account().then(function(){
		});

		self.login = login;
		self.register = register;
		self.cancel = cancel;

		function account(){
			return Account.getRef().then(function(data){
				self.account = data;
				return self.account;
			});
		}

		function login(){
			if(self.account.$indexFor(self.loginPage.email) < 0){
				var data =  Account.auth();
				console.log(data);
				data.$authWithPassword(self.loginPage, function(error, userData){
					if(error){
						console.log('Error Login');
					}else{
						console.log('Success', userData.uid);
						$mdDialog.hide('login');							
					}
				}, {remember: 'sessionOnly'});
			}else{
				console.log('Email Taken');				
			}
		}

		function register(){
			$mdDialog.hide('register');
		}

		function cancel(){
			$mdDialog.cancel();
		}

	}
}());