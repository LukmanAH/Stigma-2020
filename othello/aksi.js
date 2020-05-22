var END = 10001;

var TIMESUP = 10000;

var BASECASE = 20;

var MOVELISTSIZE = 2;

var ANDCONST = -8;

var INFINITE = 1000000;

var LASTSAMURAI = 5;



var allAboard = [];

for (var i = 0; i < 8; i++) {

	allAboard[i] = [0,0,0,0,0,0,0,0];

}

var reesesPieces;

var mexicanStandoff;



var col = [-1,0,1,-1,1,-1,0,1];

var row = [-1,-1,-1,0,0,1,1,1];



var turnPresent = 2;

var turnItUp = 1;

var TuringTest = [0,0];

var evidence = [];

for (var i = 0; i < 65*MOVELISTSIZE; i++) {

	evidence[i] = 0;

}

var endOfTime;

var start, end;

var thetwo = [0,0];

var nodeOverload = 0;

var chaosControl = 0;

var canStartTheFunk = 1;



function countAllPieces() {

	reesesPieces = 0;



	for(var i = 0; i < 8; ++i) {

		for (var j = 0; j < 8; ++j) {

			if (allAboard[i][j] == 0 || allAboard[i][j] == 3)

				reesesPieces++; 

		}

	}

};



var text = {

	human: {

		win: "CONGRATULATIONS %s! YOU ARE A COOL GUY",

		lose: "%s %s'D OUT! LOST $250"

	},

	robot: {

		win: "%s: I'VE WON. JUST AS PLANNED",

		lose: "%s: SYSTEM ERROR! SYSTEM ERROR! SYSTKJLSDFHSDFSO8YIHUITBFUIWOPLDHFHWWW...........",

		tie: "%s: SUCH A STRANGE GAME. THE ONLY WINNING MOVE IS NOT TO PLAY"

	}

};



function reinventThePrintfWheel(str) {

	for (var i = 1; i < arguments.length; i++) {

		str = str.replace(/%s/,arguments[i]);

	}

	return str;

};



function speakerForTheDead(guy) {

	var box = ["#player-white .player-text","#player-black .player-text","#announcer-text"];

	var thisbox = $(box[guy]);

	var lineargs = Array.prototype.slice.call(arguments,1);

	var line = reinventThePrintfWheel.apply(this,lineargs);

	thisbox.val(thisbox.val() + line + "\n");

	thisbox.scrollTop(thisbox[0].scrollHeight);

};


//menghitung point
function andTheWinnerIs() {

	var white = 0;

	var black = 0;

	var winna = 0;

	var playa = ["WHITE","BLACK","ANNOUNCER"];



	for(var i = 0; i < 8; ++i) {

		for (var j = 0; j < 8; ++j) {

			if (allAboard[i][j] == 1)

				++white;

			else if (allAboard[i][j] == 2)

				++black;

		}

	}

	var points = Math.abs(white - black);


	//juka seri
	if (white == black) {

		//speakerForTheDead(2,"TIE!");

		//for (var i = 0; i < 2; i++) {

			if (TuringTest[0] == 1) speakerForTheDead(2,text.robot.tie,playa[i]);

		//}

		return;

	} else if (white < black) { //hitam menang

		winna = 1;

	}

	var losa = (winna+1)%2;



	speakerForTheDead(2,"%s Menang Dengan " + points + " POINTS!",playa[winna]);

	// for (var i = 0; i < 2; i++) {

	// 	if (i == winna) {

	// 		if (TuringTest[i] == 1) speakerForTheDead(i,text.robot.win,playa[i]);

	// 		else speakerForTheDead(i,text.human.win,playa[i]);

	// 	} else {

	// 		if (TuringTest[i] == 1) speakerForTheDead(i,text.robot.lose,playa[i]);

	// 		else speakerForTheDead(i,text.human.lose,playa[winna],playa[losa]);

	// 	}

	// }

};



function onceAndFutureKing(Boardom, turn) {

	var guy = 0;

	var otherGuy = 0;

	

	for(var i = 0; i < 8; ++i) {

		for (var j = 0; j < 8; ++j) {

			if (Boardom[i][j] == turn)

				++guy;

			else if (Boardom[i][j] == seatChange(turn))

				++otherGuy;

		}

	}

	

	return (guy-otherGuy);

};



function seatChange(turn) {

	if (turn == 1) ++turn;

	else --turn;

	return turn;

};



function changeSeats() {

	turnPresent = seatChange(turnPresent);

	$('.player .player-title').each( function() {

		var playa = $(this);

		if (playa.hasClass('active')) playa.removeClass('active');

		else playa.addClass('active');

	});

	

}



function wrongMove(gameBoard,i,j,l,m,turn,points) {



	if (gameBoard[i][j] == 0 || gameBoard[i][j] == 3) {

		return 0;

	}

	else if (gameBoard[i][j] == turn) {

		if (gameBoard[l][m] == turn) return 0;

		else return -points;

	}

	else {

		if (gameBoard[l][m] == seatChange(turn)) return 0;

		else return points;

	}

}



function legalMovesHO(gameBoard,legalMoves,turn) {

	var val = 0;

	var i = 0;

	

	while (legalMoves[i] != END) {

		++val;

		i += MOVELISTSIZE;

	}

	

	i = 0;

	legalLoophole(gameBoard, seatChange(turn), legalMoves);

	

	while (legalMoves[i] != END) {

		--val;

		i += MOVELISTSIZE;

	}

	

	return val;

};



function checkRowCol(gameBoard,turn) {

	var val = 0;

	var other = seatChange(turn);

	

	for (var i = 2; i < 6; ++i) {

		if (gameBoard[0][i] == turn) ++val;

		else if (gameBoard[0][i] == other) --val;

		

		if (gameBoard[7][i] == turn) ++val;

		else if (gameBoard[7][i] == other) --val;

		

		if (gameBoard[i][0] == turn) ++val;

		else if (gameBoard[i][0] == other) --val;

		

		if (gameBoard[i][7] == turn) ++val;

		else if (gameBoard[i][7] == other) --val;

	}

	

	return val;

};



function heurapeanOnMyBoots(gameBoard, turn, legalMoves, movesLeft) {

	var val = 0;

	var dummy = [0,0,0];

	

	if (movesLeft <= 0)

		return END*onceAndFutureKing(gameBoard, turn);



	for (var i = 0; i < 8; i += 7) {	

		for (var j = 0; j < 8; j += 7) {

			if (gameBoard[i][j] == 0) {

				if (Objection(gameBoard, i, j, seatChange(turn), BASECASE, dummy, 0) == 1)

					val -= 100;

			}

			else if (gameBoard[i][j] == turn)

				val += 100;

			else if (gameBoard[i][j] == 3) {

				if (Objection(gameBoard, i, j, seatChange(turn), BASECASE, dummy, 0) == 1)

					val -=100;

				else

					val +=100;

			}

			else

				val -= 100;

		}

	}

		

	val += wrongMove(gameBoard,1,1,0,0,turn,50);

	val += wrongMove(gameBoard,6,1,7,0,turn,50);

	val += wrongMove(gameBoard,1,6,0,7,turn,50);

	val += wrongMove(gameBoard,6,6,7,7,turn,50);

	

	val += wrongMove(gameBoard,0,1,0,0,turn,10);

	val += wrongMove(gameBoard,1,0,0,0,turn,10);

	val += wrongMove(gameBoard,0,6,0,7,turn,10);

	val += wrongMove(gameBoard,7,1,7,0,turn,10);

	val += wrongMove(gameBoard,6,0,7,0,turn,10);

	val += wrongMove(gameBoard,1,7,0,7,turn,10);

	val += wrongMove(gameBoard,7,6,7,7,turn,10);

	val += wrongMove(gameBoard,6,7,7,7,turn,10);

	

	val += legalMovesHO(gameBoard, legalMoves, turn);

	val += checkRowCol(gameBoard, turn);



	return val;

};



function theWolfPack(gameBoard,depth,alpha,beta,legalMoves,turn,movesLeft) {

	var evidence = [];

	var copyBoard = [];

	var newAlpha;	



	++nodeOverload;

	if (nodeOverload > 2000) {

		nodeOverload = 0;

		if ((new Date().getTime())-start > endOfTime) {

			return TIMESUP;

		}

	}



	if (depth == 0) {

		return heurapeanOnMyBoots(gameBoard, turn, legalMoves, movesLeft);

	}

	else if (legalMoves[0] == END) {

		//cout << "TRAPCARD!";

		legalLoophole(gameBoard, seatChange(turn), evidence);

		if (evidence[0] == END)

			return END*onceAndFutureKing(gameBoard, turn);	//May be a problem here, check later

		

		newAlpha = -theWolfPack(gameBoard, depth, -beta, -alpha, evidence, seatChange(turn), movesLeft); //May have to be depth -1, not just depth

		alpha = (alpha<newAlpha)?newAlpha:alpha;



		return alpha;

	}

	

	var k = 0;

	while (legalMoves[k] != END) {

		for(var i = 0; i < 8; ++i) {

			copyBoard[i] = [];

			for (var j = 0; j < 8; ++j) {

				copyBoard[i][j] = gameBoard[i][j];

			}

		}

		copyBoard[legalMoves[k]][legalMoves[k+1]] = turn;

		Judas(copyBoard, legalMoves[k], legalMoves[k+1], turn, BASECASE);

		legalLoophole(copyBoard, seatChange(turn), evidence);

		

		newAlpha = -theWolfPack(copyBoard, depth-1, -beta, -alpha, evidence, seatChange(turn), movesLeft - 1);

		if (Math.abs(newAlpha) == TIMESUP)

			return TIMESUP;

		

		alpha = (alpha<newAlpha)?newAlpha:alpha;

		

		if (beta <= alpha)

			break;

		

		k += MOVELISTSIZE;

	}

	

	return alpha;

}



function Joshua(funkyBunch) {



	if (funkyBunch) {

		readySteadyGO(8,8);

		return;

	}



	var k;

	var alpha;

	var move = 0;

	var tempMove = 0;

	var newAlpha = 0;

	var copyBoard = [];

	var moves = [];

	var divConst = 2;

	var inc = 0;

	var limit = reesesPieces;



	start = new Date().getTime();

	

	if (evidence[MOVELISTSIZE] != END) {



//		speakerForTheDead(turnPresent-1,"SWORD OF OMENS, GIVE ME SIGHT BEYOND SIGHT!");

	

		for(inc = 0; inc < limit; ++inc) {

			k = 0;

			alpha = -INFINITE;

			while (evidence[k] != END) {

				for(var i = 0; i < 8; ++i) {

					copyBoard[i] = [];

					for (var j = 0; j < 8; ++j) {

						copyBoard[i][j] = allAboard[i][j];

					}

				}

				copyBoard[evidence[k]][evidence[k+1]] = turnPresent;

				Judas(copyBoard, evidence[k], evidence[k+1], turnPresent, BASECASE);

				legalLoophole(copyBoard, seatChange(turnPresent), moves);

		

				newAlpha = -theWolfPack(copyBoard, inc, -INFINITE, INFINITE, moves, seatChange(turnPresent), reesesPieces - 1);

				

				if (Math.abs(newAlpha) == TIMESUP) {

					tempMove = -1;

					break;

				}

					

				if (newAlpha > alpha) {

					alpha = newAlpha;

					tempMove = k;

					divConst = 2;

				}

				else if (newAlpha == alpha) {

					if (Math.random()*100 < 99/divConst) {

						alpha = newAlpha;

						tempMove = k;

					}

					++divConst;

				}

				

				k += MOVELISTSIZE;

			}

			

			if (tempMove >= 0)

				move = tempMove;

				

			if ((new Date().getTime())-start > endOfTime) {

				break;

			}

		}

	}



//	var futureTalk = "I'm already " + inc + " steps ahead of you";

//	if (!inc) futureTalk = "We're gonna do one move and one move only";

//	speakerForTheDead(turnPresent-1,futureTalk);

	readySteadyGO(evidence[move],evidence[move+1]);

};



function castFirstStone(turn) {

	var playas = ["#player-white", "#player-black"];

	$('.player-title').removeClass('active');

	$(playas[turn-1]+" .player-title").addClass('active');

	turnPresent = turn;

	markyMark();

	showAndTell();

	countAllPieces();

}



function zeroWing() {

	for (var i = 0; i < 8; i++) {

		for (var j = 0; j < 8; j++) {

			allAboard[i][j] = 0;

		}

	}



	allAboard[3][3] = 1;

	allAboard[3][4] = 2;

	allAboard[4][3] = 2;

	allAboard[4][4] = 1;



	turnItUp = 1;

	mexicanStandoff = 0;

	endOfTime = 1000;

	thetwo = [0,0];



	castFirstStone(2);

};



function mrResetti() {

	if (chaosControl) clearTimeout(chaosControl);

	start = 0;

	zeroWing();

	$('textarea').val('');

	$("#dynoStyle").text('');

	canStartTheFunk = 1;

};



function superStart() {

	if (canStartTheFunk) {

		canStartTheFunk = 0;

		var stylin = "#start {cursor: auto; background:gray}";

		stylin += ".human, .cpu {cursor: auto;}";

		stylin += ".active {background: gray;}";

		stylin += ".player-title {cursor: auto}";

		$("#dynoStyle").text(stylin);

		readySteadyGO(-1,-1);

	}

};



function initialD() {

	var cellnum = 0;

	for (var i = 0; i < 8; i++) {

		var row = $('<div class="row" id="row'+i+'"></div>');

		for (var j = 0; j < 8; j++) {

			var cell = $('<div data-row='+i+' data-column='+j+' class="cell" id="cell'+cellnum+'"><div class="piece"></div></div>');

			cellnum++;

			row.append(cell);

		}

		$('.gameboard').append(row);

	}

	

	$("head").append("<style id='dynoStyle'></style>");



	$('.cell').bind('click', function() {

		if (!canStartTheFunk)

			readySteadyGO($(this).data('row'),$(this).data('column'),0);

	});

	$('.human, .cpu').bind('click', function() {

		if (canStartTheFunk) {

			var that = $(this);

			that.siblings().removeClass('active');

			that.addClass('active');

			if (that.hasClass('human'))

				TuringTest[that.data('player')] = 0

			else

				TuringTest[that.data('player')] = 1

		}

	});



	$('.player-title').bind('click', function() {

		if (canStartTheFunk) {

			if ($(this).parent().attr('id') == "player-white") castFirstStone(1);

			else castFirstStone(2);

		}

	});



	$('#reset').bind('click', function() {

		mrResetti();

	});



	$('#start').bind('click', function() {

		superStart();

	});



	zeroWing();

};



function Objection(gameBoard,i,j,turn,base,evidence,evidenceStack) {

	var newi, newj;

	switch(base) {

		case BASECASE:

			for (var k = 0; k < 8; ++k) {

				newi = i + row[k];

				newj = j + col[k];

				

				if (newi & ANDCONST || newj & ANDCONST)

					continue;

				else if (gameBoard[newi][newj] == 0 || gameBoard[newi][newj] == 3)

					continue;

				else if (gameBoard[newi][newj] != turn) {

					if (Objection(gameBoard, newi, newj, turn, k, evidence, evidenceStack) == 1) {

						evidence[evidenceStack++] = i;

						evidence[evidenceStack++] = j;

						evidence[evidenceStack] = END;

						return 1;

					}

					else continue;

				}

			}

			break;

		default:

			newi = i + row[base];

			newj = j + col[base];

			

			if (newi & ANDCONST || newj & ANDCONST)

				return 0;

			else if (gameBoard[newi][newj] == turn) {

				return 1;

			}

			else if (gameBoard[newi][newj] == 0 || gameBoard[newi][newj] == 3)

					return 0;

			else if (gameBoard[newi][newj] != turn) {

				return Objection(gameBoard, newi, newj, turn, base, evidence, evidenceStack);

			}

	}

	

	gameBoard[i][j] = 0;

	return 0;

};



function Judas(gameBoard,i,j,turn,base) {

	var newi, newj;

	

	switch(base) {

		case BASECASE:

			for (var k = 0; k < 8; ++k) {

				newi = i + row[k];

				newj = j + col[k];

				

				if (newi & ANDCONST || newj & ANDCONST)

					continue;

				else if (gameBoard[newi][newj] == 0 || gameBoard[newi][newj] == 3) {

					continue;

				}

				else if (gameBoard[newi][newj] != turn) {

					Judas(gameBoard, newi, newj, turn, k);

				}

			}

			break;

		default:

			newi = i + row[base];

			newj = j + col[base];

			

			if (newi & ANDCONST || newj & ANDCONST)

				return 0;

			else if (gameBoard[newi][newj] == turn) {

				gameBoard[i][j] = turn;

				return 1;

			}

			else if (gameBoard[newi][newj] == 0 || gameBoard[newi][newj] == 3)

					return 0;

			else if (gameBoard[newi][newj] != turn) {

				if (Judas(gameBoard, newi, newj, turn, base) == 1){

					gameBoard[i][j] = turn;

					return 1;

				}

			}

	}

	return 0;

};



function cleanAndClear(gameBoard) {

	for(var i = 0; i < 8; ++i) {

		for (var j = 0; j < 8; ++j) {

			if (gameBoard[i][j] == 3) {

				gameBoard[i][j] = 0;

			}

		}

	}

};



function legalLoophole(gameBoard,turn,evidence) {

	cleanAndClear(gameBoard);

	evidence[0] = END;

	var evidenceStack = 0;



	for(var i = 0; i < 8; ++i) {

		for (var j = 0; j < 8; ++j) {

			if (gameBoard[i][j] == 0) {

				if (Objection(gameBoard, i, j, turn, BASECASE, evidence, evidenceStack) == 1) {

					gameBoard[i][j] = 3;

					evidenceStack += MOVELISTSIZE;

				}	

			}

		}

	}

	

	return evidence[0];

};


//proses
function onBoard() {

	var cellnum = 0;

	for (var i = 0; i < 8; i++) {

		for (var j = 0; j < 8; j++) {

			var cell = $('#cell'+cellnum);

			cell.removeClass('white black open-move last-move');

			switch(allAboard[i][j]) {

				case 1 + LASTSAMURAI:

					cell.addClass('last-move');

				case 1:

					cell.addClass('white');

					break;

				case 2 + LASTSAMURAI:

					cell.addClass('last-move');

				case 2:

					cell.addClass('black');

					break;

				case 3:

					cell.addClass('open-move');

					break;

			}

			cellnum++;

		}

	}

};



function markyMark() {



	if (legalLoophole(allAboard, turnPresent, evidence) == END) {

		if (mexicanStandoff == 1) {

			allAboard[thetwo[0]][thetwo[1]] += LASTSAMURAI;

			onBoard(allAboard);

			allAboard[thetwo[0]][thetwo[1]] -= LASTSAMURAI;

			return 2;

		}

		else {

			allAboard[thetwo[0]][thetwo[1]] += LASTSAMURAI;

			onBoard(allAboard);

			allAboard[thetwo[0]][thetwo[1]] -= LASTSAMURAI;

			mexicanStandoff = 1;

			return 1;

		}

	}

	

	mexicanStandoff = 0;

	return 0;

};



function showAndTell() {

	allAboard[thetwo[0]][thetwo[1]] += LASTSAMURAI;

	onBoard(allAboard);

	allAboard[thetwo[0]][thetwo[1]] -= LASTSAMURAI;

}



function theGame(row,col) {

	var playa = ["WHITE","BLACK"];

	if (row+col >= 0) {

		if (row & ANDCONST || col & ANDCONST) {

			return markyMark();

		}


		if (!TuringTest[turnPresent-1] && allAboard[row][col] != 3) {

			return 3;

		}



		allAboard[row][col] = turnPresent;

		thetwo[0] = row;

		thetwo[1] = col;

		reesesPieces--;

		Judas(allAboard, row, col, turnPresent, BASECASE);

		speakerForTheDead(2,"%s Melangkah Ke Baris %s, Kolom %s!",playa[turnPresent-1],row,col);

		speakerForTheDead(2,"------");

		changeSeats();

		turnItUp++;

	}

	return markyMark();

};



function readySteadyGO(row,col) {



	var funkyBunch = 0;



	if (reesesPieces > 0) {

		

		var test = theGame(row,col);

		showAndTell();



		if (test == 3) return;

		else if (reesesPieces <= 0) {

			andTheWinnerIs();

			return;

		} else if (test == 2) {

			andTheWinnerIs();

			return;

		} else if (test == 1) {

			changeSeats();

			funkyBunch = markyMark();

			showAndTell();

		}

	

	} else {

		andTheWinnerIs();

		return;

	}





	if (!funkyBunch) {

		speakerForTheDead(2,"TURN " + turnItUp + ":");

	} else {

		andTheWinnerIs();

		return;

	}



	if (TuringTest[turnPresent-1]) {

		chaosControl = setTimeout(function() {

			Joshua(funkyBunch);

		}, 10);

	}

};



$(document).ready(function() {

	initialD();	

});