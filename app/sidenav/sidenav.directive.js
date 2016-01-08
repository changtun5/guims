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
			self.auth = Account.auth();
			self.close = close;
			self.go = go;
			self.getPos = getPos;
			self.logout = logout;
			self.login = login;
			self.showAccount = showAccount;
			self.getAccount = getAccount;
			self.showForRepsOnly = showForRepsOnly;
			self.showForDirBoa = showForDirBoa;

			self.menu = {
				normal: {
					sport : {
						label: 'Sports',
						state: 'sport'
					}
				},
				reps: {
					house : {
						label : 'House',
						state: 'houseTeam'
					}
				}
			};

			account().then(function(){

			});

			function logout(){
				Account.auth().$unauth();
				$state.go('home');
				close();
			}

			function login(){
				$state.go('login');
				close();
			}

			function account(){
				return Account.getRef().then(function(data1){
					self.account = data1;
					return self.account;
				});
			}

			function close(){
				$mdSidenav('left').close();
			}

			function go(state){
				var h = ['adm', 'adv', 'dir', 'boa'];
				if(state == 'houseTeam'){
					if(getAccount('position') == 'rep'){
						$state.go(state, {houseId: getAccount('house')});					
					}else if(h.indexOf(getAccount('position')) > -1){
						$state.go('house');
					}
				}else{
					$state.go(state);					
				}
				close();
			}

			function showAccount(){
				return (self.auth.$getAuth() != undefined)? true : false;
			}

			function getAccount(key){
				if(self.auth.$getAuth() != undefined){
					var id = self.auth.$getAuth().uid;
					return (self.account.length > 0 && id != undefined)? self.account.$getRecord(id)[key] : '';
				}
			}			

			function getPos(key){
				var out = '';
				switch(key){
					case 'adm':
						out = 'Admin';
						break;
					case 'adv':
						out = 'Advisor';
						break;

					case 'dir':
						out = 'Director';
						break;

					case 'boa':
						out = 'IM Board';
						break;

					case 'rep':
						out = 'IM Rep';
						break;

					default:
						break;

				}
				return out;				
			}

			function showForRepsOnly(pos){
				return (pos == 'rep' || pos == 'adm')? true : false;
			}

			function showForDirBoa(pos){
				return (pos == 'boa' || pos == 'dir' || pos == 'adv' || pos == 'adm')? true : false;
			}
		}

	}

}());