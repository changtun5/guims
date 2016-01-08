(function(){
	
	'use strict';

	angular
		.module('guims')
		.controller('ResetPwdController', ResetPwdController);

	ResetPwdController.$inject = ['$state', 'Account', 'Sidenav'];
	function ResetPwdController($state, Account, Sidenav){
		var self = this;
		self.auth = Account.auth();
		if(self.auth.$getAuth() == undefined){
			$state.go('home');
		}
		self.nav = Sidenav.open();
		self.account = {};
		self.form = {};
		self.errors = {};

		getAccount();
		self.form.email = self.account.password.email;

		self.reset = reset;

		function account(){
			var a = Account.auth();
			self.account = a.$getAuth();
			//console.log(self.account);
			if(self.account.password == undefined || !self.account.password.isTemporaryPassword){
				console.log('Go Home');
				$state.go('home');
			}
			return self.account;
		}

		function getAccount(){
			return account();
		}

		function reset(){
			self.errors = {};
			//console.log(self.form);
			if(self.form.newPassword == self.form.cNewPassword){
				var auth = Account.auth();
				delete self.form.nPassword;
				console.log();
				auth.$changePassword(self.form).then(function(){
					var login = {
						email: self.account.password.email,
						password: self.form.newPassword
					};
					auth.$unauth();
					auth.$authWithPassword(login).then(function(){
						$state.go('home');
					});
				}).catch(function(error){
					self.errors[error.code] = true;
				});				
			}else{
				self.errors['pMatch'] = true;
			}
		}

	}

}());