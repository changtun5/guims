(function(){
	
	'use strict';

	angular
		.module('guims')
		.controller('HomeController', HomeController);

	HomeController.$inject = ['$state', '$mdMedia', '$mdDialog', 'Account'];
	function HomeController($state, $mdMedia, $mdDialog, Account){
		var self = this;

		self.showLogin = showLogin;

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

				}else if(answer == 'register'){

				}
			},function(){});
		}
	}

}());