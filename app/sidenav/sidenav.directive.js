(function(){
	
	'use strict';

	angular
		.module('guims')
		.directive('sideNav', sideNav);

	function sideNav(){
		return {
			restrict: 'E',
			templateUrl: './app/sidenav/side-nav.html',
			controller: SidenavController,
			controllerAs: 'navCtrl'
		};

		SidenavController.$inject = ['$state', 'Account', '$timeout', '$mdSidenav'];
		function SidenavController($state, Account, $timeout, $mdSidenav){
			var self = this;

			self.account = {};

			self.close = close;
			self.go = go;

			getAccount().then(function(){
				console.log(self.account);
			});

			function getAccount(){
				var auth = Account.auth();
				var data = auth.$getAuth();
				if(data){
					return Account.getRef().then(function(data1){
						self.account = data1.$getRecord(data.uid);
						return self.account;
					});
				}
			}

			function close(){
				$mdSidenav('left').close();
			}

			function go(state){
				$state.go(state);
			}
		}
	}

}());