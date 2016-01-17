(function(){
	
	'use strict';

	angular
		.module('guims')
			.controller('PrelimInfoController', PrelimInfoController);

	PrelimInfoController.$inject = ['$state', 'Prelim', 'PrelimScore', 'Team', 'Sport', 'Roster', 'People', 'Attendance', '$mdDialog', '$mdMedia', 'Sidenav', 'Account', 'Staff', 'Toast'];
	function PrelimInfoController($state, Prelim, PrelimScore, Team, Sport, Roster, People, Attendance, $mdDialog, $mdMedia, Sidenav, Account, Staff, Toast){
		var self = this;

		self.sportId = $state.params.sportId;
		self.league = $state.params.league;
		self.slot = $state.params.slot;
		self.smallDevice = $mdMedia('xs') || $mdMedia('sm');
		self.nav = Sidenav.open();
		self.auth = Account.auth();
		self.account = [];
		self.pageData = {
			loaded: false
		};

		self.sport = [];
		self.teams = [];
		self.prelim = [];
		self.prelimScore = [];
		self.roster = {};
		self.attTotal = {};
		self.att = [];
		self.people = {};
		self.staffPaid = [];
		self.staffVolu = [];
		self.staffScor = [];
		self.everyone = [];

		account().then(function(){
			prelim().then(function(data){
				if(self.auth.$getAuth() == undefined){
					$state.go('home');
				}

				if(self.getAccount('position') == 'rep'){
					$state.go('prelim', {sportId: self.sportId, league: self.league});
				}
				prelimScore().then(function(){
					teams().then(function(){
						sport().then(function(){
							roster().then(function(){
								people().then(function(){
									att().then(function(){
										attTotal().then(function(){
											staffPaid().then(function(){
												staffVolu().then(function(){
													staffScor().then(function(){
														everyone().then(function(){
															slotName();																																						
														});
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});			
		});

		self.saveDate = saveDate;
		self.saveScorecard = saveScorecard;
		self.formatDate = formatDate;
		self.getPeople = getPeople;
		self.returnShowIcon = returnShowIcon;
		self.toggleShowIcon = toggleShowIcon;
		self.returnShowTooltip = returnShowTooltip;
		self.saveAttendance = saveAttendance;
		self.showAddRosterDialog = showAddRosterDialog;
		self.showAtt = showAtt;
		self.saveEditAttIcon = saveEditAttIcon;
		self.defaultWin = defaultWin;
		self.getAccount = getAccount;
		self.isLoggedIn = isLoggedIn;
		self.isHigherUp = isHigherUp;
		self.getPrelim = getPrelim;
		self.saveAudience = saveAudience;
		self.showStaffPaidDialog = showStaffPaidDialog;
		self.showStaffVoluDialog = showStaffVoluDialog;
		self.showStaffScoreDialog = showStaffScoreDialog;
		self.getPersonInfo = getPersonInfo;

		function getPersonInfo(id, k){
			return (self.everyone.length > 0 && self.everyone.$indexFor(id) > -1)? self.everyone.$getRecord(id)[k] : '';
		}


		function saveAudience(){
			self.prelim.$getRecord('audience').$value = self.pageData['audience'];
			self.prelim.$save(self.prelim.$indexFor('audience')).then(function(){
				Toast.show('# Audience saved');
			});
		}

		function getPrelim(k){
			if(k == 'audience'){
				if(self.prelim.$indexFor('audience') < 0){
					self.prelim.$ref().child('audience').set(0);
				}
			}
			return (self.prelim.length > 0)? self.prelim.$getRecord(k).$value : '';
		}

		function isHigherUp(){
			var h = ['adm', 'adv', 'dir', 'boa'];
			return (h.indexOf(getAccount('position')) > -1);
		}

		function account(){
			return Account.getRef().then(function(data){
				self.account = data;
				return self.account;
			});
		}

		function everyone(){
			return People.ref().then(function(data){
				self.everyone = data;
				return self.everyone;
			});
		}

		function prelim(){
			return Prelim.getPrelimSlot(self.sportId, self.league, self.slot)
				.then(function(data){
					self.prelim = data;
					//console.log(self.prelim);
					return self.prelim;
				});
		}

		function prelimScore(){
			return PrelimScore.getGameScore(self.sportId, self.league, self.slot)
				.then(function(data){
					self.prelimScore = data;
					return self.prelimScore;
				});
		}

		function teams(){
			var vTeam = [];
			for(var k in self.prelimScore){
				if(k.indexOf('$') == -1){
					var temp = {
						$id : k
					}
					vTeam.push(temp);
				}
			}
			//console.log(vTeam);
			return Team.getTeamBulk(vTeam).then(function(data){
				//console.log(data);
				self.teams = data;
				return self.teams;
			});
		}

		function sport(){
			return Sport.getSport(self.sportId).then(function(data){
				self.sport = data;
				return self.sport;
			});
		}

		function roster(){
			var temp = [];
			for(var i in self.teams){
				if(self.teams[i].$id != undefined){
					temp.push(self.teams[i].$id);
				}
			}
			return Roster.getTeamRosterBulk(temp).then(function(data){
				//console.log(data);
				self.roster = data;
				return self.roster;
			});
		}

		function people(){
			var p = [];
			for(var i in self.roster){
				p = p.concat(self.roster[i]);
			}
			return People.getPeopleBulk(p).then(function(data){
				//console.log(data);
				for(var ii in data){
					self.people[data[ii].$id] = data[ii];
				}
				//console.log(self.people);
				return self.people;
			});
		}

		function att(){
			return Attendance.getPrelimBySportLeagueSlot(self.sportId, self.league, self.slot).then(function(data){
				// console.log(data);
				self.att = data;
				return self.att;
			});
		}

		function attTotal(){
			return Attendance.getAttendanceOfPrelimSportLeague(self.sportId, self.league).then(function(data){
				self.attTotal = data;
				return self.attTotal;
			});
		}

		function staffPaid(){
			return Staff.getPrelimRefSlotPaid(self.sportId, self.league, self.slot).then(function(data){
				self.staffPaid = data;
				return self.staffPaid;
			});
		}

		function staffVolu(){
			return Staff.getPrelimRefSlotVolun(self.sportId, self.league, self.slot).then(function(data){
				self.staffVolu = data;
				return self.staffVolu;
			});
		}

		function staffScor(){
			return Staff.getPrelimRefSlotScoreKeep(self.sportId, self.league, self.slot).then(function(data){
				self.staffScor = data;
				return self.staffScor;
			});
		}				

		function getPeople(id, key){
			return (self.pageData['loaded']) ? self.people[id][key] : '';
		}

		function saveDate(date){
			if(isHigherUp()){
				var temp = self.prelim[self.pageData['dateIdx']];
				temp.$value = date.toString();
				//console.log(temp);
				self.prelim[self.pageData['dateIdx']] = temp;
				return self.prelim.$save(self.pageData['dateIdx']).then(function(){
					prelim().then(function(){
						return slotName();
					});
				});
			}else{
				//console.log('Not Board');
			}
		}

		function isLoggedIn(){
			return (self.auth.$getAuth() != undefined);
		}

		function getAccount(key){
			return (self.account.length > 0 && isLoggedIn())? self.account.$getRecord(self.auth.$getAuth().uid)[key] : '';
		}


		function returnShowIcon(flag){
			return (flag)? './icons/up.svg' : './icons/down.svg';
		}

		function toggleShowIcon(data,tId,key){
			if(data == 'pageData'){
				self.pageData[tId][key] = !self.pageData[tId][key];
			}
		}

		function returnShowTooltip(flag){
			return (flag)? 'Hide Roster' : 'Show Roster';
		}

		function saveScorecard(id){
			if(isHigherUp()){
				return PrelimScore.getSlot(self.sportId, self.league, self.slot).then(function(data){
						var thisTeam = {
							id: id,
							idx: data.$indexFor(id)
						};
						var theOtherTeam = {};
						for(var i in data){
							if(data[i].$id != undefined){
								if(data[i].$id == thisTeam.id) continue;
								theOtherTeam.id = data[i].$id;
								theOtherTeam.idx = data.$indexFor(data[i].$id);
								break;
							}
						}
						//console.log(thisTeam);
						//console.log(theOtherTeam);

						if(self.prelimScore[thisTeam.id].score == self.prelimScore[theOtherTeam.id].score){
							data[thisTeam.idx].result = 'D';
							data[theOtherTeam.idx].result = 'D';
						}else{
							var thisWon = self.prelimScore[thisTeam.id].score > self.prelimScore[theOtherTeam.id].score;
							data[thisTeam.idx].result = (thisWon)? 'W' : 'L';
							data[theOtherTeam.idx].result = (!thisWon)? 'W' : 'L';
						}

						//Save thd current team scores (score, spPts, result)
						//console.log(data[thisTeam.idx]);
						data[thisTeam.idx].score = self.prelimScore[thisTeam.id].score;
						data[thisTeam.idx].spPts = self.prelimScore[thisTeam.id].spPts;

						data.$save(thisTeam.idx);
						data.$save(theOtherTeam.idx);

						self.prelim[self.prelim.$indexFor('played')].$value = true;
						self.prelim.$save(self.prelim.$indexFor('played'));
						return prelimScore().then(function(){
							return slotName();
						});				
					});
			}else{
				//console.log('Must Board Up')
			}
		}

		function defaultWin(tId){
			self.prelim.$getRecord('played').$value = true;
			self.prelim.$save(self.prelim.$IndexFor('played'));
			return PrelimScore.getSlot(self.sportId, self.league, self.slot).then(function(data){

			});
		}

		function formatDate(d){
			return (d == '-')? '-' : new Date(d).getTime();
		}

		function saveAttendance(tId){
			if(isHigherUp()){
				if(!self.pageData[tId].rosterSaved){
					var temp = {};
					for(var i in self.pageData[tId].att){
						if(self.pageData[tId].att[i]){
							temp[i] = true;
						}
					}
					//console.log(temp);
					if(Object.keys(self.pageData[tId].att).length > 0){
						return Attendance.getPrelimBySportLeague(self.sportId, self.league).then(function(data){
							var idx = data.$indexFor(self.slot);
							if( idx == -1){
								console.log(data.$ref().child(self.slot));
								console.log(self.slot);
								data.$ref().child(self.slot+'/'+tId).set(temp);
							}else{
								data[idx][tId] = (data[idx][tId] == undefined)? {} : data[idx][tId];
								data[idx][tId] = temp;
								data.$save(idx);
							}
							return attTotal().then(function(){
								self.pageData[tId].rosterSaved = true;
								return self.pageData;
							});
						});
					}
				}else{
					self.pageData[tId].showRos = true;
					self.pageData[tId].rosterSaved = false;
					return self.pageData;
				}
			}else{
				//console.log('Board Up');
			}
		}

		function showStaffPaidDialog(ev){
			var dialog = {
				controller: 'StaffPaidDialogController as staffPaidCtrl',
				templateUrl: './app/dialogs/staffPaid.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				fullscreen: true,
				locals: {
					matchName: self.pageData.name,
					sport: self.pageData.sport
				}
			}
			if(isHigherUp()){
				$mdDialog.show(dialog).then(function(){

				}, function(){

				});
			}
		}

		function showStaffVoluDialog(ev){
			var dialog = {
				controller: 'StaffVoluDialogController as staffVoluCtrl',
				templateUrl: './app/dialogs/staffVolu.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				fullscreen: true,
				locals: {
					matchName: self.pageData.name,
					sport: self.pageData.sport
				}
			}
			if(isHigherUp()){
				$mdDialog.show(dialog).then(function(){

				}, function(){

				});
			}
		}

		function showStaffScoreDialog(ev){
			var dialog = {
				controller: 'StaffScorDialogController as staffScorCtrl',
				templateUrl: './app/dialogs/staffScor.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				fullscreen: true,
				locals: {
					matchName: self.pageData.name,
					sport: self.pageData.sport
				}
			}
			if(isHigherUp()){
				$mdDialog.show(dialog).then(function(){

				}, function(){

				});
			}
		}				

		function showAddRosterDialog(ev, teamId, tr){
			var fs = ($mdMedia('sm') || $mdMedia('xs'));
			var dialog = {
				controller: 'AddRosterDialogController as ardCtrl',
				templateUrl: './app/dialogs/addRosterDialog.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				fullscreen: fs,
				locals: {
					thisTeam : teamId,
					thisRoster: tr
				}
			};
			if(isHigherUp()){
				$mdDialog.show(dialog).then(function(answer){
					//console.log(self.people);
					//console.log(self.roster);
					//console.log(answer);
					if(answer.length > 0){
						return People.ref().then(function(data){
							for(var i in answer){
								//console.log(answer[i]);
								data[data.$indexFor(answer[i])].team = (data[data.$indexFor(answer[i])].team == undefined)? {} : data[data.$indexFor(answer[i])].team;
								data[data.$indexFor(answer[i])].team[teamId] = true;
								data.$save(data.$indexFor(answer[i]));
							}
							return Roster.getRef().then(function(data){
								if(data.$indexFor(teamId) < 0){
									for(var k in answer){
										data.$ref().child(teamId + '/' + answer[k]).set(true);
									}
								}else{
									for(var j in answer){
										data[data.$indexFor(teamId)] = (data[data.$indexFor(teamId)] == undefined)? {} : data[data.$indexFor(teamId)];
										data[data.$indexFor(teamId)][answer[j]] = true;
										data.$save(data.$indexFor(teamId));
									}
								}
								roster().then(function(){
									people().then(function(){
										slotName();															
									});
								});
							});
						});
					}
				}, function(){
					//console.log('Cancel');
				});
			}else{
				//console.log('Board Up');
			}

		}

		function showAtt(key){
			return (self.pageData['loaded'] && self.attTotal[key] != undefined)? self.attTotal[key] : 0 ;
		}

		function saveEditAttIcon(tId, mode){
			if(self.pageData.loaded){
				if(mode == 'icon'){
					return (self.pageData[tId].rosterSaved)? './icons/edit.svg' : './icons/save.svg';
				}else if(mode == 'toolTip'){
					return (self.pageData[tId].rosterSaved)? 'Edit' : 'Save';
				}
			}else{
				return '';
			}
		}

		function slotName(){
			self.pageData['name'] = self.prelim[self.prelim.$indexFor('name')].$value;
			self.pageData['sport'] = self.sport[self.sport.$indexFor('name')].$value;
			self.pageData['dateIdx'] = self.prelim.$indexFor('date');
			self.pageData['dateSet'] = (self.prelim[self.pageData['dateIdx']].$value == '-')? false : true;
			self.pageData['sche'] = (self.pageData['dateSet'])? new Date(self.prelim[self.pageData['dateIdx']].$value) : new Date();
			self.pageData['played'] = self.prelim[self.prelim.$indexFor('played')].$value;

			for(var i in self.roster){
				self.pageData[i] = {
					showRos: true,
					att : {},
					rosterSaved: (self.att.$indexFor(i) < 0)? false : true
				};
				for(var ii in self.roster[i]){
					self.pageData[i].att[self.roster[i][ii]] = false;
				}

				for(var j in self.att[self.att.$indexFor(i)]){
					if(j.indexOf('$') < 0){
						self.pageData[i].att[j] = true;
					}
				}
			}

			self.pageData['audience'] = getPrelim('audience');

			self.pageData['loaded'] = true;
			return self.pageData;
		}

	}

}());