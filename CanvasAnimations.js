//import {Circle} from "./Circle";
//import {Line} from "./Line";

//Getting canvas elements from DOM (Document Object Model)
var canvasGraph = document.getElementById('canvasGraph');
var canvasADT = document.getElementById('canvasADT');
var canvasPseudocode = document.getElementById('canvasPseudocode'); 

//Getting the context of canvasGraph element which is required for drawing
const ctx = canvasGraph.getContext('2d'); 
const ctxADT = canvasADT.getContext('2d');
const ctxPseudocode = canvasPseudocode.getContext('2d');



console.log(canvasGraph.width);

/**
 * 
 * @param {*} min - The minimum value returned by the random number generator
 * @param {*} max - The maximum value returned by the random number generator
 * @param {*} radius - The radius of the circle required ...
 * @returns 
 */
function getRandomCoordinates(min, max, radius) {
  return Math.random() * (max - (min + radius + 1)) + min;
}

//To-do fixed coordinates
// var fixedNodeCoordinates[]{
// 	{x: }
// }

var radius = 30;
const c1 = new Circle(ctx, getRandomCoordinates(0,canvasGraph.width, radius), getRandomCoordinates(0,canvasGraph.height, radius) , radius);
const c2 = new Circle(ctx, getRandomCoordinates(0,canvasGraph.width, radius), getRandomCoordinates(0,canvasGraph.height, radius) , radius);
const c3 = new Circle(ctx, getRandomCoordinates(0,canvasGraph.width, radius), getRandomCoordinates(0,canvasGraph.height, radius) , radius);

//Draw Circle
c1.drawCircle();
c2.drawCircle();
c3.drawCircle();

//Draw Static lines
const line1 = new Line(ctx, c1.x, c1.y, c2.x, c2.y);
const line2 = new Line(ctx, c2.x, c2.y, c3.x, c3.y);

line1.drawLine("black");
line2.drawLine("black");

//Draw Static Lines for Stack
const stackLine1 = new Line(ctxADT, canvasADT.width*0.1, canvasADT.height*0.1, canvasADT.width*0.1, canvasADT.height*0.9);
const stackLine2 = new Line(ctxADT, canvasADT.width*0.1, canvasADT.height*0.9, canvasADT.width*0.9, canvasADT.height*0.9);
const stackLine3 = new Line(ctxADT, canvasADT.width*0.9, canvasADT.height*0.9, canvasADT.width*0.9, canvasADT.height*0.1);

stackLine1.drawLine('black');
stackLine2.drawLine('black');
stackLine3.drawLine('black');


//Highlight text in canvasPseudocode
ctxPseudocode.strokeText("Karan", canvasPseudocode.width*0.1, canvasPseudocode.height*0.1);


//Defining an Array of lists containing key-value pairs of two circles which are at the two ends of a line
var circleCoordinates = [];
//Method for adding the values to the circleCoordinates array
circleCoordinates.push(
	{startNode: c1, endNode: c2},
	{startNode: c2, endNode: c3}
);

//Variable which is iterated over in the drawAnimatedPath procedure
var frame = 0;
//Difference in x-coordinates of the two circles
var xDiff = c2.x - c1.x;
//Difference in y-coordinates of the two circles
var yDiff = c2.y - c1.y;
var speed = 100;

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

//Method for animating a line being drawn between two circles as that line is being visited along
function animate(){
	var xDiff;
	var yDiff;
	
	for(let i = 0; i< circleCoordinates.length; i++){
		//Getting the list at index i from the circleCoordinates array and retrieving the start node value from it
		startNode = circleCoordinates[i].startNode;
		//Getting the list at index i from the circleCoordinates array and retrieving the end node value from it
		endNode = circleCoordinates[i].endNode;
		//Difference in x-coordinates of the two circles
		xDiff = endNode.x - startNode.x;
		//Difference in y-coordinates of the two circles
		yDiff = endNode.y - startNode.y;
		drawAnimatedPath();
	}
}



//Animating the whole algorithm
animate();
