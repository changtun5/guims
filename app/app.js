(function(){
	'use strict';

	angular
		.module('guims',['ngMaterial', 'ui.router', 'ngMessages','firebase', 'md.data.table', 'scDateTime'])

	.config(stateProvider)
	.constant('FirebaseUrl', 'https://guims.firebaseio.com/');

	stateProvider.$inject = ['$stateProvider', '$urlRouterProvider'];
	function stateProvider($stateProvider, $urlRouterProvider){
		$stateProvider
			.state('home',{
				// url: '/',
				// templateUrl: './app/home/home.html',
				// controller: 'HomeController as homeCtrl'
				url: '/',
				templateUrl: './app/sport/sport.html',
				controller: 'SportController as sportCtrl'				
			})

			.state('login', {
				url:'/login',
				templateUrl: './app/account/login.html',
				controller: "AccountController as accDialogCtrl"
			})

			.state('register',{
				url: '/register',
				templateUrl: './app/account/createUser.html',
				controller: 'RegisterController as regiCtrl'
			})

			.state('resetPwd', {
				url: '/accountRecovery',
				templateUrl: './app/account/resetPwd.html',
				controller: 'ResetPwdController as resetPwdCtrl'
			})

			.state('house',{
				url: '/house',
				templateUrl: './app/house/house.html',
				controller: 'HouseController as houseCtrl'
			})

			.state('houseTeam',{
				url: '/house/{houseId}/teams',
				templateUrl: './app/house/houseTeam.html',
				controller: 'HouseTeamController as houseTeamCtrl'
			})

			// .state('houseStats',{
			// 	url: '/house/{houseId}/stats',
			// 	templateUrl: './app/stats/houseStats.html',
			// 	controller: 'HouseStatsController as houseStatsCtrl'
			// })

			.state('sport', {
				url: '/sport',
				templateUrl: './app/sport/sport.html',
				controller: 'SportController as sportCtrl'
			})

			.state('sportId',{
				url: '/sport/{sportId}/league/{league}',
				templateUrl: './app/sport/sportId.html',
				controller: 'SportIdController as sportIdCtrl'
			})

			.state('people',{
				url: '/people',
				templateUrl: './app/people/people.html',
				controller: 'PeopleController as peopleCtrl'
			})

			.state('prelim',{
				url: '/prelim/{sportId}/{league}',
				templateUrl: './app/prelim/prelim.html',
				controller: 'PrelimController as prelimCtrl'
			})

			.state('prelimInfo',{
				url: '/prelim/{sportId}/{league}/{slot}',
				templateUrl: './app/prelim/prelimInfo.html',
				controller: 'PrelimInfoController as prelimInfoCtrl'
			})

			.state('entrant',{
				url: '/entrant/{sportId}/{league}',
				templateUrl: './app/entrant/entrant.html',
				controller: 'EntrantController as entrantCtrl'
			})

			.state('team', {
				url: '/team',
				templateUrl: './app/team/team.html',
				controller: 'TeamController as teamCtrl'
			})

			.state('newTeam', {
				url: '/team/new',
				templateUrl: './app/team/newTeam.html',
				controller: 'TeamController as newTeamCtrl'
			})

			.state('editTeam',{
				url: '/team/{teamId}',
				templateUrl: './app/team/editTeam.html',
				controller: 'EditTeamController as editTeamCtrl'
			})

			.state('roster',{
				url: '/house/{houseId}/teams/{teamId}',
				templateUrl: './app/roster/roster.html',
				controller: 'RosterController as rosterCtrl'
			});

		$urlRouterProvider.otherwise('/');

	}
}());