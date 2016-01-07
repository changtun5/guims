(function(){
	
	'use strict';

	angular
		.module('guims')
		.factory('Sidenav', Sidenav);

	Sidenav.$inject = ['$timeout', '$mdSidenav'];
	function Sidenav($timeout, $mdSidenav){
		return {
			open : buildToggler
		}

		function buildToggler(){
			return function(){
				$mdSidenav('left').toggle();
			}
		}
	}

}());