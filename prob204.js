var express = require('express');
// var combinations = require('./combination.js')();

var app = express();
app.use(express.static(__dirname + '/')); //__dir and not _dir
var port = 8000; // you can use any port
app.listen(port);
console.log('server on ' + port);

var fs = require('fs');

var primesUntil = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];
var totals = 0;

genPossible(1,1000000000,0);
console.log(totals);

function genPossible(curr,max,start){
    // console.log(curr);
    if(curr > max) return;
    totals ++;
    for(var i = start; i < primesUntil.length;i++){
        // console.log(primesUntil[i]);
        genPossible(curr * primesUntil[i],max,i);
    }
}

// genPrimes(5)
// for(var i = 3;i <= max; i++){

// }

function readTextFile(filename, callback){
 var fs2 = require('fs') 
 fs2.readFile(filename, (err, data) => { 
  if (err) throw err; 
  callback(data.toString());
}) 
}