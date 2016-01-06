(function(){
	'use strict';

	angular
		.module('guims')
		.controller('SportController', SportController);

	SportController.$inject = ['$state', 'Sport'];
	function SportController($state, Sport){
		var self = this;

		self.sport = {
			name : '',
			joint : false
		};

		self.nl = {
			value: 'N',
			label: 'No League'
		};

		self.leagues = [
			{
				value: 'A',
				label: 'A League'
			},{
				value: 'B',
				label: 'B League'
			},{
				value: 'C',
				label: 'C League'
			}
		];

		self.selectedLeagues = [];

		self.add = add;
		self.sav = sav;
		self.toggle = toggle;
		self.noLeagues = noLeagues;
		self.exist = exist;
		self.disableNL = disableNL;
		self.goSport = goSport;

		self.sports = [];
		sport();

		function add(){
			if(checkValid()){
				var league = {};
				for(var i in self.selectedLeagues){
					league[self.selectedLeagues[i]] = true;
				}
				if(self.sport.joint){
					var sportRef = Sport.ref.$ref().child(self.sport.name.trim().toLowerCase().replace(/ /g, '_'));
					var temp = {
						name: self.sport.name.trim(),
						type: 3,
						league : league
					}
					sportRef.set(temp);
				}else{
					//Add two of the sport; 1 for gents and 1 for the ladies
					var gent = "Men's " + self.sport.name.trim();
					var sportRef = Sport.ref.$ref().child(gent.toLowerCase().replace(/ /g, '_'));
					var temp = {
						name : gent,
						type: 2,
						league : league
					}
					sportRef.set(temp);

					var ladies = "Women's " + self.sport.name.trim();
					sportRef = Sport.ref.$ref().child(ladies.toLowerCase().replace(/ /g, '_'));
					temp = {
						name: ladies,
						type: 1,
						league : league
					}
					sportRef.set(temp);

				}			
				self.sport = {
					name : ''
				};
				self.selectedLeagues = [];
				sport();
			}
		}

		function sav(){
			Sport.ref.$save();
		}

		function sport(){
			return Sport.getAllSport()
				.then(function(data){
					self.sports = data.sort(compare);
					return self.sports;
				});
		}

		function compare(a,b){
			if(a.name < b.name){
				return -1;
			}
			if(a.name > b.name){
				return 1;
			}
			return 0;
		}

		function checkDups(){
			for(var i in self.sports){
				if(self.sports[i].name.toLowerCase() == self.sport.name.toLowerCase()){
					console.log(self.sports[i].name.toLowerCase() == self.sport.name.toLowerCase());
					return true;
				}
			}
			return false;
		}

		function checkValid(){
			var name = (!checkDups() && (self.sport.name.trim().length != 0));
			if(name && self.selectedLeagues.length != 0){
				return true;
			}
			return false;
		}

		function toggle(a){
			var idx = self.selectedLeagues.indexOf(a.value);
			if(idx > -1){
				self.selectedLeagues.splice(idx, 1);
			}else{
				self.selectedLeagues.push(a.value);
			}
			if(noLeagues()){
				self.selectedLeagues = ['N'];
			}
		}

		function noLeagues(){
			return self.selectedLeagues.indexOf('N') > -1;
		}

		function exist(a){
			return self.selectedLeagues.indexOf(a.value) > -1;
		}

		function disableNL(){
			return self.selectedLeagues.indexOf('A') > -1 || self.selectedLeagues.indexOf('B') > -1 || self.selectedLeagues.indexOf('C') > -1;
		}

		function goSport(id,l){
			$state.go('sportId',{sportId:id,league:l})
		}
	}
}());