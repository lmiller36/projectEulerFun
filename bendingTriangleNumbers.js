var express = require('express');
// var combinations = require('./combination.js')();

var app = express();
app.use(express.static(__dirname + '/')); //__dir and not _dir
var port = 8000; // you can use any port
app.listen(port);
console.log('server on ' + port);

var fs = require('fs');

// main();

var soloTriples = {};
pythagoreanTriplets(3000000);
// console.log(soloTriples)
var total = 0;
var keys = Object.keys(soloTriples);
for(var x = 0; x < keys.length;x++){
	// console.log(keys[x]+":"+soloTriples[keys[x]]);
	if(soloTriples[keys[x]].length == 1)total++;
}
console.log(total+"/"+Object.keys(soloTriples).length);


function pythagoreanTriplets(limit) { 

        // triplet: a^2 + b^2 = c^2 
        var a, b, c = 0; 

        // loop from 2 to max_limit
        var m = 2; 

        // Limiting c would limit 
        // all a, b and c 
        while (c <= limit) { 

            // now loop on j from 1 to i-1 
            for (var n = 1; n <= m; ++n) { 
                // Evaluate and print 
                // triplets using 
                // the relation between 
                // a, b and c 
                a = m * m - n * n; 
                b = 2 * m * n; 
                c = m * m + n * n; 

                var sum = a + b + c;
                if(sum <= 1500000 && (a*a + b*b == c*c) && a > 0 && b > 0 && c > 0)
                {
                	addIfUnique([a,b,c],sum);
                	// if(soloTriples[sum])soloTriples[sum].push([a,b,c]);
                	// else{
                	// 	soloTriples[sum] =[];
                	// 	soloTriples[sum].push([a,b,c]);
                	// }
                	// var add = soloTriples[sum] ? soloTriples[sum] : 0;
                	// soloTriples[sum] = add + 1;

                	// var j = 2;
                	var x = sum + sum;
                	while(x <= 1500000){
                		addIfUnique([a,b,c],x);
                		// if(soloTriples[x])soloTriples[x].push([a,b,c]);
                		// else soloTriples[x] =[[a,b,c]];
                		// var add = soloTriples[x] ? soloTriples[x] : 0;
                		// soloTriples[x] = add + 1;
                		x += sum;
                		// j++;
                	}
                	// for(var x = sum; x <= 1500000; x += ){
                	// 	var add = soloTriples[x] ? soloTriples[x] : 0;
                	// 	soloTriples[x] = add + 1;
                	// }
                	// if(soloTriples[sum])soloTriples[sum] = soloTriples[sum] + 1;
                	// else soloTriples[sum] = 1;
                }

                // console.log(a+" "+b+" "+c)

                // if (c > limit) 
                // 	break; 

                // var sum = a + b + c;
                // if(sum < limit)
                // {
                // 	if(soloTriples[sum])soloTriples[sum] = 0;
                // 	else soloTriples[sum] = 1;
                // }
            } 
            m++; 
        } 
    } 

    function addIfUnique(arr, sum){
    	arr.sort(function(a, b){return a-b});
    	if(!soloTriples[sum]){
    		soloTriples[sum] = [arr];
    	}
    	else{
    		// check that it's unique
    		for(var i = 0; i < soloTriples[sum].length;i++){
    			var curr = soloTriples[sum][i];
    			if(arr[0] > curr[0] && arr[0] % curr[0] == 0){
    				var multiple = arr[0] / curr[0];
    				if(arr[1]  > curr[1] && arr[0] / curr[0] == multiple){
    					if(arr[2]  > curr[2] && arr[2] / curr[2] == multiple){
    							return;
    					}
    				}
    			}
    		}
    		soloTriples[sum].push(arr);
    	}
    }

    function main(){
    	readTextFile("primes1_million.txt",(primesStr)=>{
    		var perfectSquares = {};
    		var i = 1;
    		var currSq = 0;

    		var primitiveTriples = {};
		// console.log(perfectSquares);
		// var primes = [];
		// var primesSplit = primesStr.split("\n");
		// primesSplit.forEach((line)=>{
		// 	line.split(",").forEach((prime)=>primes.push(parseInt(prime)));
		// });	
		// console.log(primes.length);
		// primesSplit[0].split(",").forEach((prime)=>primes.push(parseInt(prime)));
		// primesSplit[1].split(",").forEach((prime)=>primes.push(parseInt(prime)));
		// var primes = primes.split("\n")[0].split("\,").map((num)=>parseInt(num));
		// console.log(primes);
		// var i = 1;
		// var max = primes[primes.length - 1];
		max = 0;
		// console.log(max);
		while(currSq <= max * max){
			currSq = i * i;
			perfectSquares[currSq] = i;
			i++;
		}
		i = 2;
		// console.log(perfectSquares);
		
		// console.log(primes.length);
		while(i <= max){

			var j = 1;
			// while(j < primes.length){
			// 	var sum = i * i + primes[j] * primes[j];
			// 	if(perfectSquares[sum]){
			// 		var sumOfLegs = i + primes[j]+perfectSquares[sum];
			// 		console.log(i+" "+primes[j]+" "+perfectSquares[sum]);
			// 		if(!primitiveTriples[sumOfLegs]) primitiveTriples[sumOfLegs] = [];
			// 		var arr = [i,primes[j],perfectSquares[sum]];		
			// 		primitiveTriples[sumOfLegs].push(arr);
			// 	}
			// 	j++;
			// }

			while(j <= max){
				var sum = i * i + j * j;
				if(perfectSquares[sum]){
					var sumOfLegs = i +j+perfectSquares[sum];
					// console.log(i+" "+j+" "+perfectSquares[sum]);
					if(!primitiveTriples[sumOfLegs]) primitiveTriples[sumOfLegs] = [];
					var arr = [i,j,perfectSquares[sum]];		
					primitiveTriples[sumOfLegs].push(arr);
				}
				j+=2;
			}

			i+=2;
		}
		console.log(primitiveTriples);
		// for(var i = 3;i <= max)
	});

    }


    function readTextFile(filename, callback){
    	var fs2 = require('fs') 
    	fs2.readFile(filename, (err, data) => { 
    		if (err) throw err; 
    		callback(data.toString());
    	}) 
    }