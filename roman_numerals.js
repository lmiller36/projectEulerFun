var express = require('express');
// var combinations = require('./combination.js')();

var app = express();
app.use(express.static(__dirname + '/')); //__dir and not _dir
var port = 8000; // you can use any port
app.listen(port);
console.log('server on ' + port);

var fs = require('fs');

var numeralsDict = {
	"I" : 1,
	"V" : 5,
	"X" : 10,
	"L" : 50,
	"C" : 100,
	"D" : 500,
	"M" : 1000,
	"Z" : 5000
}

var up = {
	"I" : "IV",
	"X" : "XL",
	"C" : "CD",
	"M" : 1000,
	"Z" : 5000
}

function getSum(inefficient) {
	var characters = inefficient.length;
	// console.log("original:"+inefficient+" chars:"+characters);
	var lastValue = 10000000;
	var curr = "C";
	var inARow = 0;
	var inefficientTotal = 0;
	var skip = false;
	var fours = 0;
	for(var i = 0;i < characters;i++){
		var char = inefficient.substring(i,i+1);
		var value = numeralsDict[char];

		// same value
		if(value == lastValue){
			inARow++;
		}

		// lower value
		else if(value < lastValue){
			if(!skip){
				if(inARow == 4)fours++;
				skip = false;
				inefficientTotal += inARow * numeralsDict[curr];
			}
			curr = char;
			lastValue = value;
			inARow = 1;
		}

		else {
			inefficientTotal += value - lastValue;
			curr = char;
			lastValue = value;
			inARow = 1;
			skip = true;
		}
	}
	if(!skip){
		inefficientTotal += inARow * numeralsDict[curr];
	}
	return inefficientTotal;
}

function correctRomanNumeral(inefficient){
	if(inefficient >= 1000){
		var thousandsPlace = Math.trunc(inefficient/1000);
		var thousandsPlaceStr = "";
		var remainder = inefficient % 1000;

		if(thousandsPlace <= 4){
			for(var i = 0; i < thousandsPlace;i++) thousandsPlaceStr += "M";
				return thousandsPlaceStr + correctRomanNumeral(inefficient % 1000);
		}
		// else return "IV" + correctRomanNumeral(inefficient % 1000);
		else if(thousandsPlace == 4)return "IV" + correctRomanNumeral(remainder);
		else if(thousandsPlace == 9) return "IX" + correctRomanNumeral(remainder);
		else return "V" + correctRomanNumeral(inefficient - 5000);
	}
	else if(inefficient >= 100){
		var hundredsPlace = Math.trunc(inefficient / 100);
		var hundredsPlaceStr = "";
		var remainder = inefficient % 100;
		if(hundredsPlace <= 3){
			for(var i = 0; i < hundredsPlace;i++) hundredsPlaceStr += "C";
				return hundredsPlaceStr + correctRomanNumeral(remainder);
		}
		else if(hundredsPlace == 4)return "CD" + correctRomanNumeral(remainder);
		else if(hundredsPlace == 9) return "CM" + correctRomanNumeral(remainder);
		else return "D" + correctRomanNumeral(inefficient - 500);
	}
	else if(inefficient >= 10){
		var tensPlace = Math.trunc(inefficient / 10);
		var tensPlaceStr = "";
		var remainder = inefficient % 10;
		if(tensPlace <= 3){
			for(var i = 0; i < tensPlace;i++) tensPlaceStr += "X";
				return tensPlaceStr + correctRomanNumeral(remainder);
		}
		else if(tensPlace == 4)return "XL" + correctRomanNumeral(remainder);
		else if(tensPlace == 9) return "XC" + correctRomanNumeral(remainder);

		else return "L" + correctRomanNumeral(inefficient - 50);
	}
	else if(inefficient >= 1){
		var onesPlaceStr = "";
		if(inefficient <= 3){
			for(var i = 0; i < inefficient;i++) onesPlaceStr += "I";
				return onesPlaceStr;
		}
		else if(inefficient == 4)return "IV";
		else if(inefficient == 9) return "IX";
		else return "V" + correctRomanNumeral(inefficient - 5);
	}
	else return "";
}

var map = {
	5000: "V",
	4000: "IV",
	1000: "M",
	900: "CM",
	500: "D",
	400: "CD",
	100: "C",
	90: "XC",
	50: "L",
	40:"XL",
	10:"X",
	9:"IX",
	5:"V",
	4:"IV",
	1:"I"

}

    // static {

    //     map.put(1000, "M");
    //     map.put(900, "CM");
    //     map.put(500, "D");
    //     map.put(400, "CD");
    //     map.put(100, "C");
    //     map.put(90, "XC");
    //     map.put(50, "L");
    //     map.put(40, "XL");
    //     map.put(10, "X");
    //     map.put(9, "IX");
    //     map.put(5, "V");
    //     map.put(4, "IV");
    //     map.put(1, "I");

 //   }

 function floorKey(number) {
 	var x = [1,4,5,9,10,40,50,90,100,400,500,900,1000,4000,5000];
 	var i = 0;
 	while(number - x[i + 1] >= 0)i++;
 	return x[i];

 }

 function toRoman(number) {
 	var l = floorKey(number);
 	if ( number == l ) {
 		return map[number];
 	}
 	return map[l] + toRoman(number-l);
 }

 readInBoards();
 function readInBoards(){
 	readTextFile("roman_numerals.txt",(file)=>{
 		var lines = file.split("\n");
 		var fours = 0;

		// console.log(correctRomanNumeral(lines[0]));
		// lines = ["XXXXVIIII"]
		var total = 0;
		var smaller = 0;
		for(var i = 0;i < lines.length;i++){
			var numeral = lines[i];
			inefficientTotal = getSum(numeral);
			var correctRM = correctRomanNumeral(inefficientTotal);
			var javaV = toRoman(inefficientTotal);
			console.log(javaV);
			// if(javaV != correctRM) console.log("diff!!");
			total += numeral.length;
			smaller +=correctRM.length;
			// console.log(i+":"+"old:"+numeral+" new:"+correctRM+" sum:"+inefficientTotal+" diff:"+(numeral.length - correctRM.length));
		}	

		console.log(total - smaller);
	})
 }

 function readTextFile(filename, callback){
 	var fs2 = require('fs') 
 	fs2.readFile(filename, (err, data) => { 
 		if (err) throw err; 
 		callback(data.toString());
 	}) 
 }
