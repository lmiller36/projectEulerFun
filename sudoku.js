var express = require('express');
// var combinations = require('./combination.js')();

var app = express();
app.use(express.static(__dirname + '/')); //__dir and not _dir
var port = 8000; // you can use any port
app.listen(port);
console.log('server on ' + port);

var fs = require('fs');

var total = 0;

readInBoards();
function readInBoards(){
	readTextFile("sudoku.txt",(file)=>{
		var boards = {};
		var split = file.split("\n");
		var board = 0;
		for(var i = 0; i < split.length;i++){
			if(i % 10 == 0){
				board++;
				boards[board] = [];
			}
			else{
				boards[board].push(split[i].split("").map((x)=>parseInt(x)));
			}

		}



		var solved = 0;

		for(var i = 1;i <= Object.keys(boards).length;i++){
					// console.log(i);
				var board = solveBoard(boards[i]);
			// if(i == 10){
				total += parseInt(board[0][0]) * 100 + parseInt(board[0][1]) * 10 + parseInt(board[0][2]);
			// }
		}

		console.log(solved+"/"+(Object.values(boards).length));
		console.log(total);
	})
}

function solveBoard(board){
	// try simple approach
	var board_simpleSolved = solveSimpleBoard(board);
	if(isSolved(board_simpleSolved))return board_simpleSolved;

	//try a bit more
	board = solveBoard_no_recursion(board);
	if(isSolved(board))return board;

	// may be time to try guessing
	var output = generateStartingOptions(board);
	var options = output[0];
	var oneOption = output[1];
	// console.log(options);	

	// try guessing all options
	for(var i = 0;i < 9;i++){
		for(var j = 0;j < 9;i++){
			var arr = Array.from(options[i][j]);
			if(arr.length > 1){
				for(var k = 0;k < arr.length;k++){
					var copy_board = JSON.parse(JSON.stringify(board));
					copy_board[i][j] = arr[k];
					copy_board = solveBoard_no_recursion_possibly_wrong(copy_board);

					if(copy_board != false && isSolved(copy_board)){
						return copy_board;
					}
				}
			}
		}
	}

	return false;

}

function solveBoard_no_recursion_possibly_wrong(board){

	// board = solveSimpleBoard(board);


	var output = generateStartingOptions(board);
	var options = output[0];
	var oneOption = output[1];

	var output2 = generateRowColSqOptions(board,options);
	var rows,cols,sqs,solvedNums;
	rows = output2[0];
	cols = output2[1];
	sqs = output2[2];
	solvedNums = output2[3];

	var oneOption2 = [];
	while(solvedNums.length > 0 || oneOption.length > 0){
		if(solvedNums.length != 0){
			var i_j_value_pair = solvedNums.splice(0,1)[0];
			var i,j,value;
			i = i_j_value_pair[0];
			j = i_j_value_pair[1];
			if(board[i][j] == 0){
				value = i_j_value_pair[2];
				board[i][j] = value;
				var out = removeFromAll_simple(i,j,value,options);

				out.forEach((pair)=>{
					if(board[pair[0]][pair[1]] == 0){
						oneOption.push(pair);
					}
				})
			}
		}
		else{
			var i_j_pair = oneOption.splice(0,1)[0];
			var i = i_j_pair[0];
			var j = i_j_pair[1];
			var value = Array.from(options[i][j])[0];
			
			if(board[i][j] == 0){
				board[i][j] = value;
				var out = removeFromAll_simple(i,j,value,options);
				out.forEach((pair)=>{
					if(board[pair[0]][pair[1]] == 0){
						oneOption.push(pair);
					}
				})
			}

		}

		if(!(solvedNums.length > 0 || oneOption.length > 0)){
			output2 = generateRowColSqOptions_possibly_wrong(board,options);
			if(output2 == false) return false;
			// rows = output2[0];
			// cols = output2[1];
			sqs = output2[2];

			solvedNums = output2[3];

			// drastic measures
			if(solvedNums.length == 0){
				sqs = output2[2];
				for(var x = 1; x<=9;x++){
					for(var sq = 0; sq < 9;sq++){
						var sqOptions = sqs[sq][x]
						if(sqOptions.size > 1){
							var sameRow = 10;
							var sameCol = 10;
							var c = 0;
							while(c < sqOptions.size && (sameRow >= 0 || sameCol >= 0)){
								var currRow,currCol,value;
								sqNum = Array.from(sqOptions)[c];
								var i_j = sqNumToIJ(sq,sqNum);
								if(c == 0){
									sameRow = i_j[0];
									sameCol = i_j[1];
								}
								else{
									if( i_j[0] != sameRow) sameRow = -1;
									if( i_j[1] != sameCol) sameCol = -1;
								}
								c++;
							}

							if(sameCol != -1){
								for(var y = 0;y < 9;y++){
									var sqNum2 = getSqNumber(y,sameCol);
									if(sqNum2[0] != sq && board[y][sameCol] == 0){
										options[y][sameCol].delete(x)
									}
								}
							}
							if(sameRow != -1){
								for(var y = 0;y < 9;y++){
									var sqNum2 = getSqNumber(sameRow,y);
									if(sqNum2[0] != sq && board[sameRow][y] == 0){
										options[sameRow][y].delete(x);
									}
								}
							}

							output2 = generateRowColSqOptions(board,options);

							rows = output2[0];
							cols = output2[1];
							sqs = output2[2];

							solvedNums = output2[3];

						}
					}
				}
			}
		}
	}
return board;
}

function solveBoard_no_recursion(board){

	// board = solveSimpleBoard(board);


	var output = generateStartingOptions(board);
	var options = output[0];
	var oneOption = output[1];

	var output2 = generateRowColSqOptions(board,options);
	var rows,cols,sqs,solvedNums;
	rows = output2[0];
	cols = output2[1];
	sqs = output2[2];
	solvedNums = output2[3];

	var oneOption2 = [];
	while(solvedNums.length > 0 || oneOption.length > 0){
		if(solvedNums.length != 0){
			var i_j_value_pair = solvedNums.splice(0,1)[0];
			var i,j,value;
			i = i_j_value_pair[0];
			j = i_j_value_pair[1];
			if(board[i][j] == 0){
				value = i_j_value_pair[2];
				board[i][j] = value;
				var out = removeFromAll_simple(i,j,value,options);

				out.forEach((pair)=>{
					if(board[pair[0]][pair[1]] == 0){
						oneOption.push(pair);
					}
				})
			}
		}
		else{
			var i_j_pair = oneOption.splice(0,1)[0];
			var i = i_j_pair[0];
			var j = i_j_pair[1];
			var value = Array.from(options[i][j])[0];
			
			if(board[i][j] == 0){
				board[i][j] = value;
				var out = removeFromAll_simple(i,j,value,options);
				out.forEach((pair)=>{
					if(board[pair[0]][pair[1]] == 0){
						oneOption.push(pair);
					}
				})
			}

		}

		if(!(solvedNums.length > 0 || oneOption.length > 0)){
			output2 = generateRowColSqOptions(board,options);
			// rows = output2[0];
			// cols = output2[1];
			sqs = output2[2];

			solvedNums = output2[3];

			// drastic measures
			if(solvedNums.length == 0){
				sqs = output2[2];
				for(var x = 1; x<=9;x++){
					for(var sq = 0; sq < 9;sq++){
						var sqOptions = sqs[sq][x]
						if(sqOptions.size > 1){
							var sameRow = 10;
							var sameCol = 10;
							var c = 0;
							while(c < sqOptions.size && (sameRow >= 0 || sameCol >= 0)){
								var currRow,currCol,value;
								sqNum = Array.from(sqOptions)[c];
								var i_j = sqNumToIJ(sq,sqNum);
								if(c == 0){
									sameRow = i_j[0];
									sameCol = i_j[1];
								}
								else{
									if( i_j[0] != sameRow) sameRow = -1;
									if( i_j[1] != sameCol) sameCol = -1;
								}
								c++;
							}

							if(sameCol != -1){
								for(var y = 0;y < 9;y++){
									var sqNum2 = getSqNumber(y,sameCol);
									if(sqNum2[0] != sq && board[y][sameCol] == 0){
										options[y][sameCol].delete(x)
									}
								}
							}
							if(sameRow != -1){
								for(var y = 0;y < 9;y++){
									var sqNum2 = getSqNumber(sameRow,y);
									if(sqNum2[0] != sq && board[sameRow][y] == 0){
										options[sameRow][y].delete(x);
									}
								}
							}

							output2 = generateRowColSqOptions(board,options);

							rows = output2[0];
							cols = output2[1];
							sqs = output2[2];

							solvedNums = output2[3];

						}
					}
				}
			}
		}
	}
return board;
}

function checkValidNumbers(board){
	var options = generateStartingOptions(board)[0];
	for(var i = 0;i < 9;i++){
		for(var j = 0;j < 9;j++){
			if(options[i][j].size == 0)
				return false;
		}
	}
	if(!generateRowColSqOptions(board,options)) return false;
	return true;

}

function generateRowColSqOptions_possibly_wrong(board,options){
	var rows = [];
	var cols = [];
	var sqs = [];
	for(var x = 0;x < 9;x++){
		rows[x] = {};
		cols[x] = {};
		sqs[x] = {};
		for(var j = 1; j <= 9;j++){
			rows[x][j] = new Set();
			cols[x][j] = new Set();
			sqs[x][j] = new Set();
		}
	}



	// remove numbers already used
	for(var i = 0;i < 9;i++){
		for(var j = 0; j < 9;j++){
			var value = board[i][j];
			var sqArr = getSqNumber(i,j);
			if(value != 0){
				if(!rows[i][value] ||!rows[j][value]) return false;
				rows[i][value].add(j)
				cols[j][value].add(i);
				sqs[sqArr[0]][value].add(sqArr[1]);
				// removeNumberFromAllOptions(i,j,value,rows,cols,sqs);
			}
			else{
				Array.from(options[i][j]).forEach((option)=>{
					rows[i][option].add(j);
					cols[j][option].add(i);
					sqs[sqArr[0]][option].add(sqArr[1]);

				});
			}
		}
	}

	var solvedNums = [];
	for(var x = 0;x < 9;x++){
		for(var value = 1; value <= 9;value++){
			if(rows[x][value].size == 1){
				var j = Array.from(rows[x][value])[0];
				if(board[x][j] == 0){
					solvedNums.push([x,j,value,"row"]);
				}
			}
			if(cols[x][value].size == 1){
				var i = Array.from(cols[x][value])[0]; 
				if(board[i][x] == 0){ 
					solvedNums.push([i,x,value,"col"]);
				}
			}
			if(sqs[x][value].size == 1){
				var sqNum = Array.from(sqs[x][value])[0];
				var toIJArr = sqNumToIJ(x,sqNum);
				var i = toIJArr[0];
				var j = toIJArr[1];
				if(board[i][j] == 0){
					solvedNums.push([i,j,value,"sq"]);
				}
			}
		}
	}

	return [rows,cols,sqs,solvedNums];
}


function generateRowColSqOptions(board,options){
	var rows = [];
	var cols = [];
	var sqs = [];
	for(var x = 0;x < 9;x++){
		rows[x] = {};
		cols[x] = {};
		sqs[x] = {};
		for(var j = 1; j <= 9;j++){
			rows[x][j] = new Set();
			cols[x][j] = new Set();
			sqs[x][j] = new Set();
		}
	}



	// remove numbers already used
	for(var i = 0;i < 9;i++){
		for(var j = 0; j < 9;j++){
			var value = board[i][j];
			var sqArr = getSqNumber(i,j);
			if(value != 0){
				rows[i][value].add(j)
				cols[j][value].add(i);
				sqs[sqArr[0]][value].add(sqArr[1]);
				// removeNumberFromAllOptions(i,j,value,rows,cols,sqs);
			}
			else{
				Array.from(options[i][j]).forEach((option)=>{
					rows[i][option].add(j);
					cols[j][option].add(i);
					sqs[sqArr[0]][option].add(sqArr[1]);

				});
			}
		}
	}

	var solvedNums = [];
	for(var x = 0;x < 9;x++){
		for(var value = 1; value <= 9;value++){
			if(rows[x][value].size == 1){
				var j = Array.from(rows[x][value])[0];
				if(board[x][j] == 0){
					solvedNums.push([x,j,value,"row"]);
				}
			}
			if(cols[x][value].size == 1){
				var i = Array.from(cols[x][value])[0]; 
				if(board[i][x] == 0){ 
					solvedNums.push([i,x,value,"col"]);
				}
			}
			if(sqs[x][value].size == 1){
				var sqNum = Array.from(sqs[x][value])[0];
				var toIJArr = sqNumToIJ(x,sqNum);
				var i = toIJArr[0];
				var j = toIJArr[1];
				if(board[i][j] == 0){
					solvedNums.push([i,j,value,"sq"]);
				}
			}
		}
	}

	return [rows,cols,sqs,solvedNums];
}



function sqNumToIJ(sq,inSqNum){
	var baseI,baseJ,i,j;
	baseI = Math.trunc(sq / 3) * 3;
	baseJ = 3 * (sq % 3);

	i = baseI + Math.trunc(inSqNum / 3);
	j = baseJ + (inSqNum % 3);

	return [i,j];

}

function getSqNumber(i,j){
	var sq = Math.trunc(i / 3) * 3 + Math.trunc(j/3);
	var startI = i - Math.trunc(i / 3) * 3;
	var startJ = j - Math.trunc(j / 3) * 3;
	var inSqNum = startI * 3 + startJ;
	return [sq,inSqNum];
}

function printBoard(board){
	for(var i = 0;i < 9;i++){
		var str = "";
		for(var j = 0;j < 9;j++){
			str += board[i][j]+" ";
			if(j % 3 == 2 && j != 8)
				str+="| ";
		}
		console.log(str);
		if(i % 3 == 2 && i != 8){
			console.log("---------------------");
		}
	}
	console.log("\n\n");
}

function removeFromAll_simple(row,column,number,options){
	var oneOption = [];
	// console.log(row+" "+column+" "+number);
	var startISq = Math.trunc(row / 3) * 3;
	var startJSq =  Math.trunc(column / 3) * 3;
	for(var x = 0;x < 9;x++){
		var sqI = startISq + Math.trunc(x / 3);
		var sqJ = startJSq + x % 3;
		options[row][x].delete(number);
		options[x][column].delete(number);
		options[sqI][sqJ].delete(number);
		if(options[row][x].size == 1) oneOption.push([row,x]);
		if(options[x][column].size == 1) oneOption.push([x,column]);
		if(options[sqI][sqJ].size == 1) oneOption.push([sqI,sqJ]);
	}
	return oneOption;
}

function removeFromAll(row,column,number,options,allToOptions){
	var oneOption = [];
	// console.log(row+" "+column+" "+number);
	var startISq = Math.trunc(row / 3) * 3;
	var startJSq =  Math.trunc(column / 3) * 3;
	var sq = Math.trunc(row / 3) * 3 + Math.trunc(column / 3);
	allToOptions['row'][row][number] = 0;
	allToOptions['col'][column][number] = 0;
	allToOptions['sq'][sq][number] = 0;
	for(var x = 0;x < 9;x++){
		var sqI = startISq + Math.trunc(x / 3);
		var sqJ = startJSq + x % 3;
		var currSq = Math.trunc(x / 3) * 3 + Math.trunc(x / 3);
		options[row][x].delete(number);
		options[x][column].delete(number);
		options[sqI][sqJ].delete(number);
		if(options[row][x].size == 1) oneOption.push([row,x]);
		if(options[x][column].size == 1) oneOption.push([x,column]);
		if(options[sqI][sqJ].size == 1) oneOption.push([sqI,sqJ]);

		if(isNaN(allToOptions['row'][x][number]))
			allToOptions['row'][x][number].delete(column);
		if(isNaN(allToOptions['col'][x][number]))
			allToOptions['col'][x][number].delete(row);

	}

	return oneOption;
}


function readTextFile(filename, callback){
	var fs2 = require('fs') 
	fs2.readFile(filename, (err, data) => { 
		if (err) throw err; 
		callback(data.toString());
	}) 
}

function generateStartingOptions(board){
	var options = [];
	for(var i = 0; i < 9; i++){
		var arr = [];
		for(var j = 0;j < 9;j++){
			arr.push(new Set([1,2,3,4,5,6,7,8,9]));
		}
		options.push(arr);
	}

	var oneOption = []
	var zeros = 0;
	//remove from options
	for(var i = 0; i < 9; i++){
		for(var j = 0;j < 9;j++){
			if(!board[i][j] == 0) {
				var out = removeFromAll_simple(i,j,board[i][j],options);

				out.forEach((pair)=>{
					if(board[pair[0]][pair[1]] == 0)
						oneOption.push(pair);
				});
			}
		}
	}

	return [options,oneOption];
}

function isSolved(board) {
	for(var i = 0; i < 9; i++){
		var row = 0;
		var col = 0;
		var curSq = 0;
		var sqI = Math.trunc(i /3) * 3;
		var sqJ = (i % 3) * 3;
		for(var j = 0; j < 9; j++){
			row += board[i][j];
			col += board[j][i];
			var sqI_Curr = sqI + Math.trunc(j/3);
			var sqJ_Curr = sqJ + j % 3;
			curSq += board[sqI_Curr][sqJ_Curr];
		}

		if((row + col + curSq) != (3 * 45))
		{
			return false;
		}
	}
	return true;
}

function solveSimpleBoard(board){
	var output = generateStartingOptions(board);
	var options = output[0];
	var oneOption = output[1];

	while(oneOption.length > 0){
		
		var i_j_pair = oneOption.splice(0,1)[0];
		var i = i_j_pair[0];
		var j = i_j_pair[1];
		if(board[i][j] == 0){
			var value = options[i][j].keys().next().value;
			board[i][j] = value;
			var out = removeFromAll_simple(i,j,value,options);
			out.forEach((pair)=>{
				if(board[pair[0]][pair[1]] == 0)
					oneOption.push(pair);
			})
		}
	}

	return board;
}