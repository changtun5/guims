(function(){
	
	'use strict';

	angular
		.module('guims')
		.factory('Toast', Toast);

	Toast.$inject = ['$mdToast', '$document'];
	function Toast($mdToast, $document){
		var last = {
			bottom: false,
			top: true,
			left: false,
			right: true
		};

		var toastPosition = angular.extend({}, last);

		function getToastPos(){
			return Object.keys(toastPosition).filter(function(pos){
				return toastPosition[pos];
			}).join(' ');
		}

		function show(msg){
			$mdToast.show($mdToast.simple()
				.textContent(msg)
				.position('top right')
				.hideDelay(3000)
			);
		}

		return {
			show: show
		}
	}

}());