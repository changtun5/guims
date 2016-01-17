(function(){
	
	'use strict';

	angular
		.module('guims')
		.controller('PrelimController', PrelimController);

	PrelimController.$inject = ['$state', 'Sport', 'Team', 'Entrant', 'Prelim', 'PrelimScore', 'Sidenav', 'Account','$mdMedia', '$mdDialog'];
	function PrelimController($state, Sport, Team, Entrant, Prelim, PrelimScore, Sidenav, Account, $mdMedia, $mdDialog){
		var self = this;
		self.leagueId = $state.params.league;
		self.nav = Sidenav.open();
		self.auth = Account.auth();
		self.account = [];
		self.debug = false;
		self.entrant = [];
		self.sport = [];
		self.teams = [];
		self.prelimRef = [];
		self.prelimScoreRef = [];
		self.prelimScore = {};
		self.prelimSlot = {};
		self.prelim = {
			loaded: false
		};

		self.rrTable = [];

		account().then(function(){
			sport().then(function(){
				entrant().then(function(){
					teams().then(function(){
						prelimRef().then(function(data){
							if(data.length == 0){
								noMatches();
							}else{
								prelimScoreRef().then(function(){
									rrTable();
								});
							}					
						});
					});
				});
			});			
		});

		self.goPrelimSlot = goPrelimSlot;
		self.goEntrant = goEntrant;
		self.formatDate = formatDate;
		self.createRRTable = createRRTable;
		self.isLoggedin = isLoggedin;
		self.getAccount = getAccount;
		self.isHigherUps = isHigherUps;
		self.showAddPart = showAddPart;
		self.showNoMatches = showNoMatches;
		self.showCreateTableBut = showCreateTableBut;
		self.showConfirmClear = showConfirmClear;

		function showCreateTableBut(){
			return (self.prelim.loaded && self.auth.$getAuth() != null)? (self.entrant.length > 1 && isHigherUps(getAccount('position'))) : false;
		}

		function showNoMatches(){
			return (self.prelim.loaded)? (self.prelimRef.length < 1) : false;
		}

		function showAddPart(){
			return (self.prelim.loaded && self.auth.$getAuth() != null)? (self.entrant.length < 2 && isHigherUps(getAccount('position'))) : false;
		}

		function showConfirmClear(ev){
			var confirm = $mdDialog.confirm()
				.title('Clear Preliminaries')
				.textContent('Are you sure you want to clear all games and its information?')
				.ariaLabel('Clear Prelim')
				.targetEvent(ev)
				.ok('Yes')
				.cancel('No');
			$mdDialog.show(confirm).then(function(){
				//console.log('Yes');
				return PrelimScore.getSportScore($state.params.sportId).then(function(psRef){
					psRef.$remove(psRef.$indexFor(self.leagueId)).then(function(){
						return Prelim.getSportPrelim($state.params.sportId).then(function(pRef){
							//console.log(pRef);
							pRef.$remove(pRef.$indexFor(self.leagueId));
						});
					});
				});
			}, function(){
				console.log('Keep Data');
			});
		}

		function account(){
			return Account.getRef().then(function(data){
				self.account = data;
				return self.account;
			});
		}

		function entrant(){
			var s = $state.params.sportId;
			var l = $state.params.league;
			return Entrant.getEntrant(s,l)
				.then(function(data){
					self.entrant = data;
					return self.entrant;
				});
		}

		function sport(){
			var s = $state.params.sportId;
			return Sport.getSport(s).then(function(data){
				for(var i in data){
					if(data[i].$id != undefined){
						self.sport[data[i].$id] = data[i].$value;
					}
				}
				return self.sport;
			});
		}

		function teams(){
			return Team.getTeamBulk(self.entrant)
				.then(function(data){
					self.teams = data;
					return self.teams;
				});
		}

		function prelimRef(){
			var s = $state.params.sportId;
			var l = $state.params.league;
			return Prelim.getPrelim(s,l).then(function(data){
				self.prelimRef = data;
				//console.log(self.prelimRef);
				//console.log(data.length);
				return self.prelimRef;
			});
		}

		function prelimScoreRef(){
			var s = $state.params.sportId;
			var l = $state.params.league;
			return PrelimScore.getSportLeagueScore(s,l).then(function(data){
				self.prelimScoreRef = data;
				return self.prelimScoreRef;
			});
		}

		function formatDate(d){
			return (d == '-')? '-' : new Date(d).getTime();
		}

		function noMatches(){
			self.prelim.loaded = true;
			return self.prelim;
		}

		function createRRTable(){
			if(isHigherUps(getAccount('position'))){
				return prelimScoreRef().then(function(){
					return rrTable();
				});	
			}		
		}

		function rrTable(){
			var s = $state.params.sportId;
			var l = $state.params.league;			
			var maxM = ((self.teams.length * self.teams.length) - self.teams.length) / 2;
			var nullIdx = 0;
			var topIdx = 1;
			var btmIdx = 1;
			var topOffset = self.teams.length - 1;
			self.rrTable = [];
			for(var i = 0; i < self.teams.length; i++){
				var temp = [];
				for(var j = 0; j < self.teams.length; j++){
					if(j < nullIdx){
						temp[j] = (j == 0)? topIdx : temp[j-1] + (topOffset - j);
						if(self.prelimRef.length == 0){
							self.prelimSlot['slot'+(temp[j]).toString()] = {
								name : self.teams[j].name + " vs " + self.teams[i].name,
								played: false,
								date: '-',
								protest: '-',
								audience: 0
							};
							self.prelimSlot['slot'+(temp[j]).toString()][self.teams[j].$id] = true;
							self.prelimSlot['slot'+(temp[j]).toString()][self.teams[i].$id] = true;

							self.prelimScore['slot'+(temp[j]).toString()] = {}

							self.prelimScore['slot'+(temp[j]).toString()][self.teams[j].$id] = {
								score: 0,
								spPts: 0,
								result: '-'
							};
							self.prelimScore['slot'+(temp[j]).toString()][self.teams[i].$id] = {
								score: 0,
								spPts: 0,
								result: '-'
							}				
						}
					}else if(j == nullIdx){
						temp[j] = 0;
					}else if(j > nullIdx){
						temp[j] = btmIdx;
						btmIdx++;
					}
				}
				for(var slot in temp){
					temp[slot] = 'slot' + temp[slot].toString();
				}
				self.rrTable.push(temp);
				topIdx = (self.rrTable.length < 2)? topIdx : topIdx + 1;
				nullIdx++;
			}

			//console.log(self.prelimSlot);
			//console.log(self.rrTable);
			//console.log(self.prelimRef);
			if(self.debug) console.log(self.teams);


			if(self.prelimRef.length == 0){
				if(self.debug) console.log('Prelim Empty Creating Table');
				return Prelim.getSportPrelim(s)
					.then(function(data){
						var temp = data.$indexFor(l);
						if(temp == -1){
							data.$ref().child(l).set(self.prelimSlot);
						}else{
							console.log(temp);
						}
						return prelimRef()
							.then(function(data){
								for(var pm in data){
									if(data[pm].$id != undefined){
										self.prelimSlot[data[pm].$id] = data[pm];
									}
								}
								self.prelim['slot'] = self.prelimSlot;
								return PrelimScore.getSportScore(s)
									.then(function(data){
										temp = data.$indexFor(l);
										if(temp == -1){
											data.$ref().child(l).set(self.prelimScore);
										}else{
											console.log(temp);
										}
										return prelimScoreRef()
											.then(function(data){
												for(var sm in data){
													if(data[sm].$id != undefined){
														self.prelimScore[data[sm].$id] = data[sm];
													}
												}
												self.prelim['score'] = self.prelimScore;

												self.prelim['total'] = {};
												for(var ts in self.prelim['score']){
													var teamsFound = 0;
													for(var iidx in self.teams){
														if(self.prelim.score[ts][self.teams[iidx].$id] != undefined){
															if(self.prelim.total[self.teams[iidx].$id] == undefined){
																self.prelim.total[self.teams[iidx].$id]	= {
																	wins: 0,
																	loss: 0
																}								
															}
															if(self.prelim.score[ts][self.teams[iidx].$id].result == 'W'){
																self.prelim.total[self.teams[iidx].$id].wins++;								
															}else if(self.prelim.score[ts][self.teams[iidx].$id].result == 'L'){
																self.prelim.total[self.teams[iidx].$id].loss++;
															}
															teamsFound++;
														}
														if(teamsFound == 2){
															break;
														}
													}
												}

												self.prelim.loaded = true;
												return self.prelim;												
											});
									});
							});
						//console.log(self.prelimSlot);
					});
			}else{
				if(self.debug) console.log('Prelim Found Loading Prelim');
				if(self.prelimRef.length == maxM && self.prelimScoreRef.length == maxM){
					for(var ppm in self.prelimRef){
						if(self.prelimRef[ppm].$id != undefined){
							self.prelimSlot[self.prelimRef[ppm].$id] = self.prelimRef[ppm];
						}
					}
					if(self.debug) console.log(self.prelimSlot);

					//console.log('Ref and mMax equal');
					self.prelim['slot'] = self.prelimSlot;
					for(var psm in self.prelimScoreRef){
						if(self.prelimScoreRef[psm].$id != undefined){
							self.prelimScore[self.prelimScoreRef[psm].$id] = self.prelimScoreRef[psm];
						}
					}
					self.prelim['score'] = self.prelimScore;

					self.prelim['total'] = {};
					for(var ts in self.prelim['score']){
						var teamsFound = 0;
						for(var iidx in self.teams){
							if(self.prelim.score[ts][self.teams[iidx].$id] != undefined){
								if(self.prelim.total[self.teams[iidx].$id] == undefined){
									self.prelim.total[self.teams[iidx].$id]	= {
										wins: 0,
										loss: 0
									}								
								}
								if(self.prelim.score[ts][self.teams[iidx].$id].result == 'W'){
									self.prelim.total[self.teams[iidx].$id].wins++;								
								}else if(self.prelim.score[ts][self.teams[iidx].$id].result == 'L'){
									self.prelim.total[self.teams[iidx].$id].loss++;
								}
								teamsFound++;
							}
							if(teamsFound == 2){
								break;
							}
						}
					}
					//console.log(self.prelim);
					self.prelim.loaded = true;
					return self.prelim;
				}else{
					if(self.debug) console.log('Different teams added after table creation');
					return PrelimScore.getAllTeamsInPrelim(s,l).then(function(data){
						var newPrelim = {
							p: {},
							sc: {}
						};
						var newEntrants = {};
						//console.log(data);
						//console.log(self.entrant.length);
						for(var i = 0; i < self.entrant.length; i++){
							if(data.indexOf(self.entrant[i].$id) < 0){
								newEntrants[self.entrant[i].$id] = {};
							}
						}
						for(var j in newEntrants){
							for(var ja in self.teams){
								if(self.teams[ja].$id == j){
									newEntrants[j].idx = Number(ja);
									newEntrants[j].slots = self.rrTable[ja];
									newEntrants[j].name = self.teams[ja].name;
									continue;									
								}
							}
						}
						if(self.debug) console.log(newEntrants);
						// console.log(self.prelimRef.$getRecord('slot100'));
						// console.log(self.prelimScoreRef);
						// console.log(self.rrTable);
						var slotGuide = setTableNewIndex(createTable(self.teams.length - Object.keys(newEntrants).length), self.rrTable, newEntrants);
						for(var k in slotGuide){
							var kTemp = self.prelimRef.$getRecord(k);
							kTemp.$id = slotGuide[k];
							newPrelim.p[slotGuide[k]] = kTemp; 

							kTemp = self.prelimScoreRef.$getRecord(k);
							kTemp.$id = slotGuide[k];
							newPrelim.sc[slotGuide[k]] = kTemp;
						}
						newPrelim = addNewEntrantSlots(newEntrants, newPrelim);
						// console.log(self.teams);
						// console.log(newPrelim);	
						return Prelim.getPrelimRef().then(function(prelimData){
							if(prelimData.$indexFor(s) < 0){
								prelimData.$ref.child(s+'/'+l).set(newPrelim.p);
							}else{
								prelimData[prelimData.$indexFor(s)][l] = newPrelim.p;
								prelimData.$save(prelimData.$indexFor(s));
							}
							return PrelimScore.ref().then(function(prelimScoreData){
								if(prelimScoreData.$indexFor(s) < 0){
									prelimScoreData.$ref.child(s+'/'+l).set(newPrelim.sc);
								}else{
									prelimScoreData[prelimScoreData.$indexFor(s)][l] = newPrelim.sc;
									prelimScoreData.$save(prelimScoreData.$indexFor(s));
								}

								var pRef = prelimData.$getRecord(s)[l];
								var scRef = prelimScoreData.$getRecord(s)[l];

								self.prelim.score = scRef;
								self.prelim.slot = pRef;
								self.prelim.total = {};

								for(var sc in scRef){
									for(var t in scRef[sc]){
										if(t.indexOf('$') < 0){
											self.prelim.total[t] = (self.prelim.total[t] == undefined)? {wins: 0, loss: 0} : self.prelim.total[t];
											if(scRef[sc][t].result == 'W'){
												self.prelim.total[t].wins++;
											}else if(scRef[sc][t].result == 'L'){
												self.prelim.total[t].loss++;
											}
										}
									}
								}

								return prelimRef().then(function(){
									return prelimScoreRef().then(function(){
										self.prelim.loaded = true;
										return self.prelim;
									});
								});

							});
						});					
					});
				}
			}
		}

		function createTable(n){
			var output = [];
			var max = ((n*n) - n) / 2;
			var topV = 1;
			var btmV = 1;
			for(var row = 0; row < n; row++){
				var temp = [];
				for(var col = 0; col < n; col++){
					if(row == col){
						temp.push(0);
					}else{
						var t = (col == 0)? topV++ : temp[col-1] + (n-1-col);
						//if(row > col) console.log(t);
						var v = (row < col)? btmV++ : t;
						temp.push(v);
					}
				}
				output.push(temp);
			}
			return output.map(function(i){
				return i.map(function(j){
					return 'slot' + j;
				});
			});
		}

		function setTableNewIndex(oldT, newT, newEnt){
			var obj = {};
			var filtered = [];
			var ignoreIdx = [];
			for(var k in newEnt){
				ignoreIdx.push(newEnt[k].idx);
			}
			for(var i in newT){
				var temp = [];
				if(ignoreIdx.indexOf(Number(i)) > -1) continue;
				for(var ii in newT[i]){
					if(ignoreIdx.indexOf(Number(ii)) > -1) continue;
					temp.push(newT[i][ii]);
				}
				filtered.push(temp);
			}
			if(oldT.length == filtered.length){
				for(var col in oldT){
					for(var row in oldT[col]){
						if(oldT[col][row] == 'slot0' || filtered[col][row] == 'slot0') continue;
						obj[oldT[col][row]] = filtered[col][row];
					}
				}
			}else{
				console.log('Not the same length');
				// console.log('Old : ' + oldT.length);
				// console.log('Filtered : ' + filtered.length);
			}
			return obj;
		}

		function addNewEntrantSlots(ent, newP){
			for(var i in ent){
				for(var j in ent[i].slots){
					if(ent[i].slots[j] != 'slot0' && newP.p[ent[i].slots[j]] == undefined){
						newP.p[ent[i].slots[j]] = {
							date: '-',
							played: false,
							protest: '-',
							refs: '-',
							scorekeeper: '-'
						}
						newP.p[ent[i].slots[j]][i] = true;
						newP.p[ent[i].slots[j]][self.teams[j].$id] = true;
						newP.p[ent[i].slots[j]].name = self.teams[j].name + ' vs ' + ent[i].name;
						
						newP.sc[ent[i].slots[j]] = {};
						newP.sc[ent[i].slots[j]][i] = {
							result: '-',
							score: 0,
							spPts: 0
						}
						newP.sc[ent[i].slots[j]][self.teams[j].$id] = {
							result: '-',
							score: 0,
							spPts: 0
						}					
					}
				}
			}
			return newP;
		}

		function goPrelimSlot(slot){
			if(self.auth.$getAuth != undefined && isHigherUps(getAccount('position'))){
				var temp = {
					sportId: $state.params.sportId,
					league: $state.params.league,
					slot: slot
				}
				$state.go('prelimInfo',temp);
			}
		}

		function isHigherUps(pos){
			var h = ['adm', 'adv', 'dir', 'boa'];
			return (pos != '' && pos != undefined)? (h.indexOf(pos) > -1) : false;
		}

		function getAccount(key){
			return (self.account.length > 0 && self.auth.$getAuth() != undefined)? self.account.$getRecord(self.auth.$getAuth().uid)[key] : '';
		}

		function isLoggedin(){
			return (self.auth.$getAuth() != undefined);
		}

		function goEntrant(){
			var s = $state.params.sportId;
			var l = $state.params.league;
			$state.go('entrant',{sportId: s, league: l});
		}

	}
}());