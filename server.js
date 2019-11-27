var express = require('express');
var combinations = require('./combination.js')();

var app = express();
app.use(express.static(__dirname + '/')); //__dir and not _dir
var port = 8000; // you can use any port
app.listen(port);
console.log('server on ' + port);

var fs = require('fs');

var primes = {};
var primeList = [];
var primeFactorizations = {};
// function genPrimes(numPrimes){
// 	primes[2] = 1;
// 	primes[3] = 1;
// 	primes[5] = 1;
// 	primeList.push(2);
// 	primeList.push(3);
// 	primeList.push(5);
// 	for(var i = 7; i < numPrimes; i++){
// 		var prime = 1;
// 		var j = 3;
// 		if(i % 2 == 0 || i % 3 == 0 || i % 5 == 0) prime = 0;

// 		while(j < primeList.length && prime)
// 		{
// 			if(i % primeList[j] == 0)prime = 0;
// 			j++;
// 		}
// 		if(prime){
// 			primeList.push(i);
// 			primes[i] = 1;
// 		}
// 	}
// }

doStuff();



function doStuff(){
	readTextFile('primes.txt',(data)=>{
		var lines = data.split("\n");
		for(var i = 0;i < lines.length;i++){
			var line = lines[i].split(",");
			line.forEach((primeStr)=>{
				var prime = parseInt(primeStr);
				primes[prime] = prime - 1;
				primeList.push(prime);
			});
		}
		// console.log(primes);
		// console.log(primeList);
		var unique = 0;
		for(var i = 2; i <= 1000000;i++){
			if(i % 1000 == 0)console.log(i);
			if(primes[i]){
				primeFactorizations[i] = {};
				primeFactorizations[i][i] = 1;
				unique += i - 1;
				// console.log("add:"+i+" "+(i-1));
			}
			else{
				// console.log("noti);
				var j = 0;
				while(i % primeList[j] != 0)j++;
				var prime = primeList[j];
				var remainder = i / prime;
				var map = JSON.parse(JSON.stringify(primeFactorizations[remainder]));
				var before = map[prime] ? map[prime] : 0;
				map[prime] = before + 1;
				primeFactorizations[i] = map;
				var keys = Object.keys(map);
				// var num = 900;
				var total = i;
				// var arr = [2,3,5];

				for(var j = 1; j <= keys.length;j++){
					var combos = k_combinations(keys,j);
					combos.forEach((combination)=>{
						var multiple = combination.reduce( (a,b) => a * b );
						if(j % 2 == 1)total-= i / multiple;
						else total+= i / multiple;
					})
				}
				// console.log(i+":"+total);
				unique+=total;
				// // // console.log(map);
				// var keys = Object.keys(map);
				// var total = 1;
				// keys.forEach((key) => {
				// 	var biggest = Math.pow(key,map[key]);
				// 	console.log(biggest);
				// 	console.log(primes[biggest]);
				// 	total *= primes[biggest];
				// 	// console.log(primes[key]);
				// 	// total -= primes[key];
				// 	// primes[key]++;
				// });
				// // con
				// primes[i] = total;
				// // total -= 2;
				// console.log(i+":"+total);
				// unique += total;

			}
		}
		console.log(unique);
	});

		// allInts = lines.map(function(line){
		// 	var ints = line.split(",").map(function(integer){
		// 		return parseInt(integer);
		// 	});
		// 	return ints;
		// });
	// var max = 1000;
	// for(i = 1; i < max;i++){

	// }
// // Write data in 'Output.txt' . 
// fs.writeFile('primes.txt', str, (err) => { 

//     // In case of a error throw err. 
//     if (err) throw err; 
// }) 
	// readTextFile('triangles.txt',(data)=>{
	// 	var lines = data.split("\n");

	// 	allInts = lines.map(function(line){
	// 		var ints = line.split(",").map(function(integer){
	// 			return parseInt(integer);
	// 		});
	// 		return ints;
	// 	})


	// });

}

function readTextFile(filename, callback){
	var fs2 = require('fs') 
	fs2.readFile(filename, (err, data) => { 
		if (err) throw err; 
		callback(data.toString());
	}) 
}

			// var list = primeFactorizations[remainder].spli.split(",");
				// list.push(primeList[j]);
				// var str = list.sort().join(",");
				// console.log(primeFactorizations[remainder]);
				// console.log(primeFactorizations[remainder].splice(0))
				// var list = [...primeFactorizations[remainder]];
				// console.log(list);
				// list.push(primeList[j]);
				// list = list.sort();
				// console.log(list);
