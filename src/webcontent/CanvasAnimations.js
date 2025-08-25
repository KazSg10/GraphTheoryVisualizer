//Getting body from the local storage of the window
var body = localStorage.getItem("body");
//Parsing body to json
var jsonBody = readJsonBody(body);

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


//------------------------------------------
const circlesArray = createCircles(getNodeConnections(jsonBody), 30, ctx);
for(let i = 0; i < circlesArray.length; i++){
	circlesArray[i].drawCircle();
}
const edges =  drawEdges(circlesArray, ctx);
for(let i = 0; i < edges.length; i++){
	edges[i].drawLine("blue");
}


writePseudocode(jsonBody.Pseudocode, ctxPseudocode, canvasPseudocode);


//Draw Circle
// c1.drawCircle();
// c2.drawCircle();
// c3.drawCircle();

//Draw Static lines
// const line1 = new Line(ctx, c1.x, c1.y, c2.x, c2.y);
// const line2 = new Line(ctx, c2.x, c2.y, c3.x, c3.y);

// line1.drawLine("black");
// line2.drawLine("black");

//Draw Static Lines for Stack
const stackLine1 = new Line(ctxADT, canvasADT.width*0.1, canvasADT.height*0.1, canvasADT.width*0.1, canvasADT.height*0.9);
const stackLine2 = new Line(ctxADT, canvasADT.width*0.1, canvasADT.height*0.9, canvasADT.width*0.9, canvasADT.height*0.9);
const stackLine3 = new Line(ctxADT, canvasADT.width*0.9, canvasADT.height*0.9, canvasADT.width*0.9, canvasADT.height*0.1);

stackLine1.drawLine('black');
stackLine2.drawLine('black');
stackLine3.drawLine('black');





//Defining an Array of lists containing key-value pairs of two circles which are at the two ends of a line
// var circleCoordinates = [];
// //Method for adding the values to the circleCoordinates array
// circleCoordinates.push(
// 	{startNode: c1, endNode: c2},
// 	{startNode: c2, endNode: c3}
// );

// //Variable which is iterated over in the drawAnimatedPath procedure
// var frame = 0;
// //Difference in x-coordinates of the two circles
// var xDiff = c2.x - c1.x;
// //Difference in y-coordinates of the two circles
// var yDiff = c2.y - c1.y;
// var speed = 100;


//Method for animating a line being drawn between two circles as that line is being visited along
function traverseAlongLine(startNode, endNode){
	//Difference in x-coordinates of the two circles
	 var xDiff = endNode.x - startNode.x;
	//Difference in y-coordinates of the two circles
	var yDiff = endNode.y - startNode.y;
		
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

function readJsonBody(body){
	//Parsing the body into Json form
	const jsonBody = JSON.parse(body);
	// var numberOfNodes = jsonBody.Graph.nodesList.length;
	// var nodeConnections = jsonBody.Graph.NodeConnections;
	// var pseudocode = jsonBody.Pseudocode;
	// var stepsList = jsonBody.StepsList;
	// console.log();
	// console.log(pseudocode);
	return jsonBody;
}

function getNodeConnections(jsonBody){
	return jsonBody.Graph.NodeConnections;
}

function createCircles(nodeConnections, radius, ctx){
	const circles = [];
	var length = Object.keys(nodeConnections).length;
	var keys = Object.keys(nodeConnections);
	for(let i = 0; i < length; i++){
		circles.push(new Circle(keys[i], ctx, getRandomCoordinates(0,canvasGraph.width, radius), getRandomCoordinates(0,canvasGraph.height, radius) , radius))
	}
	return circles;
}

function writePseudocode(pseudocode, ctx, canvas){
	//Highlight text in canvasPseudocode
	//ctx.strokeText("Karan", canvas.width*0.1, canvas.height*0.1);
	var length = Object.keys(pseudocode).length;
	ctx.font = "10pt Arial";
	var height = 5;
	for(let i = 0; i < length; i++){
		height += 22;
		ctx.fillText(pseudocode[i], 0, height, canvas.width);
		ctx.fillStyle = "#ff2f00ff";
	}
}

function getStepsList(jsonBody){
	return jsonBody.StepsList;
}

function drawEdges(circlesArray, ctx){
	var NodeConnections = getNodeConnections(jsonBody);
	var keys = Object.keys(NodeConnections);
	var edges = [];
	var length = keys.length;
	for(let i = 0; i<length; i++){
		var key = keys[i];
		var valuesList = NodeConnections[key];
		var node1 = getCircle(key, circlesArray);
		for (let j = 0; j < valuesList.length; j++) {
			var node2 = getCircle(valuesList[j].Name, circlesArray);
			edges.push(new Line(ctx, node1.x, node1.y, node2.x, node2.y));
		}
	}
	return edges;
}

function getCircle(key, circlesArray){
	var length = circlesArray.length;
	for(let i = 0; i < length; i++){
		if(circlesArray[i].name == key){
			return circlesArray[i];
		}		
	}
}



//Animating the whole algorithm
//animate();
