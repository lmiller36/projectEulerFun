var express = require('express');

var app = express();
app.use(express.static(__dirname + '/')); //__dir and not _dir
var port = 8000; // you can use any port
app.listen(port);
console.log('server on ' + port);


class point{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}

	getQuadrant(){
		if(this.x > 0 && this.y > 0) return 1;
		if(this.x < 0 && this.y > 0) return 2;
		if(this.x < 0 && this.y < 0) return 3;
		if(this.x > 0 && this.y < 0) return 4;
	}
}

class triangle{
	// constructor(points){
	// 	this.point1 = new point(points[0],points[1]);
	// 	this.point2 = new point(points[2],points[3]);
	// 	this.point3 = new point(points[4],points[5]);
	// }
	constructor(point1,point2,point3){
		this.point1 = point1;
		this.point2 = point2;
		this.point3 = point3;
	}

	area(){

		var a = this.point1.x * (this.point2.y - this.point3.y);
		var b = this.point2.x * (this.point3.y - this.point1.y);
		var c = this.point3.x * (this.point1.y - this.point2.y);
		return Math.abs((a + b + c) / 2.0);
	}

	crossOrigin(){
		// var q1 = this.point1.getQuadrant();
		// var q2 = this.point2.getQuadrant();
		// var q3 = this.point3.getQuadrant();
		// console.log(this.point1.getQuadrant());
		// console.log(this.point2.getQuadrant());
		// console.log(this.point3.getQuadrant());
		// console.log(this);
		var miniTriangle_12origin = new triangle(this.point1,this.point2,new point(0,0));
		var miniTriangle_13origin = new triangle(this.point1,this.point3,new point(0,0));
		var miniTriangle_23origin = new triangle(this.point2,this.point3,new point(0,0));

		var area1 = miniTriangle_12origin.area();
		var area2 = miniTriangle_13origin.area();
		var area3 = miniTriangle_23origin.area();
		var totalArea = this.area();
		var sum = (area1+area2+area3);

		// console.log(area1 +" "+area2+" "+area3);
		// console.log(totalArea);
		// console.log(sum);

		

		var diff = Math.abs(sum - totalArea);

		return diff < .1;

		// console.log(this);
		// // all below y axis
		// if(q1 < 3 && q2 < 3 && q3 < 3){
		// 	console.log(1);
		// 	return false;
		// } 

		// // all above y axis
		// if(q1 >= 3 && q2 >= 3 && q3 >= 3){
		// 	console.log(2);
		// 	return false;
		// }

		// // all right of x axis
		// if(this.point1.x > 0 && this.point2.x > 0 && this.point3.x > 0){
		// 	console.log(3);
		// 	return false;
		// }

		// // all left of x axis
		// if(this.point1.x < 0 && this.point2.x < 0 && this.point3.x < 0){
		// 	console.log(4);
		// 	return false;
		// }
		// console.log("still good!");


	}
}

doStuff();

function doStuff(){
	// A(-340,495), B(-153,-910), C(835,-947)

	// X(-175,41), Y(-421,-714), Z(574,-645)
	// var triangleABC = new triangle(new point(-340,495), new point(-153,-910), new point(835,-947));
	// console.log(triangleABC.crossOrigin());

	// var triangleXYZ = new triangle(new point(-175,41), new point(-421,-714), new point(574,-645));
	// console.log(triangleXYZ.crossOrigin());

	var allInts;

	// var triangle1 = new triangle(new point(0,0),new point(1,0),new point(1,1));
	// console.log(triangle1);
	// console.log(triangle1.area());


	readTextFile('triangles.txt',(data)=>{
		var lines = data.split("\n");

		allInts = lines.map(function(line){
			var ints = line.split(",").map(function(integer){
				return parseInt(integer);
			});
			return ints;
		})

		// console.log(allInts);
		// var triangleXYZ = new triangle(new point(-175,41), new point(-421,-714), new point(574,-645));
		// console.log(triangleXYZ);
		var count = 0;
		for(var i = 0;i < allInts.length;i++){
			var points = allInts[i];
			var currTriangle = new triangle(new point(points[0],points[1]), new point(points[2],points[3]), new point(points[4],points[5]));
			if(currTriangle.crossOrigin())
				count++;
		}

		console.log(count);

	});

}

function readTextFile(filename, callback){
	var fs2 = require('fs') 
	fs2.readFile(filename, (err, data) => { 
		if (err) throw err; 
		callback(data.toString());
	}) 
}