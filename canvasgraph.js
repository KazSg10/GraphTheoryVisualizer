window.innerHeight *= 0.85;
window.innerWidth = window.innerWidth/2;
var canvas = createCanvas('canvasgraph', window.innerWidth, window.innerHeight);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var resize = () =>{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);


var ctx = canvas.getContext('2d');
ctx.fillStyle="gray";
ctx.fillRect(0,0, canvas.width, canvas.height);


class Line {
	constructor(x1, y1, x2, y2){
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;

	}
	drawLine(color){
		
		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.strokeStyle=color;
		ctx.lineWidth=10;
		ctx.stroke();
	}
}

//Draw Static lines to separate animation regions
const lineForRegionA = new Line(window.innerWidth * 0.5, 0, window.innerWidth * 0.5, window.innerHeight);
const lineForRegionB = new Line(window.innerWidth * 0.5, window.innerHeight/2, window.innerWidth, window.innerHeight/2);

lineForRegionA.drawLine("yellow");
lineForRegionB.drawLine("yellow");




function getRandomCoordinates(min, max, radius) {
  return Math.random() * (max - (min + radius + 1)) + min;
}

class Circle{
	constructor(x, y, radius){
	this.x =x;
	this.y = y;
	this.radius = radius;
	}
	drawCircle(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		ctx.fillStyle="grey";
		ctx.fill();
		ctx.stroke();
	}
}



function c1EdgeCoordinates(){
	
}

var radius = 30;
const c1 = new Circle(getRandomCoordinates(0,innerWidth, radius), getRandomCoordinates(0,innerHeight, radius) , radius);
const c2 = new Circle(getRandomCoordinates(0,innerWidth, radius), getRandomCoordinates(0,innerHeight, radius) , radius);
const c3 = new Circle(getRandomCoordinates(0,innerWidth, radius), getRandomCoordinates(0,innerHeight, radius) , radius);







//Draw Circle
c1.drawCircle();
c2.drawCircle();
c3.drawCircle();

//Draw Static lines
const line1 = new Line(c1.x, c1.y, c2.x, c2.y);
const line2 = new Line(c2.x, c2.y, c3.x, c3.y);

line1.drawLine("black");
line2.drawLine("black");

var frame = 0;
var xDiff = c2.x - c1.x;
var yDiff = c2.y - c1.y;
var speed = 100;

var circleCoordinates = [];
circleCoordinates.push(
	{startNode: c1, endNode: c2},
	{startNode: c2, endNode: c3}
);

function animate(){
	var xDiff;
	var yDiff;
	var frameLocal = frame;
	
	for(let i = 0; i< circleCoordinates.length && frameLocal == frame; i++){
		startNode = circleCoordinates[i].startNode;
		endNode = circleCoordinates[i].endNode;
		xDiff = endNode.x - startNode.x;
		yDiff = endNode.y - startNode.y;
		drawAnimatedPath();

	}

	
	
}

function drawAnimatedPath(){
	if(frame < speed - 1){
		requestAnimationFrame(drawAnimatedPath);
	}

	frame++; 
	var newX = (xDiff * (frame/speed) + startNode.x);
	var newY = (yDiff * (frame/speed) + startNode.y);
	
	ctx.beginPath();
	ctx.moveTo(startNode.x, startNode.y);
	ctx.lineTo(newX, newY);	
	ctx.strokeStyle="red";
	ctx.lineWidth=4;
	ctx.stroke();
}

//drawAnimatedPath(20);

// function calculatingPath(speed){
	// var pathCoordinates = [];
	// var xDiff = lineCoordinatesArray[1].x - lineCoordinatesArray[0].x;
	// var yDiff = lineCoordinatesArray[1].y - lineCoordinatesArray[0].y;
	
		// for(let j = 0; j < speed; j++){
			// var newX = (xDiff * (j/speed) + lineCoordinatesArray[0].x);
			// var newY = (yDiff * (j/speed) + lineCoordinatesArray[0].y);
			// pathCoordinates.push({x: newX, y: newY});
		// }
	
	// return pathCoordinates;
// }

	function createCanvas(id, width, height) {
		const body = document.getElementById('canvasplaceholder');
		const canvas = document.createElement('canvas');
		canvas.id=id;
		body.appendChild(canvas);
		return canvas;
	}

	animate();











// ctx.fillRect(100, 100, 100, 100);
// line
// ctx.beginPath();
// ctx.moveTo(50, 300);
// ctx.lineTo(200,100);
// ctx.lineTo(400,300);
// ctx.strokeStyle = "#fa2345";
// ctx.stroke();



// for(i = 0; i<3; i++){
	// ctx.beginPath();
	// var x = Math.random() * window.innerWidth;
	// var y = Math.random() * window.innerHeight;
	// ctx.arc(x, y, 30, 0, 2*Math.PI, false);
	// ctx.strokeStyle='blue';
	// ctx.stroke();
// }



// var x = Math.random()*innerWidth;
// var y = Math.random()*innerHeight;
// var dx = Math.random() - 0.5;
// var dy = Math.random() - 0.5;
// var radius = 30;
// function animate(){
	// requestAnimationFrame(animate);
	// ctx.clearRect(0,0, innerWidth, innerHeight);
	// circle.draw();
	
	// ctx.beginPath();
	// ctx.arc(x, y, radius, 0, 2*Math.PI, false);
	// ctx.strokeStyle='blue';
	// ctx.stroke();
	
	// if(x + radius>innerWidth ||x-radius<0){
		// dx=-dx;
	// }
	// if(y + radius>innerHeight ||y-radius<0){
		// dy=-dy;
	// }
	
	// x+=dx;
	// y+=dy;
// }
// animate();