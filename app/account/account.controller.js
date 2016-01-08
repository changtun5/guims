(function(){
	'use strict';

	angular
		.module('guims')
		.controller('AccountController', AccountController);

	AccountController.$inject = ['$state', '$mdDialog', 'Account', 'Sidenav'];
	function AccountController($state, $mdDialog, Account, Sidenav){
		var self = this;
		self.nav = Sidenav.open();
		self.errors = {};
		self.account = [];

		self.loginPage = {
			email: '',
			password: ''
		}

		account().then(function(){
			if(Account.auth().$getAuth() != null){
				$state.go('home');
			}
		});

		self.login = login;
		self.register = register;
		self.cancel = cancel;
		self.forgotPwd = forgotPwd;

		self.wlogin = wlogin;
		self.wforgotPwd = wforgotPwd;

		function account(){
			return Account.getRef().then(function(data){
				self.account = data;
				return self.account;
			});
		}

		function login(){
			self.errors = {};
			if(self.loginPage.email.length > 0 && self.loginPage.password.length > 0){
				var data =  Account.auth();
				//console.log(data.$getAuth());
				data.$authWithPassword(self.loginPage, {remember: 'sessionOnly'}).then(function(data){
					console.log('Logged');
					//console.log(data);
					$mdDialog.hide('login');
				}).catch(function(error){
					console.log('Error');
					console.log(error.code);
					self.errors[error.code] = true;
				});
			}else{
				console.log('Blank Form');
				self.errors.blank = true;				
			}
		}

		function wlogin(){
			self.errors = {};
			if(self.loginPage.email.length > 0 && self.loginPage.password.length > 0){
				var data =  Account.auth();
				//console.log(data.$getAuth());
				data.$authWithPassword(self.loginPage, {remember: 'sessionOnly'}).then(function(data1){
					//console.log('Logged');
					//console.log(data.$getAuth().password.isTemporaryPassword);
					if(data.$getAuth().password.isTemporaryPassword){
						$state.go('resetPwd');
					}else{
						$state.go('home');						
					}
				}).catch(function(error){
					console.log('Error');
					console.log(error.code);
					self.errors[error.code] = true;
				});
			}else{
				console.log('Blank Form');
				self.errors.blank = true;				
			}			
		}

		function forgotPwd(){
			self.errors = {};
			if(self.loginPage.email.length > 0){
				var data =Account.auth();
				data.$resetPassword({email: self.loginPage.email}).then(function(){
					self.errors['forgotSent'] = true;
				}).catch(function(error){
					self.errors[error.code] = true;
				});
			}else{
				self.errors.forgotEmail = true;
			}
		}

		function wforgotPwd(){
			self.errors = {};
			if(self.loginPage.email.length > 0){
				var data =Account.auth();
				data.$resetPassword({email: self.loginPage.email}).then(function(){
					self.errors['forgotSent'] = true;
				}).catch(function(error){
					self.errors[error.code] = true;
				});
			}else{
				self.errors.forgotEmail = true;
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