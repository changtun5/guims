(function(){
	'use strict';

	angular
		.module('guims')
		.config(theming);

	theming.$inject = ['$mdThemingProvider'];
	function theming($mdThemingProvider){
		//$mdThemingProvider.theme('default');
	}
}());