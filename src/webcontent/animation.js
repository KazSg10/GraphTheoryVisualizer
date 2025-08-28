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

var frame;
var speed;
var circlesArray1;
var stepsList;
var startNode;
var endNode;
var index = 0;
var ctx;
var color = "red";
//(startNode, endNode, 1, 500, ctx)

function move(startNode, endNode, frame, speed, ctx, color) {
	//Difference in x-coordinates of the two circles
	 var xDiff = endNode.x - startNode.x;
	//Difference in y-coordinates of the two circles
	var yDiff = endNode.y - startNode.y;
	
	var newX = (xDiff * (frame/speed) + startNode.x);
	var newY = (yDiff * (frame/speed) + startNode.y);
	
	ctx.beginPath();
	ctx.moveTo(startNode.x, startNode.y);
	ctx.lineTo(newX, newY);	
	ctx.strokeStyle=color;
	ctx.lineWidth=4;
	ctx.stroke();	
}

//Method for animating a line being drawn between two circles as that line is being visited along
function traverseAlongLine(){
	move(startNode, endNode, frame, speed, ctx, color);
	if(frame < speed){
		frame++;
		//TODO Check Brackets
		requestAnimationFrame(traverseAlongLine);
	} else {
		color="yellow";
		startNode = endNode;
		endNode = null;
		getNewNode();
		frame = 1;
		requestAnimationFrame(traverseAlongLine);
	}
}

function getStepsList(jsonBody){
	return jsonBody.StepsList;
}



function animate(algorithm, circlesArray) {
	frame = 1;
	speed = 500;
	this.circlesArray1 = circlesArray;

	//Getting body from the local storage of the window
    var body = localStorage.getItem("body");
	console.log(body);
    //Parsing body to json
    var jsonBody = readJsonBody(body);
    this.stepsList = jsonBody.StepsList;

    //Getting canvas elements from DOM (Document Object Model)
    var canvasGraph = document.getElementById('canvasGraph');
    var canvasADT = document.getElementById('canvasADT');
    var canvasPseudocode = document.getElementById('canvasPseudocode'); 

    //Getting the context of canvasGraph element which is required for drawing
    ctx = canvasGraph.getContext('2d'); 
    const ctxADT = canvasADT.getContext('2d');
    const ctxPseudocode = canvasPseudocode.getContext('2d');
	getNewNode();
	window.requestAnimationFrame(traverseAlongLine);
}

function getNewNode() {
	for(let i = index; i < Object.keys(stepsList).length; i++){
		var visitedNodeName = stepsList[i].VisitedNodeName;
		var pseudoCodeLine = stepsList[i].PseudoCodeLine;
		if(stepsList[i].StackEntry != null){
			var stackEntryValue = stepsList[i].StackEntry.Value;
			var stackEntryAction = stepsList[i].StackEntry.Action;
		}

		if(visitedNodeName != null){
			if(startNode != null){
				endNode = getCircle(visitedNodeName, circlesArray1);
			}
			else{
				startNode = getCircle(visitedNodeName, circlesArray1);
			}
			if((startNode != null) && (endNode != null)){
				index = ++i;
				return;
			}
		}
		
	}
}




//Animating the whole algorithm
//traverseAlongLine
