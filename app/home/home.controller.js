(function(){
	
	'use strict';

	angular
		.module('guims')
		.controller('HomeController', HomeController);

	HomeController.$inject = ['$state', '$mdMedia', '$mdDialog', 'Account', 'Sidenav'];
	function HomeController($state, $mdMedia, $mdDialog, Account, Sidenav){
		var self = this;

		self.account = {};
		self.users = [];
		self.showLogin = showLogin;
		self.logout = logout;
		self.auth = Account.auth();
		self.menu = Sidenav.open();
		self.loggedIn = loggedIn;

		self.getUser = getUser;

		users().then(function(data){
			getAccount();
		});

		function loggedIn(){
			return (self.auth.$getAuth() != undefined)? true : false;
		}

		function showLogin(ev){
			var fs = ($mdMedia('sm') || $mdMedia('xs'));
			var dialog = {
				controller: 'AccountController as accDialogCtrl',
				templateUrl: './app/dialogs/accountDialog.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				fullscreen: fs
			};
			$mdDialog.show(dialog).then(function(answer){
				if(answer == 'login'){
					getAccount();
					if(self.account.password.isTemporaryPassword){
						console.log('Temporary Password');
						$state.go('resetPwd');
					}
				}else if(answer == 'register'){

				}
			},function(){});
		}

		function users(){
			return Account.getRef().then(function(data){
				self.users = data;
				return self.users;
			});
		}

		function getAccount(){
			var data = Account.auth();
			self.account = data.$getAuth();
			return self.account;
		}

		function getUser(id, key){
			return (self.users.length > 0 && self.account != null)? self.users.$getRecord(id)[key] : '';
		}

		function logout(){
			Account.auth().$unauth();
			getAccount();
		}
	}

}());